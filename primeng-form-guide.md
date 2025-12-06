# PrimeNG 表單使用指南

## 📦 安裝

```bash
npm install primeng primeicons
```

## 🎨 配置主題

### 方法 1: 在 `angular.json` 中配置

```json
{
  "projects": {
    "your-project": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/primeng/resources/themes/lara-light-blue/theme.css",
              "node_modules/primeng/resources/primeng.css",
              "node_modules/primeicons/primeicons.css",
              "src/styles.scss"
            ]
          }
        }
      }
    }
  }
}
```

### 方法 2: 在 `styles.scss` 中引入

```scss
@import "primeng/resources/themes/lara-light-blue/theme.css";
@import "primeng/resources/primeng.css";
@import "primeicons/primeicons.css";
```

### 可用主題列表

- `lara-light-blue` (推薦)
- `lara-light-indigo`
- `lara-dark-blue`
- `material-light`
- `bootstrap4-light-blue`
- 更多主題: https://primeng.org/theming

---

## 📝 基本表單結構

### TypeScript Component

```typescript
import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-permission-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './permission-list.html',
  styleUrl: './permission-list.scss',
})
export class PermissionList {
  // 下拉選項
  protected readonly categoryOptions = [
    { label: '管理員', value: 'admin' },
    { label: '使用者', value: 'user' },
    { label: '訪客', value: 'guest' },
  ];

  // 表單定義
  protected readonly searchForm = new FormGroup({
    siteCode: new FormControl<string>('', [Validators.required]),
    userCode: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^\d+$/), // 只能輸入數字
    ]),
    invoice: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^[A-Z0-9]+$/), // 英文大寫 + 數字
    ]),
    startDate: new FormControl<Date | null>(null, [Validators.required]),
    endDate: new FormControl<Date | null>(null, [Validators.required]),
    categories: new FormControl<string[]>([], [Validators.required]),
  });

  constructor() {
    this.searchForm.controls.siteCode.setValue('2255');
    this.setDefaultDateRange();
  }

  // 設定預設日期區間（當月第一天到最後一天）
  private setDefaultDateRange() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    this.searchForm.controls.startDate.setValue(firstDay);
    this.searchForm.controls.endDate.setValue(lastDay);
  }

  protected onSubmit() {
    if (this.searchForm.valid) {
      console.log('表單資料:', this.searchForm.value);
      // 處理送出邏輯
    } else {
      console.log('表單驗證失敗');
      // 標記所有欄位為 touched，顯示錯誤訊息
      Object.keys(this.searchForm.controls).forEach((key) => {
        this.searchForm.get(key)?.markAsTouched();
      });
    }
  }

  protected onReset() {
    this.searchForm.reset();
    this.setDefaultDateRange();
  }
}
```

### HTML Template

