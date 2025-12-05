# 🛡️ 角色權限路由守衛 - 完整實作

## 🎯 角色權限設計

```
訪客（未登入）     → 只能訪問 /login
場地管理員         → 基礎系統
場地經理           → 外部系統  
系統人員（admin）  → 無限制（所有功能）
```

---

## 📝 完整路由配置

### app.routes.ts

```typescript
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayoutComponent } from './core/layout/main-layout.component';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { UserRole } from './core/models/roles';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
        // 登入頁不需要守衛
    },
    {
        path: 'main',
        component: MainLayoutComponent,
        canActivate: [authGuard],  // 👈 所有 /main 路由都需要登入
        children: [
            // ========================================
            // 基礎系統 - 只有場地管理員和系統人員可以訪問
            // ========================================
            {
                path: 'basic-system/log',
                loadComponent: () => import('./features/basic-system/system-log.component')
                    .then(m => m.SystemLogComponent),
                canActivate: [roleGuard],
                data: { roles: [UserRole.SITE_MANAGER, UserRole.ADMIN] }
            },
            {
                path: 'basic-system/directory',
                loadComponent: () => import('./features/basic-system/system-directory.component')
                    .then(m => m.SystemDirectoryComponent),
                canActivate: [roleGuard],
                data: { roles: [UserRole.SITE_MANAGER, UserRole.ADMIN] }
            },

            // ========================================
            // 外部系統 - 只有場地經理和系統人員可以訪問
            // ========================================
            {
                path: 'external-system/vendor-data',
                loadComponent: () => import('./features/external-system/vendor-data.component')
                    .then(m => m.VendorDataComponent),
                canActivate: [roleGuard],
                data: { roles: [UserRole.SITE_DIRECTOR, UserRole.ADMIN] }
            },
            {
                path: 'external-system/vendor-integration',
                loadComponent: () => import('./features/external-system/vendor-integration.component')
                    .then(m => m.VendorIntegrationComponent),
                canActivate: [roleGuard],
                data: { roles: [UserRole.SITE_DIRECTOR, UserRole.ADMIN] }
            },

            // ========================================
            // 金流系統 - 只有系統人員可以訪問
            // ========================================
            {
                path: 'payment-system/payment-method',
                loadComponent: () => import('./features/payment-system/payment-method.component')
                    .then(m => m.PaymentMethodComponent),
                canActivate: [roleGuard],
                data: { roles: [UserRole.ADMIN] }
            },
            {
                path: 'payment-system/payment-integration',
                loadComponent: () => import('./features/payment-system/payment-integration.component')
                    .then(m => m.PaymentIntegrationComponent),
                canActivate: [roleGuard],
                data: { roles: [UserRole.ADMIN] }
            },

            // ========================================
            // 路邊停車系統 - 所有登入使用者都可以訪問
            // ========================================
            {
                path: 'parking-system/order-management',
                loadComponent: () => import('./features/parking-system/order-management.component')
                    .then(m => m.OrderManagementComponent)
                // 不需要 roleGuard，只要登入就可以訪問
            },
            {
                path: 'parking-system/report-analysis/void-report',
                loadComponent: () => import('./features/parking-system/report-analysis/void-report.component')
                    .then(m => m.VoidReportComponent)
            },
            {
                path: 'parking-system/report-analysis/billing-detail',
                loadComponent: () => import('./features/parking-system/report-analysis/billing-detail.component')
                    .then(m => m.BillingDetailComponent)
            },
            {
                path: 'parking-system/report-analysis/upload-statistics',
                loadComponent: () => import('./features/parking-system/report-analysis/upload-statistics.component')
                    .then(m => m.UploadStatisticsComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];
```

---

## 🔄 執行流程

### 場景 1：場地管理員訪問基礎系統 ✅

```
場地管理員登入（role: SITE_MANAGER）
    ↓
訪問 /main/basic-system/log
    ↓
authGuard 檢查 isAuthenticated() → ✅ 通過
    ↓
roleGuard 檢查 hasAnyRole([SITE_MANAGER, ADMIN]) → ✅ 通過
    ↓
顯示系統日誌頁面
```

### 場景 2：場地管理員訪問外部系統 ❌

