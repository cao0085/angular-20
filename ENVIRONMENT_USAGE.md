# 環境配置使用說明

## 📁 文件結構

```
src/
├── environments/
│   ├── environment.ts                  # 預設環境（開發）
│   ├── environment.development.ts      # 開發環境
│   └── environment.production.ts       # 生產環境
└── app/
    └── core/
        └── services/
            └── base-api.service.ts     # API Services（自動讀取環境配置）
```

## 🚀 使用方式

### 1. 開發環境（Development）

```bash
# 啟動開發服務器（預設使用 development 配置）
ng serve

# 或明確指定
ng serve --configuration development

# API URLs 會使用：
# domain1: http://localhost:3000
# domain2: http://localhost:4000
# domain3: http://localhost:5000
# domain4: http://localhost:6000
```

### 2. 生產環境（Production）

```bash
# 構建生產版本
ng build --configuration production

# 或簡寫
ng build --prod

# API URLs 會使用：
# domain1: https://api-1.production.com
# domain2: https://api-2.production.com
# domain3: https://api-3.production.com
# domain4: https://api-4.production.com
```

## 📝 在代碼中使用

### 方式 1：使用 Domain Services（推薦）

```typescript
import { Component, signal, inject } from '@angular/core';
import { Domain1ApiService, Domain2ApiService } from './core/services/base-api.service';

@Component({
  selector: 'app-users',
  template: `
    <div *ngIf="usersResource.isLoading()">載入中...</div>
    <ul>
      <li *ngFor="let user of usersResource.value()">{{ user.name }}</li>
    </ul>
  `
})
export class UsersComponent {
  private domain1Api = inject(Domain1ApiService);

  // 自動使用環境配置的 URL
  // 開發環境：http://localhost:3000/users
  // 生產環境：https://api-1.production.com/users
  usersResource = this.domain1Api.createGetResource<User[]>(
    signal('/users')
  );
}
```

### 方式 2：直接讀取環境變數

```typescript
import { environment } from '../environments/environment';

console.log('當前環境:', environment.production ? '生產' : '開發');
console.log('Domain 1 URL:', environment.apiUrls.domain1);
```

## 🔧 新增環境配置

如果需要新增測試環境（staging）：

### 1. 創建環境文件

```typescript
// src/environments/environment.staging.ts
export const environment = {
    production: false,
    apiUrls: {
        domain1: 'https://api-1.staging.com',
        domain2: 'https://api-2.staging.com',
        domain3: 'https://api-3.staging.com',
        domain4: 'https://api-4.staging.com'
    }
};
```

### 2. 更新 angular.json

在 `configurations` 中新增：

```json
"staging": {
  "optimization": true,
  "outputHashing": "all",
  "sourceMap": false,
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.staging.ts"
    }
  ]
}
```

### 3. 使用

```bash
ng serve --configuration staging
ng build --configuration staging
```

## ✅ 優點

1. **集中管理**：所有環境配置在一個地方
2. **類型安全**：TypeScript 完整支持
3. **自動切換**：根據構建配置自動替換
4. **易於擴展**：輕鬆新增更多環境
5. **零侵入**：Domain Services 自動讀取，無需修改業務代碼

## 📌 注意事項

1. **不要提交敏感信息**：API keys、密碼等應使用環境變數或 secrets
2. **檢查 .gitignore**：確保 `environment.*.ts` 文件被正確管理
3. **構建時確認**：檢查構建日誌確認使用了正確的環境配置