```html
<div class="page-container">
  <p-card header="權限管理">
    <form [formGroup]="searchForm" (ngSubmit)="onSubmit()">

      <!-- 第一行：站點代碼、使用者代碼 -->
      <div class="form-row">
        <!-- 站點代碼 -->
        <div class="field">
          <label for="siteCode">站點代碼 <span class="required">*</span></label>
          <input
            id="siteCode"
            pInputText
            formControlName="siteCode"
            placeholder="請輸入站點代碼"
            class="w-full"
          />
          @if (searchForm.controls.siteCode.hasError('required') && searchForm.controls.siteCode.touched) {
            <small class="p-error">站點代碼為必填</small>
          }
        </div>

        <!-- 使用者代碼 (限制數字) -->
        <div class="field">
          <label for="userCode">使用者代碼 <span class="required">*</span></label>
          <input
            id="userCode"
            pInputText
            formControlName="userCode"
            placeholder="請輸入數字"
            class="w-full"
          />
          @if (searchForm.controls.userCode.hasError('required') && searchForm.controls.userCode.touched) {
            <small class="p-error">使用者代碼為必填</small>
          }
          @if (searchForm.controls.userCode.hasError('pattern')) {
            <small class="p-error">請輸入數字</small>
          }
        </div>
      </div>

      <!-- 第二行：發票號碼、分類 -->
      <div class="form-row">
        <!-- 發票號碼 (限制英文數字) -->
        <div class="field">
          <label for="invoice">發票號碼 <span class="required">*</span></label>
          <input
            id="invoice"
            pInputText
            formControlName="invoice"
            placeholder="請輸入英文大寫和數字"
            class="w-full"
          />
          @if (searchForm.controls.invoice.hasError('required') && searchForm.controls.invoice.touched) {
            <small class="p-error">發票號碼為必填</small>
          }
          @if (searchForm.controls.invoice.hasError('pattern')) {
            <small class="p-error">只能輸入英文大寫和數字</small>
          }
        </div>

        <!-- 下拉多選 -->
        <div class="field">
          <label for="categories">分類 <span class="required">*</span></label>
          <p-multiSelect
            inputId="categories"
            formControlName="categories"
            [options]="categoryOptions"
            placeholder="選擇分類"
            [filter]="true"
            optionLabel="label"
            optionValue="value"
            styleClass="w-full"
          ></p-multiSelect>
          @if (searchForm.controls.categories.hasError('required') && searchForm.controls.categories.touched) {
            <small class="p-error">請至少選擇一個分類</small>
          }
        </div>
      </div>

      <!-- 第三行：日期區間 -->
      <div class="form-row">
        <!-- 開始日期 -->
        <div class="field">
          <label for="startDate">開始日期 <span class="required">*</span></label>
          <p-calendar
            inputId="startDate"
            formControlName="startDate"
            [showIcon]="true"
            dateFormat="yy-mm-dd"
            placeholder="選擇開始日期"
            styleClass="w-full"
          ></p-calendar>
          @if (searchForm.controls.startDate.hasError('required') && searchForm.controls.startDate.touched) {
            <small class="p-error">開始日期為必填</small>
          }
        </div>

        <!-- 結束日期 -->
        <div class="field">
          <label for="endDate">結束日期 <span class="required">*</span></label>
          <p-calendar
            inputId="endDate"
            formControlName="endDate"
            [showIcon]="true"
            dateFormat="yy-mm-dd"
            placeholder="選擇結束日期"
            styleClass="w-full"
          ></p-calendar>
          @if (searchForm.controls.endDate.hasError('required') && searchForm.controls.endDate.touched) {
            <small class="p-error">結束日期為必填</small>
          }
        </div>
      </div>

      <!-- 按鈕 -->
      <div class="form-actions">
        <p-button
          label="重置"
          severity="secondary"
          (onClick)="onReset()"
          [outlined]="true"
        ></p-button>
        <p-button
          type="submit"
          label="查詢"
          severity="primary"
          [disabled]="!searchForm.valid"
        ></p-button>
      </div>

    </form>
  </p-card>
</div>
```

### SCSS Styles

```scss
.page-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .form-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-weight: 500;
      color: #333;

      .required {
        color: #e74c3c;
      }
    }

    .p-error {
      display: block;
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 4px;
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
  }
}

// PrimeNG 全域樣式微調
::ng-deep {
  .w-full {
    width: 100% !important;
  }
}
```

---

## 🎯 常用元件範例

### 1. 文字輸入框 (InputText)

```html
<input
  pInputText
  formControlName="fieldName"
  placeholder="提示文字"
/>
```

#### 限制輸入格式

```typescript
// 只能輸入數字
new FormControl('', [Validators.pattern(/^\d+$/)])

// 只能輸入英文大寫和數字
new FormControl('', [Validators.pattern(/^[A-Z0-9]+$/)])

// 只能輸入英文、數字、底線
new FormControl('', [Validators.pattern(/^[a-zA-Z0-9_]+$/)])

// Email 格式
new FormControl('', [Validators.email])

// 電話號碼 (10碼)
new FormControl('', [Validators.pattern(/^09\d{8}$/)])
```

---

### 2. 日期選擇器 (Calendar)

