# 🎯 角色權限設計 - 兩種方案對比

## 問題：重複定義

你發現了一個很好的問題：

```typescript
// ❌ 在 roles.ts 定義
export const RolePermissions = {
    BASIC_SYSTEM: [UserRole.SITE_MANAGER, UserRole.ADMIN],
}

// ❌ 在 app.routes.ts 又定義一次
{
    path: 'basic-system/log',
    data: { roles: [UserRole.SITE_MANAGER, UserRole.ADMIN] }  // 重複！
}
```

**問題**：
- 維護困難：改權限要改兩個地方
- 容易出錯：可能忘記同步更新
- 違反 DRY 原則

---

## ✅ 方案 1：只在路由中定義（簡單場景）

### 適用情況
- 權限只用於路由守衛
- 不需要在其他地方檢查權限
- 專案規模較小

### 實作

#### roles.ts
```typescript
export enum UserRole {
    ADMIN = 'admin',
    SITE_MANAGER = 'site_manager',
    SITE_DIRECTOR = 'site_director'
}

export const RoleDisplayNames: Record<UserRole, string> = {
    [UserRole.ADMIN]: '系統人員',
    [UserRole.SITE_MANAGER]: '場地管理員',
    [UserRole.SITE_DIRECTOR]: '場地經理'
};

// ❌ 移除 RolePermissions
```

#### app.routes.ts
```typescript
{
    path: 'basic-system/log',
    canActivate: [roleGuard],
    data: { roles: [UserRole.SITE_MANAGER, UserRole.ADMIN] }  // 👈 唯一定義處
}
```

### 優點
- ✅ 單一真相來源
- ✅ 權限和路由綁定，容易理解
- ✅ 程式碼簡潔

### 缺點
- ❌ 如果 Sidebar 需要檢查權限，要重複定義
- ❌ 無法集中查看所有權限設定

---

## ✅ 方案 2：集中管理權限（推薦 ⭐）

### 適用情況
- 權限需要在多處使用（路由、Sidebar、按鈕等）
- 需要集中管理權限
- 專案規模較大

### 實作

#### roles.ts
```typescript
export enum UserRole {
    ADMIN = 'admin',
    SITE_MANAGER = 'site_manager',
    SITE_DIRECTOR = 'site_director'
}

export const RoleDisplayNames: Record<UserRole, string> = {
    [UserRole.ADMIN]: '系統人員',
    [UserRole.SITE_MANAGER]: '場地管理員',
    [UserRole.SITE_DIRECTOR]: '場地經理'
};

// ✅ 集中管理權限
export const ModulePermissions = {
    BASIC_SYSTEM: [UserRole.SITE_MANAGER, UserRole.ADMIN],
    EXTERNAL_SYSTEM: [UserRole.SITE_DIRECTOR, UserRole.ADMIN],
    PAYMENT_SYSTEM: [UserRole.ADMIN],
    PARKING_SYSTEM: [UserRole.SITE_MANAGER, UserRole.SITE_DIRECTOR, UserRole.ADMIN]
} as const;

// ✅ 功能模組 ID
export enum ModuleId {
    BASIC_SYSTEM = 'basic-system',
    EXTERNAL_SYSTEM = 'external-system',
    PAYMENT_SYSTEM = 'payment-system',
    PARKING_SYSTEM = 'parking-system'
}
```

#### app.routes.ts（引用權限定義）
```typescript
import { ModulePermissions } from './core/models/roles';

export const routes: Routes = [
    {
        path: 'main',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            // ✅ 引用集中定義的權限
            {
                path: 'basic-system/log',
                loadComponent: () => import('./features/basic-system/system-log.component')
                    .then(m => m.SystemLogComponent),
                canActivate: [roleGuard],
                data: { roles: ModulePermissions.BASIC_SYSTEM }  // 👈 引用
            },
            {
                path: 'external-system/vendor-data',
                loadComponent: () => import('./features/external-system/vendor-data.component')
                    .then(m => m.VendorDataComponent),
                canActivate: [roleGuard],
                data: { roles: ModulePermissions.EXTERNAL_SYSTEM }  // 👈 引用
            }
        ]
    }
];
```

#### sidebar.component.ts（同樣引用）
```typescript
import { ModulePermissions, ModuleId } from '../models/roles';

export class SidebarComponent {
    private authService = inject(AuthService);

    // ✅ 檢查使用者是否有權限訪問模組
    canAccessModule(moduleId: ModuleId): boolean {
        const user = this.authService.getCurrentUser();
        if (!user) return false;

        // 系統人員有所有權限
        if (user.role === UserRole.ADMIN) return true;

        // 檢查模組權限
        const allowedRoles = ModulePermissions[moduleId];
        return allowedRoles.includes(user.role);
    }

    // ✅ 過濾選單項目
    get visibleMenuItems(): MenuItem[] {
        return this.menuItems.filter(item => {
            switch (item.id) {
                case 'basic-system':
                    return this.canAccessModule(ModuleId.BASIC_SYSTEM);
                case 'external-system':
                    return this.canAccessModule(ModuleId.EXTERNAL_SYSTEM);
                case 'payment-system':
                    return this.canAccessModule(ModuleId.PAYMENT_SYSTEM);
                case 'parking-system':
                    return this.canAccessModule(ModuleId.PARKING_SYSTEM);
                default:
                    return false;
            }
        });
    }
}
```

### 優點
- ✅ 單一真相來源（權限定義在 `roles.ts`）
- ✅ 可在多處重用（路由、Sidebar、按鈕等）
- ✅ 集中管理，易於維護
- ✅ 修改權限只需改一個地方

### 缺點
- ⚠️ 稍微複雜一點（需要 import）

---

## 📊 兩種方案對比

| 特性 | 方案 1（只在路由） | 方案 2（集中管理） |
|------|------------------|------------------|
| **程式碼簡潔度** | ✅ 簡單 | ⚠️ 稍複雜 |
| **維護性** | ⚠️ 分散定義 | ✅ 集中管理 |
| **重用性** | ❌ 難以重用 | ✅ 易於重用 |
| **適用場景** | 小型專案 | 中大型專案 |
| **Sidebar 權限** | ❌ 需重複定義 | ✅ 直接引用 |
| **按鈕權限** | ❌ 需重複定義 | ✅ 直接引用 |

---

## 🎯 我的建議

### 對於你的專案：**使用方案 2（集中管理）** ⭐

**理由**：
1. 你有 Sidebar 需要根據權限顯示/隱藏選單
2. 未來可能有按鈕、功能需要權限控制
3. 4 個功能模組，權限設定不會太複雜
4. 集中管理更易於維護

### 實作步驟

1. **保留 `roles.ts` 中的 `ModulePermissions`**
2. **在路由中引用**：
   ```typescript
   data: { roles: ModulePermissions.BASIC_SYSTEM }
   ```
3. **在 Sidebar 中引用**：
   ```typescript
   canAccessModule(ModuleId.BASIC_SYSTEM)
   ```

---

## 💡 總結

### 你的觀察是對的！

**重複定義確實是問題**，應該選擇：

- **小型專案**：方案 1（只在路由定義）
- **中大型專案**：方案 2（集中管理） ⭐ **推薦**

**關鍵原則**：
> 權限定義應該只有一個地方，其他地方都引用它

這樣才能確保：
- ✅ 修改權限只需改一處
- ✅ 不會有同步問題
- ✅ 易於維護和擴展

需要我幫你實作方案 2 嗎？ 🚀
