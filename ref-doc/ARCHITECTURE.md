# Angular 20 停車管理系統 - 架構說明

## 📁 專案結構

```
src/app/
├── core/                           # 核心模組
│   ├── layout/                     # 版面配置元件
│   │   ├── main-layout.component.ts    # 主版面（整合 Sidebar + Header + TabContainer）
│   │   ├── sidebar.component.ts        # 左側可收合目錄
│   │   ├── header.component.ts         # 右上 Header Bar
│   │   └── tab-container.component.ts  # 分頁容器
│   └── services/                   # 核心服務
│       ├── tab.service.ts              # 分頁管理服務
│       └── base-api.service.ts         # API 基礎服務
│
├── features/                       # 功能模組
│   ├── basic-system/               # 基礎系統
│   │   ├── system-log.component.ts
│   │   └── system-directory.component.ts
│   ├── external-system/            # 外部系統
│   │   ├── vendor-data.component.ts
│   │   └── vendor-integration.component.ts
│   ├── payment-system/             # 金流系統
│   │   ├── payment-method.component.ts
│   │   └── payment-integration.component.ts
│   └── parking-system/             # 路邊停車系統
│       ├── order-management.component.ts
│       └── report-analysis/        # 報表分析
│           ├── void-report.component.ts
│           ├── billing-detail.component.ts
│           └── upload-statistics.component.ts
│
├── pages/                          # 頁面
│   └── login/                      # 登入頁
│
├── app.routes.ts                   # 路由配置
└── app.config.ts                   # 應用程式配置
```

## 🎯 核心功能

### 1. **TabService - 分頁管理**
- 開啟新分頁：`openTab(tab: Tab)`
- 關閉分頁：`closeTab(tabId: string)`
- 切換分頁：`setActiveTab(tabId: string)`
- 關閉所有分頁：`closeAllTabs()`
- 關閉其他分頁：`closeOtherTabs(tabId: string)`

### 2. **Sidebar - 可收合目錄**
- 支援三層選單結構
- 點擊選單項目自動開啟對應分頁
- 可透過按鈕收合/展開側邊欄

### 3. **TabContainer - 分頁容器**
- 顯示分頁標籤列
- 支援點擊切換分頁
- 支援關閉分頁（點擊 ✕ 按鈕）

### 4. **Header - 頂部資訊欄**
- 顯示系統標題
- 顯示使用者資訊

## 🚀 使用方式

### 啟動應用程式
1. 登入頁面：輸入帳號密碼（至少 3 個字元 / 6 個字元）
2. 登入成功後自動導向主系統 (`/main`)
3. 點擊左側選單項目開啟對應分頁

### 選單結構
```
基礎系統 ⚙️
  ├─ 系統日誌
  └─ 系統目錄

外部系統 🔗
  ├─ 廠商資料
  └─ 廠商串接

金流系統 💰
  ├─ 收費方式
  └─ 金流串接

路邊停車系統 🅿️
  ├─ 訂單管理
  └─ 報表分析
      ├─ 作廢報表
      ├─ 開單明細
      └─ 上傳統計
```

## 🔧 技術特點

### 1. **Standalone Components**
- 所有元件都是 standalone，不需要 NgModule
- 使用 `loadComponent` 實現 lazy loading

### 2. **依賴注入**
- `providedIn: 'root'`：全域 singleton（TabService, BaseApiService）
- `provideHttpClient()`：在 app.config.ts 中提供 HttpClient

### 3. **路由設計**
- 主路由：`app.routes.ts`
- 使用 lazy loading 優化載入效能
- 支援巢狀路由（children）

### 4. **RxJS 狀態管理**
- 使用 `BehaviorSubject` 管理分頁狀態
- 使用 `Observable` 進行響應式更新

## 📝 擴展指南

### 新增功能頁面
1. 在 `features/` 下建立新的 component
2. 在 `app.routes.ts` 中加入路由
3. 在 `sidebar.component.ts` 的 `menuItems` 中加入選單項目

### 新增 API 服務
1. 繼承 `BaseApiService`
2. 使用 `protected` 方法：`get()`, `post()`, `put()`, `delete()`, `patch()`
3. 指定 domain：`DOMAIN_1` 或 `DOMAIN_2`

範例：
```typescript
@Injectable({ providedIn: 'root' })
export class UserService extends BaseApiService {
  getUsers() {
    return this.get<User[]>('DOMAIN_1', '/api/users');
  }
}
```

## 🎨 UI 設計
- **側邊欄**：深色主題（#2c3e50）
- **Header**：淺色主題（白色）
- **分頁標籤**：Material Design 風格
- **內容區**：白色背景，20px padding

## ⚡ 效能優化
- Lazy Loading：所有功能頁面都是延遲載入
- Tree-shakable Services：未使用的服務會被自動移除
- OnPush Change Detection：可在未來加入以提升效能