#### 單一日期

```html
<p-calendar
  formControlName="date"
  [showIcon]="true"
  dateFormat="yy-mm-dd"
  placeholder="選擇日期"
></p-calendar>
```

```typescript
dateField: new FormControl<Date | null>(null, [Validators.required])
```

#### 日期區間 (Range)

```html
<p-calendar
  formControlName="dateRange"
  selectionMode="range"
  [showIcon]="true"
  dateFormat="yy-mm-dd"
  placeholder="選擇日期區間"
></p-calendar>
```

```typescript
dateRange: new FormControl<Date[] | null>(null, [Validators.required])

// 設定預設值
this.form.controls.dateRange.setValue([new Date('2025-01-01'), new Date('2025-01-31')]);
```

#### 限制日期範圍

```html
<p-calendar
  formControlName="date"
  [minDate]="minDate"
  [maxDate]="maxDate"
  [showIcon]="true"
></p-calendar>
```

```typescript
minDate = new Date('2025-01-01');
maxDate = new Date();
```

---

### 3. 下拉選單 (Dropdown)

```html
<p-dropdown
  formControlName="category"
  [options]="categoryOptions"
  placeholder="請選擇"
  optionLabel="label"
  optionValue="value"
></p-dropdown>
```

```typescript
categoryOptions = [
  { label: '選項一', value: '1' },
  { label: '選項二', value: '2' },
  { label: '選項三', value: '3' },
];

category: new FormControl<string>('', [Validators.required])
```

---

### 4. 多選下拉 (MultiSelect)

```html
<p-multiSelect
  formControlName="categories"
  [options]="categoryOptions"
  placeholder="選擇多個分類"
  [filter]="true"
  [showToggleAll]="true"
  optionLabel="label"
  optionValue="value"
></p-multiSelect>
```

```typescript
categories: new FormControl<string[]>([], [Validators.required])

// 設定預設選中的值
this.form.controls.categories.setValue(['1', '2']);
```

---

### 5. 按鈕 (Button)

```html
<!-- 主要按鈕 -->
<p-button label="送出" severity="primary"></p-button>

<!-- 次要按鈕 -->
<p-button label="取消" severity="secondary"></p-button>

<!-- 外框按鈕 -->
<p-button label="重置" [outlined]="true"></p-button>

<!-- 危險按鈕 -->
<p-button label="刪除" severity="danger"></p-button>

<!-- 成功按鈕 -->
<p-button label="確認" severity="success"></p-button>

<!-- 帶圖示 -->
<p-button label="搜尋" icon="pi pi-search"></p-button>

<!-- 只有圖示 -->
<p-button icon="pi pi-check" [rounded]="true"></p-button>

<!-- 停用狀態 -->
<p-button label="送出" [disabled]="!form.valid"></p-button>
```

---

### 6. 數字輸入 (InputNumber)

```html
<p-inputNumber
  formControlName="amount"
  [min]="0"
  [max]="1000"
  placeholder="輸入金額"
></p-inputNumber>
```

```typescript
import { InputNumberModule } from 'primeng/inputnumber';

amount: new FormControl<number | null>(null, [Validators.required])
```

---

### 7. 文字區域 (Textarea)

```html
<textarea
  pInputTextarea
  formControlName="description"
  rows="5"
  placeholder="請輸入描述"
></textarea>
```

```typescript
import { InputTextareaModule } from 'primeng/inputtextarea';

description: new FormControl<string>('', [Validators.required])
```

---

### 8. 開關 (InputSwitch)

```html
<p-inputSwitch formControlName="isActive"></p-inputSwitch>
```

```typescript
import { InputSwitchModule } from 'primeng/inputswitch';

isActive: new FormControl<boolean>(false)
```

---

### 9. 核取方塊 (Checkbox)

```html
<p-checkbox
  formControlName="agreed"
  [binary]="true"
  label="我同意條款"
></p-checkbox>
```

```typescript
import { CheckboxModule } from 'primeng/checkbox';

agreed: new FormControl<boolean>(false, [Validators.requiredTrue])
```

