# 🎓 Angular 20 學習指南

## 📖 理解順序（由淺入深）

### 🎯 階段一：應用程式啟動流程（5-10 分鐘）

#### 1. **main.ts** - 應用程式入口
```typescript
bootstrapApplication(App, appConfig)
```
**重點**：
- Angular 應用程式的起點
- 使用 `bootstrapApplication` 啟動 standalone 應用程式
- 傳入根元件 `App` 和配置 `appConfig`

---

#### 2. **app.config.ts** - 全域配置
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),      // 路由系統
    provideHttpClient(),         // HTTP 客戶端（singleton）
    provideZoneChangeDetection() // 變更檢測
  ]
};
```
**重點**：
- `providers` 陣列定義全域可用的服務
- `provideHttpClient()` 讓整個應用程式共用一個 HttpClient 實例
- 這些服務會被注入到 root injector

---

#### 3. **app.routes.ts** - 路由配置 ⭐ **重要**

```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // 根路徑導向登入
  { path: 'login', component: Login },                     // 登入頁
  { 
    path: 'main',                                          // 主系統
    component: MainLayoutComponent,                        // 使用 MainLayout 版面
    children: [                                            // 子路由
      { path: 'basic-system/log', loadComponent: ... },   // 延遲載入
      // ... 其他子路由
    ]
  },
  { path: '**', redirectTo: '/login' }                    // 404 導向登入
];
```

**路由層級結構**：
```
/                           → 導向 /login
/login                      → Login 元件
/main                       → MainLayoutComponent（版面容器）
  ├─ /main/basic-system/log           → SystemLogComponent
  ├─ /main/basic-system/directory     → SystemDirectoryComponent
  ├─ /main/external-system/...
  └─ /main/parking-system/...
```

**關鍵概念**：
- `loadComponent` - 延遲載入（lazy loading），只在需要時才載入元件
- `children` - 子路由會在父元件的 `<router-outlet>` 中顯示
- `MainLayoutComponent` 包含 `<router-outlet>`（在 TabContainer 中）

---

### 🏗️ 階段二：版面配置架構（10-15 分鐘）

#### 4. **MainLayoutComponent** - 主版面容器

**檔案位置**：`core/layout/main-layout.component.ts`

```
┌─────────────────────────────────────────┐
│         MainLayoutComponent             │
├──────────┬──────────────────────────────┤
│          │  HeaderComponent             │
│ Sidebar  ├──────────────────────────────┤
│          │  TabContainerComponent       │
│          │  ├─ Tab Bar                  │
│          │  └─ <router-outlet>          │
└──────────┴──────────────────────────────┘
```

**結構**：
```html
<div class="main-layout">
  <app-sidebar></app-sidebar>           <!-- 左側選單 -->
  <div class="main-content">
    <app-header></app-header>           <!-- 右上 Header -->
    <app-tab-container></app-tab-container>  <!-- 分頁容器 -->
  </div>
</div>
```

**理解重點**：
- MainLayout 是一個**容器元件**
- 它組合了 3 個子元件：Sidebar、Header、TabContainer
- 使用 Flexbox 佈局（左右分割）

---

#### 5. **SidebarComponent** - 側邊選單

**檔案位置**：`core/layout/sidebar.component.ts`

**核心功能**：
```typescript
menuItems: MenuItem[] = [
  {
    id: 'basic-system',
    label: '基礎系統',
    route: '/main/basic-system',
    icon: '⚙️',
    expanded: false,
    children: [
      { id: 'system-log', label: '系統日誌', route: '/main/basic-system/log' }
    ]
  }
];

openTab(item: MenuItem) {
  this.tabService.openTab({
    id: item.id,
    title: item.label,
    route: item.route,
    closable: true
  });
}
```

**理解重點**：
- `menuItems` - 定義選單結構（可以有多層 children）
- `openTab()` - 點擊選單項目時，呼叫 `TabService.openTab()`
- `TabService` 負責管理分頁狀態和路由導航

---

#### 6. **TabContainerComponent** - 分頁容器

**檔案位置**：`core/layout/tab-container.component.ts`

**結構**：
```html
<div class="tab-container">
  <!-- 分頁標籤列 -->
  <div class="tab-bar">
    <div *ngFor="let tab of tabs$ | async" 
         [class.active]="tab.id === (activeTabId$ | async)"
         (click)="switchTab(tab)">
      {{ tab.title }}
      <button (click)="closeTab($event, tab.id)">✕</button>
    </div>
  </div>

  <!-- 分頁內容區 -->
  <div class="tab-content">
    <router-outlet></router-outlet>  <!-- 這裡顯示子路由的元件 -->
  </div>
</div>
```

**理解重點**：
- `tabs$` - Observable，訂閱 TabService 的分頁列表
- `<router-outlet>` - 子路由的元件會在這裡顯示
- `switchTab()` - 切換分頁時，呼叫 `TabService.setActiveTab()`

---

### 🔧 階段三：核心服務（15-20 分鐘）

#### 7. **TabService** - 分頁管理服務 ⭐ **核心**

**檔案位置**：`core/services/tab.service.ts`

**狀態管理**：
```typescript
private tabs = new BehaviorSubject<Tab[]>([]);           // 分頁列表
private activeTabId = new BehaviorSubject<string>('');   // 當前分頁 ID