```
場地管理員登入（role: SITE_MANAGER）
    ↓
訪問 /main/external-system/vendor-data
    ↓
authGuard 檢查 isAuthenticated() → ✅ 通過
    ↓
roleGuard 檢查 hasAnyRole([SITE_DIRECTOR, ADMIN]) → ❌ 失敗
    ↓
導向 /login（顯示權限不足訊息）
```

### 場景 3：系統人員訪問任何頁面 ✅

```
系統人員登入（role: ADMIN）
    ↓
訪問任何 /main/* 路由
    ↓
authGuard 檢查 isAuthenticated() → ✅ 通過
    ↓
roleGuard 檢查 isAdmin() → ✅ 直接通過（不檢查 roles）
    ↓
顯示頁面
```

### 場景 4：訪客訪問任何頁面 ❌

```
未登入訪客
    ↓
訪問 /main/basic-system/log
    ↓
authGuard 檢查 isAuthenticated() → ❌ 失敗
    ↓
導向 /login?returnUrl=/main/basic-system/log
```

---

## 📊 權限對照表

| 功能模組 | 場地管理員 | 場地經理 | 系統人員 |
|---------|-----------|---------|---------|
| **基礎系統** | ✅ | ❌ | ✅ |
| **外部系統** | ❌ | ✅ | ✅ |
| **金流系統** | ❌ | ❌ | ✅ |
| **路邊停車系統** | ✅ | ✅ | ✅ |

---

## 🎨 Sidebar 動態顯示選單

### 更新 sidebar.component.ts

```typescript
export class SidebarComponent {
  private authService = inject(AuthService);
  
  // 根據使用者角色過濾選單
  get visibleMenuItems(): MenuItem[] {
    const user = this.authService.getCurrentUser();
    if (!user) return [];

    return this.menuItems.filter(item => {
      // 系統人員可以看到所有選單
      if (user.role === UserRole.ADMIN) {
        return true;
      }

      // 根據 item.id 判斷權限
      switch (item.id) {
        case 'basic-system':
          return user.role === UserRole.SITE_MANAGER;
        case 'external-system':
          return user.role === UserRole.SITE_DIRECTOR;
        case 'payment-system':
          return false;  // 只有 admin 可見（已在上面處理）
        case 'parking-system':
          return true;  // 所有人都可見
        default:
          return false;
      }
    });
  }
}
```

```html
<!-- 使用 visibleMenuItems 而非 menuItems -->
<ul class="menu-list">
  <li *ngFor="let item of visibleMenuItems" class="menu-item">
    <!-- ... -->
  </li>
</ul>
```

---

## 🧪 測試不同角色

### 在登入頁測試

```typescript
// pages/login/login.ts
export class Login {
  // 加入角色選擇
  selectedRole = signal<UserRole>(UserRole.ADMIN);

  onSubmit() {
    if (this.isFormValid()) {
      const success = this.authService.login(
        this.username(),
        this.password(),
        this.selectedRole()  // 👈 傳入選擇的角色
      );
      // ...
    }
  }
}
```

```html
<!-- 加入角色選擇下拉選單 -->
<mat-form-field>
  <mat-label>角色</mat-label>
  <mat-select [(ngModel)]="selectedRole">
    <mat-option [value]="UserRole.ADMIN">系統人員</mat-option>
    <mat-option [value]="UserRole.SITE_MANAGER">場地管理員</mat-option>
    <mat-option [value]="UserRole.SITE_DIRECTOR">場地經理</mat-option>
  </mat-select>
</mat-form-field>
```

---

## 💡 總結

### 你的路由守衛架構：

```
1. authGuard（登入檢查）
   ↓
   在 /main 層級檢查
   ↓
2. roleGuard（角色權限檢查）
   ↓
   在個別子路由檢查
   ↓
3. 系統人員（admin）自動通過所有檢查
```

### 優點：

- ✅ **清晰的權限層級**：登入 → 角色檢查
- ✅ **admin 優先權**：系統人員不受角色限制
- ✅ **易於維護**：權限定義集中在 `roles.ts`
- ✅ **可擴展**：新增角色只需修改一個地方

這就是你的完整路由守衛架構！🎉