---

## 🔧 進階技巧

### 1. 自訂驗證器

```typescript
// 日期區間驗證（結束日期必須大於開始日期）
private dateRangeValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const startDate = formGroup.get('startDate')?.value;
    const endDate = formGroup.get('endDate')?.value;

    if (startDate && endDate && startDate > endDate) {
      return { dateRangeInvalid: true };
    }
    return null;
  };
}

// 使用
searchForm = new FormGroup({
  startDate: new FormControl<Date | null>(null),
  endDate: new FormControl<Date | null>(null),
}, { validators: this.dateRangeValidator() });
```

### 2. 動態停用欄位

```typescript
// 停用欄位
this.searchForm.controls.siteCode.disable();

// 啟用欄位
this.searchForm.controls.siteCode.enable();

// 根據條件停用
if (someCondition) {
  this.searchForm.controls.siteCode.disable();
}
```

### 3. 監聽欄位變化

```typescript
ngOnInit() {
  // 監聽單一欄位
  this.searchForm.controls.category.valueChanges.subscribe(value => {
    console.log('分類改變:', value);
  });

  // 監聽整個表單
  this.searchForm.valueChanges.subscribe(formValue => {
    console.log('表單改變:', formValue);
  });
}
```

### 4. 表單提交時標記所有欄位為 touched

```typescript
protected onSubmit() {
  if (this.searchForm.valid) {
    // 處理送出
    console.log(this.searchForm.value);
  } else {
    // 標記所有欄位，顯示錯誤訊息
    Object.keys(this.searchForm.controls).forEach(key => {
      this.searchForm.get(key)?.markAsTouched();
    });
  }
}
```

---

## 🎨 常用 CSS Class

PrimeNG 提供了 PrimeFlex（類似 Tailwind）的 utility classes：

```html
<!-- 寬度 -->
<input pInputText class="w-full" />       <!-- 100% 寬度 -->
<input pInputText class="w-6" />          <!-- 50% 寬度 -->

<!-- 間距 -->
<div class="p-3">內容</div>               <!-- padding -->
<div class="m-3">內容</div>               <!-- margin -->
<div class="mt-3">內容</div>              <!-- margin-top -->

<!-- Flex 佈局 -->
<div class="flex justify-content-between">
  <div>左邊</div>
  <div>右邊</div>
</div>

<!-- Grid 佈局 -->
<div class="grid">
  <div class="col-6">左半邊</div>
  <div class="col-6">右半邊</div>
</div>
```

如需使用這些 class，需安裝：
```bash
npm install primeflex
```

並在 `angular.json` 或 `styles.scss` 引入：
```scss
@import "primeflex/primeflex.css";
```

---

## 📚 參考資源

- **官方網站**: https://primeng.org/
- **元件列表**: https://primeng.org/components
- **主題設計**: https://primeng.org/theming
- **GitHub**: https://github.com/primefaces/primeng
- **社群論壇**: https://github.com/primefaces/primeng/discussions

---

## ⚡ 效能優化建議

1. **按需引入元件**：只 import 使用到的模組
2. **使用 OnPush 策略**：
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```
3. **避免在模板中使用函數**：改用 pipe 或計算屬性
4. **大量資料使用虛擬滾動**：Table、MultiSelect 都支援

---

## 🆚 與 Angular Material 對比

| 特性 | PrimeNG | Angular Material |
|------|---------|------------------|
| 元件數量 | 90+ | 40+ |
| 表單易用性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 日期區間選擇 | ✅ 原生支援 | ❌ 需自己實作 |
| 多選下拉 | ✅ 功能完整 | ⭐ 陽春 |
| 客製化 | 高 | 中 |
| Bundle Size | 中等 | 較小 |
| 視覺風格 | 多樣 | Material Design |

---

**建議**：如果專案重視表單易用性和豐富的元件，選擇 PrimeNG；如果追求 Material Design 風格和較小的 bundle size，選擇 Angular Material。
