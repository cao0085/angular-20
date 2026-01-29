# ERP System By Angular 20

Built with **Angular 20** Standalone Components architecture, featuring comprehensive permission management, dynamic tab system, and modular design.

## Project Background

This project serves as a practice ground for validating core Angular 20 concepts before introducing them into production:
- **Signals** - Next-generation reactive state management
- **Standalone Components** - Module-free component architecture
- **Dependency Injection** - Service-based architecture with `inject()` function
- **RBAC** - Role-Based Access Control system
- **Tab Service** - Dynamic tab management service
- **RouteReuse Strategy** - Route reuse strategy for preserving component state

These concepts have been successfully adopted in production applications.

**Note:** This project focuses on architectural patterns and business logic implementation. The UI uses basic PrimeNG components without extensive styling customization.

## Project Architecture

```
src/app/
├── core/                           
│   ├── layout/                     
│   │   ├── main-layout.component.ts    # 主版面 (整合 Sidebar + Header + TabContainer)
│   │   ├── sidebar.component.ts
│   │   ├── header.component.ts
│   │   └── tab-container.component.ts  # main container
│   ├── services/                  # DI Service
│   │   ├── tab.service.ts
│   │   ├── api.service.ts
│   │   └── auth.service.ts        # Role
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/               # HTTP
│   ├── models/                     # data model
│   ├── store/                      # singleton
│   └── strategies/                 # no state function
│
├── features/                       # render in tab-container    
│   ├── basic-system/
│   │   ├── system-log.component.ts
│   │   ├── system-directory.component.ts
│   │   ├── menu-management.component.ts
│   │   └── account-management.component.ts
│   ├── other-system/
│       ├── payment-method.component.ts
│       └── payment-integration.component.ts
│
├── pages/                          # single pages
│   └── login/
│
├── mockDB/                         # Mock Data
│   ├── users.ts
│   └── menu.ts
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
├── app.routes.ts
├── app.config.ts
└── app.ts
```


<!-- ### 本地開發 (不使用 Docker)

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm start
# 或
ng serve

# 開啟瀏覽器訪問
http://localhost:4200
```

### Docker 開發環境

```bash
# 啟動 Docker 容器
docker-compose up -d --build

# 進入容器
docker-compose exec node-app bash

# 安裝 Angular CLI
npm install -g @angular/cli@20

# 啟動開發伺服器 (注意要綁定 0.0.0.0)
ng serve --port 4040 --host 0.0.0.0
```

### 預設登入帳號

系統提供四種角色的測試帳號:

| 角色 | 帳號 | 密碼 | 權限範圍 |
|------|------|------|----------|
| 系統人員 | `admin` | `password` | 所有模組 |
| 場地經理 | `director` | `password` | 外部系統、停車系統 |
| 場地管理員 | `manager` | `password` | 基礎系統、停車系統 |
| 訪客 | `viewer` | `password` | 停車系統 |

## 💻 開發指南

### 新增功能頁面

1. **建立元件**
```bash
ng generate component features/your-module/your-feature
```

2. **加入路由** (`app.routes.ts`)
```typescript
{
  path: 'your-module/your-feature',
  loadComponent: () => import('./features/your-module/your-feature.component')
    .then(m => m.YourFeatureComponent),
  canActivate: [authGuard, roleGuard],
  data: { roles: ModulePermissions[ModuleId.YOUR_MODULE] }
}
```

3. **加入選單** (`sidebar.component.ts`)
```typescript
{
  id: 'your-feature',
  label: '你的功能',
  route: '/main/your-module/your-feature',
  icon: '🎯'
}
```

### 新增 API 服務

繼承 `BaseApiService` 來建立新的 API 服務:

```typescript
import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/services/base-api.service';

@Injectable({ providedIn: 'root' })
export class YourService extends BaseApiService {
  getYourData() {
    return this.get<YourDataType>('DOMAIN_1', '/api/your-endpoint');
  }

  createYourData(data: YourDataType) {
    return this.post<YourDataType>('DOMAIN_1', '/api/your-endpoint', data);
  }
}
```

### 常用指令

```bash
# 生成元件
ng generate component <component-name>

# 生成服務
ng generate service <service-name>

# 生成守衛
ng generate guard <guard-name>

# 建置專案
ng build

# 執行測試
ng test

# 查看更多指令
ng generate --help
```

## 🔐 權限管理

### 權限配置 (`core/models/roles.ts`)

```typescript
// 定義模組 ID
export enum ModuleId {
  BASIC_SYSTEM = 'BASIC_SYSTEM',
  EXTERNAL_SYSTEM = 'EXTERNAL_SYSTEM',
  PAYMENT_SYSTEM = 'PAYMENT_SYSTEM',
  PARKING_SYSTEM = 'PARKING_SYSTEM'
}

// 集中管理權限 (單一真相來源)
export const ModulePermissions: Record<ModuleId, readonly UserRole[]> = {
  [ModuleId.BASIC_SYSTEM]: [UserRole.SITE_MANAGER, UserRole.ADMIN],
  [ModuleId.EXTERNAL_SYSTEM]: [UserRole.SITE_DIRECTOR, UserRole.ADMIN],
  [ModuleId.PAYMENT_SYSTEM]: [UserRole.ADMIN],
  [ModuleId.PARKING_SYSTEM]: [UserRole.SITE_MANAGER, UserRole.SITE_DIRECTOR, UserRole.ADMIN]
};
```

### 權限檢查流程

```
使用者訪問頁面
    ↓
authGuard 檢查是否已登入
    ↓
roleGuard 檢查是否有權限
    ↓
允許訪問 / 導向登入頁
```

### 修改權限

只需在 `roles.ts` 中修改 `ModulePermissions`,所有引用的地方會自動更新:

```typescript
// 將基礎系統開放給場地經理
[ModuleId.BASIC_SYSTEM]: [UserRole.SITE_MANAGER, UserRole.SITE_DIRECTOR, UserRole.ADMIN]
``` -->


## Reference Links

- [Angular Signals 官方文件](http://v20.angular.dev/guide/signals)
- [Angular State Management 2025](https://nx.dev/blog/angular-state-management-2025)
- [Service with a Signal in Angular](https://modernangular.com/articles/service-with-a-signal-in-angular)
- [Angular CLI 文件](https://github.com/angular/angular-cli)
