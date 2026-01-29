# ✅ 方案 2 實作完成 - 集中權限管理

## 🎯 實作內容

### 1. 更新 `roles.ts` - 集中定義權限

```typescript
// ✅ 加入 ModuleId enum
export enum ModuleId {
    BASIC_SYSTEM = 'BASIC_SYSTEM',
    EXTERNAL_SYSTEM = 'EXTERNAL_SYSTEM',
    PAYMENT_SYSTEM = 'PAYMENT_SYSTEM',
    PARKING_SYSTEM = 'PARKING_SYSTEM'
}

// ✅ 集中管理權限（唯一定義處）
export const ModulePermissions: Record<ModuleId, readonly UserRole[]> = {
    [ModuleId.BASIC_SYSTEM]: [UserRole.SITE_MANAGER, UserRole.ADMIN],
    [ModuleId.EXTERNAL_SYSTEM]: [UserRole.SITE_DIRECTOR, UserRole.ADMIN],
    [ModuleId.PAYMENT_SYSTEM]: [UserRole.ADMIN],
    [ModuleId.PARKING_SYSTEM]: [UserRole.SITE_MANAGER, UserRole.SITE_DIRECTOR, UserRole.ADMIN]
};
```

### 2. 更新 `app.routes.ts` - 引用權限

```typescript
import { ModulePermissions, ModuleId } from './core/models/roles';

// ✅ 所有路由都引用 ModulePermissions
{
    path: 'basic-system/log',
    loadComponent: () => import('./features/basic-system/system-log.component')
        .then(m => m.SystemLogComponent),
    canActivate: [roleGuard],
    data: { roles: ModulePermissions[ModuleId.BASIC_SYSTEM] }  // 👈 引用，不重複定義
}
```

---

## 🎉 解決的問題

### ❌ 之前：重複定義

```typescript
// 問題 1：在 roles.ts 定義
export const RolePermissions = {
    BASIC_SYSTEM: [UserRole.SITE_MANAGER, UserRole.ADMIN],
}

// 問題 2：在 app.routes.ts 又定義一次
data: { roles: [UserRole.SITE_MANAGER, UserRole.ADMIN] }  // 重複！
```

### ✅ 現在：單一真相來源

```typescript
// ✅ 只在 roles.ts 定義一次
export const ModulePermissions = {
    [ModuleId.BASIC_SYSTEM]: [UserRole.SITE_MANAGER, UserRole.ADMIN],
}

// ✅ 其他地方都引用
data: { roles: ModulePermissions[ModuleId.BASIC_SYSTEM] }  // 引用
```

---

## 📊 權限對照表

| 功能模組 | ModuleId | 允許角色 |
|---------|----------|---------|
| 基礎系統 | `BASIC_SYSTEM` | 場地管理員、系統人員 |
| 外部系統 | `EXTERNAL_SYSTEM` | 場地經理、系統人員 |
| 金流系統 | `PAYMENT_SYSTEM` | 系統人員 |
| 停車系統 | `PARKING_SYSTEM` | 所有登入使用者 |

---

## 🔄 完整流程

### 場景：場地管理員訪問基礎系統

```
1. 使用者登入（role: SITE_MANAGER）
   ↓
2. 訪問 /main/basic-system/log
   ↓
3. authGuard 檢查 isAuthenticated() → ✅ 通過
   ↓
4. roleGuard 讀取 route.data['roles']
   → ModulePermissions[ModuleId.BASIC_SYSTEM]
   → [UserRole.SITE_MANAGER, UserRole.ADMIN]
   ↓
5. roleGuard 檢查 hasAnyRole([SITE_MANAGER, ADMIN]) → ✅ 通過
   ↓
6. 顯示頁面
```

---

## 💡 優點

### ✅ 單一真相來源
- 權限定義只在 `roles.ts` 一個地方
- 修改權限只需改一處

### ✅ 易於維護
```typescript
// 需要修改基礎系統權限？只改這裡！
[ModuleId.BASIC_SYSTEM]: [UserRole.SITE_MANAGER, UserRole.ADMIN]
```

### ✅ 可重用
```typescript
// 路由中使用
data: { roles: ModulePermissions[ModuleId.BASIC_SYSTEM] }

// Sidebar 中使用
canAccessModule(ModuleId.BASIC_SYSTEM)

// 按鈕中使用
*ngIf="hasPermission(ModuleId.BASIC_SYSTEM)"
```

### ✅ 類型安全
```typescript
// TypeScript 會檢查 ModuleId 是否存在
ModulePermissions[ModuleId.BASIC_SYSTEM]  // ✅ 正確
ModulePermissions['WRONG_ID']             // ❌ 編譯錯誤
```

---

## 🚀 下一步（可選）

### 1. 更新 Sidebar 使用 ModulePermissions

```typescript
// sidebar.component.ts
import { ModulePermissions, ModuleId, UserRole } from '../models/roles';

export class SidebarComponent {
    private authService = inject(AuthService);

    canAccessModule(moduleId: ModuleId): boolean {
        const user = this.authService.getCurrentUser();
        if (!user) return false;

        // 系統人員有所有權限
        if (user.role === UserRole.ADMIN) return true;

        // 檢查模組權限
        const allowedRoles = ModulePermissions[moduleId];
        return allowedRoles.includes(user.role);
    }

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

### 2. 建立權限檢查 Directive（進階）

```typescript
// has-permission.directive.ts
@Directive({
    selector: '[hasPermission]',
    standalone: true
})
export class HasPermissionDirective {
    private authService = inject(AuthService);
    private templateRef = inject(TemplateRef);
    private viewContainer = inject(ViewContainerRef);

    @Input() set hasPermission(moduleId: ModuleId) {
        const user = this.authService.getCurrentUser();
        if (!user) {
            this.viewContainer.clear();
            return;
        }

        const allowedRoles = ModulePermissions[moduleId];
        const hasPermission = user.role === UserRole.ADMIN || allowedRoles.includes(user.role);

        if (hasPermission) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}

// 使用
<button *hasPermission="ModuleId.PAYMENT_SYSTEM">金流設定</button>
```

---

## 📝 總結

### 實作完成 ✅

1. ✅ `roles.ts` - 加入 `ModuleId` 和 `ModulePermissions`
2. ✅ `app.routes.ts` - 所有路由引用 `ModulePermissions`
3. ✅ 解決重複定義問題
4. ✅ 實現單一真相來源

### 關鍵改變

**之前**：
```typescript
data: { roles: [UserRole.SITE_MANAGER, UserRole.ADMIN] }  // ❌ 重複定義
```

**現在**：
```typescript
data: { roles: ModulePermissions[ModuleId.BASIC_SYSTEM] }  // ✅ 引用定義
```

### 維護方式

**修改權限只需一步**：
```typescript
// 在 roles.ts 修改
[ModuleId.BASIC_SYSTEM]: [UserRole.SITE_DIRECTOR, UserRole.ADMIN]  // 改這裡就好！
```

所有引用此權限的地方（路由、Sidebar、按鈕等）都會自動更新！🎉
