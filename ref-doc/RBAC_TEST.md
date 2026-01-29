# 權限控制測試說明

## 功能概述

系統已實作完整的角色權限控制（RBAC - Role-Based Access Control），包括：
1. ✅ 登入驗證（使用 user.json）
2. ✅ 路由守衛（roleGuard）
3. ✅ 選單過濾（根據權限動態顯示/隱藏）

## 測試帳號與權限

### 1. 系統人員 (Admin)
- **帳號**: `admin`
- **密碼**: `admin123`
- **角色**: `ADMIN`
- **可見選單**:
  - ✅ 基礎系統
  - ✅ 外部系統
  - ✅ 金流系統
  - ✅ 路邊停車系統

### 2. 場地管理員 (Site Manager)
- **帳號**: `user01`
- **密碼**: `user123`
- **角色**: `SITE_MANAGER`
- **可見選單**:
  - ✅ 基礎系統
  - ❌ 外部系統（無權限）
  - ❌ 金流系統（無權限）
  - ✅ 路邊停車系統

### 3. 測試帳號 (User)
- **帳號**: `test`
- **密碼**: `test123`
- **角色**: `SITE_MANAGER`（映射為場地管理員）
- **可見選單**: 同 user01

## 權限對照表

| 模組 | ADMIN | SITE_MANAGER | SITE_DIRECTOR |
|------|-------|--------------|---------------|
| 基礎系統 | ✅ | ✅ | ❌ |
| 外部系統 | ✅ | ❌ | ✅ |
| 金流系統 | ✅ | ❌ | ❌ |
| 路邊停車系統 | ✅ | ✅ | ✅ |

## 測試步驟

### 測試 1: 管理員權限
1. 使用 `admin` / `admin123` 登入
2. 檢查左側選單應該顯示**所有 4 個模組**
3. 嘗試訪問任何頁面，都應該成功

### 測試 2: 場地管理員權限
1. 登出（如果已登入）
2. 使用 `user01` / `user123` 登入
3. 檢查左側選單應該**只顯示 2 個模組**：
   - ✅ 基礎系統
   - ✅ 路邊停車系統
4. **不應該看到**：
   - ❌ 外部系統
   - ❌ 金流系統
5. 嘗試直接在網址列輸入無權限的路由（例如 `/main/payment-system/payment-method`）
6. 應該被 `roleGuard` 阻擋並導向首頁

### 測試 3: 未登入狀態
1. 登出
2. 嘗試直接訪問 `/main` 或任何受保護的路由
3. 應該被 `authGuard` 導向登入頁

## 技術實作說明

### 1. 選單過濾機制
```typescript
// sidebar.component.ts
menuItems = computed(() => {
  const currentUser = this.authService.getCurrentUser();
  if (!currentUser) {
    return [];
  }

  return this.allMenuItems.filter(item => {
    if (!item.moduleId) {
      return true; // 沒有設定 moduleId 的項目所有人都可見
    }

    const allowedRoles = ModulePermissions[item.moduleId];
    return allowedRoles.includes(currentUser.role);
  });
});
```

### 2. 路由守衛
```typescript
// app.routes.ts
{
  path: 'basic-system/log',
  loadComponent: () => import('./features/basic-system/system-log.component'),
  canActivate: [roleGuard],
  data: { roles: ModulePermissions[ModuleId.BASIC_SYSTEM] }
}
```

### 3. 權限定義
```typescript
// roles.ts
export const ModulePermissions: Record<ModuleId, readonly UserRole[]> = {
  [ModuleId.BASIC_SYSTEM]: [UserRole.SITE_MANAGER, UserRole.ADMIN],
  [ModuleId.EXTERNAL_SYSTEM]: [UserRole.SITE_DIRECTOR, UserRole.ADMIN],
  [ModuleId.PAYMENT_SYSTEM]: [UserRole.ADMIN],
  [ModuleId.PARKING_SYSTEM]: [UserRole.SITE_MANAGER, UserRole.SITE_DIRECTOR, UserRole.ADMIN]
};
```

## 優勢

1. **集中管理**: 所有權限定義在 `roles.ts` 的 `ModulePermissions` 中
2. **自動同步**: 選單和路由守衛使用相同的權限定義
3. **響應式**: 使用 `computed` signal，當使用者登入/登出時自動更新選單
4. **安全性**: 雙重保護（選單隱藏 + 路由守衛）

## 注意事項

- 選單隱藏只是 UI 層面的保護，真正的安全性來自路由守衛
- 即使選單隱藏，有心人仍可直接輸入 URL 訪問，因此路由守衛是必須的
- 目前使用 mock 資料，實際上線時需要替換為真實的 API
