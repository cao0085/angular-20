# 🛡️ 路由守衛實作指南

## 📁 已建立的檔案

1. **`core/guards/auth.guard.ts`** - 路由守衛
2. **`core/services/auth.service.ts`** - 認證服務

---

## 🎯 如何在路由中使用守衛

### 方式 1：保護整個 `/main` 路由（推薦）

```typescript
// app.routes.ts
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'main',
        component: MainLayoutComponent,
        canActivate: [authGuard],  // 👈 加入守衛
        children: [
            // 所有子路由都會被保護
            {
                path: 'basic-system/log',
                loadComponent: () => import('./features/basic-system/system-log.component')
                    .then(m => m.SystemLogComponent)
            },
            // ... 其他路由
        ]
    }
];
```

**優點**：
- ✅ 只需要在一個地方加入守衛
- ✅ 所有 `/main` 下的子路由都會被保護
- ✅ 符合你目前的架構

---

### 方式 2：保護特定路由

```typescript
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'main',
        component: MainLayoutComponent,
        canActivate: [authGuard],  // 基本登入檢查
        children: [
            {
                path: 'basic-system/log',
                loadComponent: () => import('./features/basic-system/system-log.component')
                    .then(m => m.SystemLogComponent)
                // 這個路由不需要特殊權限
            },
            {
                path: 'payment-system/payment-method',
                loadComponent: () => import('./features/payment-system/payment-method.component')
                    .then(m => m.PaymentMethodComponent),
                canActivate: [roleGuard],  // 👈 需要特定角色
                data: { roles: ['admin', 'finance'] }  // 👈 指定所需角色
            }
        ]
    }
];
```

**優點**：
- ✅ 細粒度控制
- ✅ 不同路由可以有不同權限要求

---

### 方式 3：使用 canActivateChild（保護所有子路由）

```typescript
export const routes: Routes = [
    {
        path: 'main',
        component: MainLayoutComponent,
        canActivateChild: [authGuard],  // 👈 保護所有子路由
        children: [
            {
                path: 'basic-system/log',
                loadComponent: () => import('./features/basic-system/system-log.component')
                    .then(m => m.SystemLogComponent)
            },
            // 所有子路由都會被檢查
        ]
    }
];
```

---

## 🔧 更新登入頁面

### 修改 `pages/login/login.ts`

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  // ... imports
})
export class Login {
  username = signal('');
  password = signal('');
  errorMessage = signal('');

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isFormValid = computed(() =>
    this.username().length >= 3 && this.password().length >= 6
  );

  onSubmit() {
    if (this.isFormValid()) {
      const success = this.authService.login(
        this.username(),
        this.password()
      );

      if (success) {
        // 取得原本要去的頁面（如果有的話）
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/main';
        this.router.navigateByUrl(returnUrl);
      } else {
        this.errorMessage.set('帳號或密碼錯誤');
      }
    }
  }
}
```

---

## 🎨 更新 Header 顯示使用者資訊

### 修改 `core/layout/header.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-left">
        <h2>停車管理系統</h2>
      </div>
      <div class="header-right">
        <div class="user-info" *ngIf="user$() as user">
          <span class="user-name">{{ user.username }}</span>
          <span class="user-role">{{ user.roles.join(', ') }}</span>
        </div>
        <button class="logout-btn" (click)="logout()">登出</button>
      </div>
    </header>
  `,
  styles: [`
    /* ... 原有的 styles ... */
    
    .logout-btn {
      margin-left: 15px;
      padding: 8px 16px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .logout-btn:hover {
      background: #c0392b;
    }
  `]
})
export class HeaderComponent {
  private authService = inject(AuthService);
  
  user$ = this.authService.user$;

  logout() {
    this.authService.logout();
  }
}
```

---

## 🔄 完整流程

### 1. 未登入訪問 `/main`
```
使用者訪問 /main/basic-system/log
    ↓
authGuard 檢查 isAuthenticated()
    ↓
返回 false（未登入）
    ↓
導向 /login?returnUrl=/main/basic-system/log
    ↓
使用者登入成功
    ↓
導向 /main/basic-system/log（原本要去的頁面）
```

### 2. 已登入訪問 `/main`
```
使用者訪問 /main/basic-system/log
    ↓
authGuard 檢查 isAuthenticated()
    ↓
返回 true（已登入）
    ↓
允許訪問
    ↓
顯示頁面
```

### 3. 權限不足訪問特定頁面
```
使用者訪問 /main/payment-system/payment-method
    ↓
authGuard 檢查 isAuthenticated() ✅
    ↓
roleGuard 檢查 hasAnyRole(['admin', 'finance'])
    ↓
返回 false（沒有權限）
    ↓
導向 /login 或顯示錯誤訊息
```

---

## 📊 守衛類型對照表

| 守衛類型 | 用途 | 使用時機 |
|---------|------|---------|
| **canActivate** | 保護單一路由 | 檢查是否可以訪問該路由 |
| **canActivateChild** | 保護所有子路由 | 檢查是否可以訪問子路由 |
| **canDeactivate** | 離開路由前確認 | 表單未儲存時提示使用者 |
| **canLoad** | 延遲載入前檢查 | 決定是否載入模組 |
| **resolve** | 預先載入資料 | 在進入路由前載入必要資料 |

---

## 🎯 你的架構適合的守衛策略

### 推薦方式：

```typescript
export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'main',
        component: MainLayoutComponent,
        canActivate: [authGuard],  // 👈 在這裡加入守衛
        children: [
            // 所有功能頁面都會被保護
        ]
    }
];
```

**理由**：
- ✅ 簡單明確
- ✅ 符合你的架構（login 公開，main 受保護）
- ✅ 易於維護
- ✅ 如果未來需要細粒度控制，可以在個別子路由加入 roleGuard

---

## 🚀 下一步

1. **不實作**：檔案已建立，但不加入路由（保持目前狀態）
2. **簡單實作**：只在 `/main` 加入 `canActivate: [authGuard]`
3. **完整實作**：更新登入頁 + Header + 路由守衛

你想要哪一種？或是先了解就好？😊