tabs$ = this.tabs.asObservable();                        // 公開的 Observable
activeTabId$ = this.activeTabId.asObservable();
```

**核心方法**：
```typescript
// 1. 開啟分頁
openTab(tab: Tab) {
  const existingTab = this.tabs.value.find(t => t.id === tab.id);
  if (existingTab) {
    this.setActiveTab(tab.id);  // 已存在，切換過去
  } else {
    this.tabs.next([...this.tabs.value, tab]);  // 新增分頁
    this.setActiveTab(tab.id);
  }
  this.router.navigate([tab.route]);  // 導航到對應路由
}

// 2. 關閉分頁
closeTab(tabId: string) {
  const newTabs = this.tabs.value.filter(t => t.id !== tabId);
  this.tabs.next(newTabs);
  // 如果關閉的是當前分頁，切換到前一個
}

// 3. 設定當前分頁
setActiveTab(tabId: string) {
  this.activeTabId.next(tabId);
}
```

**理解重點**：
- 使用 `BehaviorSubject` 管理狀態（可以訂閱，也可以取得當前值）
- `tabs.value` - 取得當前分頁列表
- `tabs.next([...])` - 更新分頁列表，所有訂閱者會收到通知
- 整合 `Router` 進行路由導航

---

#### 8. **BaseApiService** - API 基礎服務

**檔案位置**：`core/services/base-api.service.ts`

**設計模式**：
```typescript
@Injectable({ providedIn: 'root' })  // Singleton
export class BaseApiService {
  protected readonly domains = {
    DOMAIN_1: 'https://api-1.example.com',
    DOMAIN_2: 'https://api-2.example.com'
  };

  constructor(protected http: HttpClient) { }  // 注入 HttpClient

  protected get<T>(domain: DomainKey, url: string, params?: HttpParams) {
    const apiUrl = this.domains[domain];
    return this.http.get<T>(`${apiUrl}${url}`, { params });
  }
}
```

**使用方式**：
```typescript
// 繼承 BaseApiService
@Injectable({ providedIn: 'root' })
export class UserService extends BaseApiService {
  getUsers() {
    return this.get<User[]>('DOMAIN_1', '/api/users');
  }
}
```

**理解重點**：
- `providedIn: 'root'` - 全域 singleton
- `protected` 方法 - 只能在子類別中使用
- 統一管理多個 API domain

---

### 🎨 階段四：功能頁面（5 分鐘）

#### 9. **功能頁面元件**

**範例**：`features/basic-system/system-log.component.ts`

```typescript
@Component({
  selector: 'app-system-log',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>歡迎來到 基礎系統 - 系統日誌</h1>
    </div>
  `
})
export class SystemLogComponent { }
```

**理解重點**：
- `standalone: true` - 不需要 NgModule
- 使用 `loadComponent` 延遲載入（在 app.routes.ts 中）
- 簡單的展示元件，未來可以加入業務邏輯

---

## 🔄 完整流程圖

```
使用者訪問 http://localhost:4040/
    ↓
main.ts 啟動應用程式
    ↓
app.config.ts 提供全域服務（Router, HttpClient）
    ↓
app.routes.ts 解析路由
    ↓
導向 /login（Login 元件）
    ↓
使用者登入成功
    ↓
導向 /main（MainLayoutComponent）
    ├─ Sidebar（顯示選單）
    ├─ Header（顯示使用者資訊）
    └─ TabContainer（分頁容器）
        └─ <router-outlet>（等待子路由）
    ↓
使用者點擊「系統日誌」
    ↓
Sidebar.openTab() → TabService.openTab()
    ↓
TabService 更新狀態 + 導航到 /main/basic-system/log
    ↓
Router 載入 SystemLogComponent
    ↓
SystemLogComponent 顯示在 <router-outlet> 中
    ↓
TabContainer 顯示分頁標籤
```

---

## 🎯 學習建議

### 1️⃣ **先看流程，再看細節**
- 從 `main.ts` → `app.config.ts` → `app.routes.ts` 理解啟動流程
- 再深入 `MainLayoutComponent` 理解版面結構

### 2️⃣ **重點理解 TabService**
- 這是整個分頁系統的核心
- 理解 `BehaviorSubject` 和 `Observable` 的使用
- 理解如何整合 Router 進行導航

### 3️⃣ **實際操作**
- 開啟瀏覽器，點擊選單項目
- 打開 DevTools Console，觀察 `console.log` 輸出
- 在 TabService 的方法中加入 `console.log` 觀察執行流程

### 4️⃣ **嘗試修改**
- 新增一個選單項目
- 新增一個功能頁面
- 修改分頁標籤的樣式

---

## 📝 關鍵概念總結

| 概念 | 說明 | 檔案位置 |
|------|------|---------|
| **Standalone Component** | 不需要 NgModule 的元件 | 所有 .component.ts |
| **Lazy Loading** | 延遲載入，提升效能 | app.routes.ts |
| **Dependency Injection** | 依賴注入，管理服務生命週期 | app.config.ts, services/ |
| **RxJS Observable** | 響應式程式設計，管理非同步資料流 | tab.service.ts |
| **Router** | 路由系統，管理頁面導航 | app.routes.ts |
| **BehaviorSubject** | 可訂閱的狀態容器 | tab.service.ts |

---

## 🚀 下一步

1. **閱讀順序**：按照本文的階段順序閱讀程式碼
2. **動手實作**：嘗試新增一個功能頁面
3. **Debug 練習**：在關鍵方法中加入 `console.log`
4. **提問**：有不理解的地方隨時問我！

祝學習順利！🎉
