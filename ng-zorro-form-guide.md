# Ng-Zorro (Ant Design for Angular) 表單使用指南

## 📦 安裝

```bash
npm install ng-zorro-antd
```

## 🎨 配置

### 1. 在 `angular.json` 中配置樣式

```json
{
  "projects": {
    "your-project": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "node_modules/ng-zorro-antd/ng-zorro-antd.min.css",
              "src/styles.scss"
            ]
          }
        }
      }
    }
  }
}
```

### 2. 或在 `styles.scss` 中引入

```scss
@import "ng-zorro-antd/ng-zorro-antd.min.css";
```

### 3. 配置主題色（可選）

在 `styles.scss` 中自訂主題：

```scss
// 自訂主題色
:root {
  --ant-primary-color: #1890ff;
  --ant-success-color: #52c41a;
  --ant-warning-color: #faad14;
  --ant-error-color: #f5222d;
}
```

或使用預設主題：
- 預設藍色主題
- 暗黑主題（需額外配置）
- 緊湊主題（組件更小）

---

## 📝 基本表單結構

### TypeScript Component

```typescript
import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-permission-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzDatePickerModule,
    NzSelectModule,
    NzCardModule,
  ],
  templateUrl: './permission-list.html',
  styleUrl: './permission-list.scss',
})
export class PermissionList {
  // 下拉選項
  categoryOptions = [
    { label: '管理員', value: 'admin' },
    { label: '使用者', value: 'user' },
    { label: '訪客', value: 'guest' },
  ];

  // 表單定義
  searchForm = new FormGroup({
    siteCode: new FormControl<string>('', [Validators.required]),
    userCode: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^\d+$/), // 只能輸入數字
    ]),
    invoice: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^[A-Z0-9]+$/), // 英文大寫 + 數字
    ]),
    dateRange: new FormControl<Date[]>([], [Validators.required]), // 日期區間
    categories: new FormControl<string[]>([], [Validators.required]), // 多選
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

    this.searchForm.controls.dateRange.setValue([firstDay, lastDay]);
  }

  protected onSubmit() {
    if (this.searchForm.valid) {
      console.log('表單資料:', this.searchForm.value);
      // 處理送出邏輯
    } else {
      // 標記所有欄位為 dirty 和 touched，顯示錯誤訊息
      Object.values(this.searchForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  protected onReset() {
    this.searchForm.reset();
    this.searchForm.controls.siteCode.setValue('2255');
    this.setDefaultDateRange();
  }
}
```

### HTML Template

```html
<div class="page-container">
  <nz-card nzTitle="權限管理">
    <form nz-form [formGroup]="searchForm" (ngSubmit)="onSubmit()" nzLayout="vertical">

      <!-- 第一行：站點代碼、使用者代碼 -->
      <div nz-row [nzGutter]="16">
        <!-- 站點代碼 -->
        <div nz-col [nzSpan]="12">
          <nz-form-item>
            <nz-form-label nzRequired>站點代碼</nz-form-label>
            <nz-form-control [nzErrorTip]="siteCodeErrorTpl">
              <input
                nz-input
                formControlName="siteCode"
                placeholder="請輸入站點代碼"
              />
              <ng-template #siteCodeErrorTpl let-control>
                @if (control.hasError('required')) {
                  <span>站點代碼為必填</span>
                }
              </ng-template>
            </nz-form-control>
          </nz-form-item>
        </div>

        <!-- 使用者代碼 (限制數字) -->
        <div nz-col [nzSpan]="12">
          <nz-form-item>
            <nz-form-label nzRequired>使用者代碼</nz-form-label>
            <nz-form-control [nzErrorTip]="userCodeErrorTpl">
              <input
                nz-input
                formControlName="userCode"
                placeholder="請輸入數字"
              />
              <ng-template #userCodeErrorTpl let-control>
                @if (control.hasError('required')) {
                  <span>使用者代碼為必填</span>
                }
                @if (control.hasError('pattern')) {
                  <span>請輸入數字</span>
                }
              </ng-template>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 第二行：發票號碼、分類 -->
      <div nz-row [nzGutter]="16">
        <!-- 發票號碼 (限制英文數字) -->
        <div nz-col [nzSpan]="12">
          <nz-form-item>
            <nz-form-label nzRequired>發票號碼</nz-form-label>
            <nz-form-control [nzErrorTip]="invoiceErrorTpl">
              <input
                nz-input
                formControlName="invoice"
                placeholder="請輸入英文大寫和數字"
              />
              <ng-template #invoiceErrorTpl let-control>
                @if (control.hasError('required')) {
                  <span>發票號碼為必填</span>
                }
                @if (control.hasError('pattern')) {
                  <span>只能輸入英文大寫和數字</span>
                }
              </ng-template>
            </nz-form-control>
          </nz-form-item>
        </div>

        <!-- 下拉多選 -->
        <div nz-col [nzSpan]="12">
          <nz-form-item>
            <nz-form-label nzRequired>分類</nz-form-label>
            <nz-form-control nzErrorTip="請至少選擇一個分類">
              <nz-select
                formControlName="categories"
                nzMode="multiple"
                nzPlaceHolder="選擇分類"
                nzShowSearch
              >
                @for (option of categoryOptions; track option.value) {
                  <nz-option [nzLabel]="option.label" [nzValue]="option.value"></nz-option>
                }
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 第三行：日期區間 -->
      <div nz-row [nzGutter]="16">
        <div nz-col [nzSpan]="24">
          <nz-form-item>
            <nz-form-label nzRequired>日期區間</nz-form-label>
            <nz-form-control nzErrorTip="日期區間為必填">
              <nz-range-picker
                formControlName="dateRange"
                [nzFormat]="'yyyy-MM-dd'"
                style="width: 100%"
              ></nz-range-picker>
            </nz-form-control>
          </nz-form-item>
        </div>
      </div>

      <!-- 按鈕 -->
      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="default" type="button" (click)="onReset()">
            重置
          </button>
          <button
            nz-button
            nzType="primary"
            type="submit"
            [disabled]="!searchForm.valid"
            style="margin-left: 8px"
          >
            查詢
          </button>
        </nz-form-control>
      </nz-form-item>

    </form>
  </nz-card>
</div>
```

### SCSS Styles

```scss
.page-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;

  nz-card {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03),
                0 1px 6px -1px rgba(0, 0, 0, 0.02),
                0 2px 4px 0 rgba(0, 0, 0, 0.02);
  }

  // 表單項目間距
  nz-form-item {
    margin-bottom: 16px;
  }

  // 按鈕容器
  nz-form-item:last-child {
    margin-top: 24px;
    text-align: right;
  }
}

// 響應式設計
@media (max-width: 768px) {
  .page-container {
    padding: 16px;

    // 小螢幕時改為單欄
    [nz-col] {
      nz-span: 24 !important;
    }
  }
}
```

---

## 🎯 常用元件範例

### 1. 文字輸入框 (Input)

```html
<nz-form-item>
  <nz-form-label nzRequired>欄位名稱</nz-form-label>
  <nz-form-control nzErrorTip="錯誤訊息">
    <input nz-input formControlName="fieldName" placeholder="提示文字" />
  </nz-form-control>
</nz-form-item>
```

#### 帶前綴/後綴圖示

```html
<nz-input-group [nzPrefix]="prefixIconSearch">
  <input nz-input formControlName="search" placeholder="搜尋" />
</nz-input-group>
<ng-template #prefixIconSearch>
  <span nz-icon nzType="search"></span>
</ng-template>
```

#### 限制輸入格式

```typescript
// 只能輸入數字
new FormControl('', [Validators.pattern(/^\d+$/)])

// 只能輸入英文大寫和數字
new FormControl('', [Validators.pattern(/^[A-Z0-9]+$/)])

// Email 格式
new FormControl('', [Validators.email])

// 電話號碼 (10碼)
new FormControl('', [Validators.pattern(/^09\d{8}$/)])
```

---

### 2. 日期選擇器 (DatePicker)

#### 單一日期

```html
<nz-form-item>
  <nz-form-label nzRequired>日期</nz-form-label>
  <nz-form-control nzErrorTip="請選擇日期">
    <nz-date-picker
      formControlName="date"
      [nzFormat]="'yyyy-MM-dd'"
      nzPlaceHolder="選擇日期"
      style="width: 100%"
    ></nz-date-picker>
  </nz-form-control>
</nz-form-item>
```

```typescript
date: new FormControl<Date | null>(null, [Validators.required])
```

#### 日期區間 (Range Picker) ⭐ 超好用

```html
<nz-form-item>
  <nz-form-label nzRequired>日期區間</nz-form-label>
  <nz-form-control nzErrorTip="請選擇日期區間">
    <nz-range-picker
      formControlName="dateRange"
      [nzFormat]="'yyyy-MM-dd'"
      style="width: 100%"
    ></nz-range-picker>
  </nz-form-control>
</nz-form-item>
```

```typescript
dateRange: new FormControl<Date[]>([], [Validators.required])

// 設定預設值
this.form.controls.dateRange.setValue([new Date('2025-01-01'), new Date('2025-01-31')]);
```

#### 限制日期範圍

```html
<nz-date-picker
  formControlName="date"
  [nzDisabledDate]="disabledDate"
></nz-date-picker>
```

```typescript
// 只能選今天以後的日期
disabledDate = (current: Date): boolean => {
  return current && current < new Date();
};

// 只能選今年的日期
disabledDate = (current: Date): boolean => {
  const year = new Date().getFullYear();
  return current.getFullYear() !== year;
};
```

---

### 3. 下拉選單 (Select)

#### 單選

```html
<nz-form-item>
  <nz-form-label nzRequired>分類</nz-form-label>
  <nz-form-control nzErrorTip="請選擇分類">
    <nz-select formControlName="category" nzPlaceHolder="請選擇">
      @for (option of categoryOptions; track option.value) {
        <nz-option [nzLabel]="option.label" [nzValue]="option.value"></nz-option>
      }
    </nz-select>
  </nz-form-control>
</nz-form-item>
```

```typescript
categoryOptions = [
  { label: '選項一', value: '1' },
  { label: '選項二', value: '2' },
];

category: new FormControl<string>('', [Validators.required])
```

#### 多選 ⭐ 功能強大

```html
<nz-form-item>
  <nz-form-label nzRequired>分類</nz-form-label>
  <nz-form-control nzErrorTip="請至少選擇一個">
    <nz-select
      formControlName="categories"
      nzMode="multiple"
      nzPlaceHolder="選擇多個分類"
      nzShowSearch
      nzAllowClear
    >
      @for (option of categoryOptions; track option.value) {
        <nz-option [nzLabel]="option.label" [nzValue]="option.value"></nz-option>
      }
    </nz-select>
  </nz-form-control>
</nz-form-item>
```

```typescript
categories: new FormControl<string[]>([], [Validators.required])
```

#### 帶搜尋功能的下拉

```html
<nz-select
  formControlName="user"
  nzShowSearch
  nzServerSearch
  (nzOnSearch)="searchUser($event)"
>
  @for (user of userList; track user.id) {
    <nz-option [nzLabel]="user.name" [nzValue]="user.id"></nz-option>
  }
</nz-select>
```

---

### 4. 按鈕 (Button)

```html
<!-- 主要按鈕 -->
<button nz-button nzType="primary">送出</button>

<!-- 預設按鈕 -->
<button nz-button nzType="default">取消</button>

<!-- 虛線按鈕 -->
<button nz-button nzType="dashed">重置</button>

<!-- 危險按鈕 -->
<button nz-button nzDanger>刪除</button>

<!-- 連結按鈕 -->
<button nz-button nzType="link">連結</button>

<!-- 帶圖示 -->
<button nz-button nzType="primary">
  <span nz-icon nzType="search"></span>
  搜尋
</button>

<!-- 只有圖示 -->
<button nz-button nzType="primary" nzShape="circle">
  <span nz-icon nzType="search"></span>
</button>

<!-- Loading 狀態 -->
<button nz-button nzType="primary" [nzLoading]="isLoading">
  送出
</button>

<!-- 停用狀態 -->
<button nz-button [disabled]="!form.valid">送出</button>

<!-- 尺寸 -->
<button nz-button nzSize="large">大按鈕</button>
<button nz-button nzSize="default">預設</button>
<button nz-button nzSize="small">小按鈕</button>
```

---

### 5. 數字輸入 (InputNumber)

```html
<nz-form-item>
  <nz-form-label nzRequired>金額</nz-form-label>
  <nz-form-control nzErrorTip="請輸入金額">
    <nz-input-number
      formControlName="amount"
      [nzMin]="0"
      [nzMax]="10000"
      [nzStep]="1"
      style="width: 100%"
    ></nz-input-number>
  </nz-form-control>
</nz-form-item>
```

```typescript
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

amount: new FormControl<number | null>(null, [Validators.required])
```

---

### 6. 文字區域 (Textarea)

```html
<nz-form-item>
  <nz-form-label nzRequired>描述</nz-form-label>
  <nz-form-control nzErrorTip="請輸入描述">
    <textarea
      nz-input
      formControlName="description"
      rows="4"
      placeholder="請輸入描述"
    ></textarea>
  </nz-form-control>
</nz-form-item>
```

```typescript
description: new FormControl<string>('', [Validators.required])
```

---

### 7. 開關 (Switch)

```html
<nz-form-item>
  <nz-form-label>啟用狀態</nz-form-label>
  <nz-form-control>
    <nz-switch formControlName="isActive"></nz-switch>
  </nz-form-control>
</nz-form-item>
```

```typescript
import { NzSwitchModule } from 'ng-zorro-antd/switch';

isActive: new FormControl<boolean>(false)
```

---

### 8. 核取方塊 (Checkbox)

```html
<nz-form-item>
  <nz-form-control>
    <label nz-checkbox formControlName="agreed">
      我同意服務條款
    </label>
  </nz-form-control>
</nz-form-item>
```

```typescript
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

agreed: new FormControl<boolean>(false, [Validators.requiredTrue])
```

---

### 9. 單選按鈕 (Radio)

```html
<nz-form-item>
  <nz-form-label nzRequired>性別</nz-form-label>
  <nz-form-control>
    <nz-radio-group formControlName="gender">
      <label nz-radio nzValue="male">男</label>
      <label nz-radio nzValue="female">女</label>
      <label nz-radio nzValue="other">其他</label>
    </nz-radio-group>
  </nz-form-control>
</nz-form-item>
```

```typescript
import { NzRadioModule } from 'ng-zorro-antd/radio';

gender: new FormControl<string>('', [Validators.required])
```

---

### 10. 上傳檔案 (Upload)

```html
<nz-form-item>
  <nz-form-label nzRequired>上傳檔案</nz-form-label>
  <nz-form-control>
    <nz-upload
      [nzAction]="uploadUrl"
      [nzFileList]="fileList"
      (nzChange)="handleChange($event)"
    >
      <button nz-button>
        <span nz-icon nzType="upload"></span>
        選擇檔案
      </button>
    </nz-upload>
  </nz-form-control>
</nz-form-item>
```

```typescript
import { NzUploadModule, NzUploadFile, NzUploadChangeParam } from 'ng-zorro-antd/upload';

uploadUrl = 'https://your-api.com/upload';
fileList: NzUploadFile[] = [];

handleChange(info: NzUploadChangeParam): void {
  this.fileList = info.fileList;
}
```

---

## 🔧 進階技巧

### 1. 表單佈局方式

#### 垂直佈局 (預設)

```html
<form nz-form [formGroup]="form" nzLayout="vertical">
  <!-- 表單內容 -->
</form>
```

#### 水平佈局

```html
<form nz-form [formGroup]="form" nzLayout="horizontal">
  <nz-form-item>
    <nz-form-label [nzSpan]="6" nzRequired>欄位名稱</nz-form-label>
    <nz-form-control [nzSpan]="14" nzErrorTip="錯誤訊息">
      <input nz-input formControlName="fieldName" />
    </nz-form-control>
  </nz-form-item>
</form>
```

#### 行內佈局

```html
<form nz-form [formGroup]="form" nzLayout="inline">
  <!-- 所有欄位會排成一行 -->
</form>
```

---

### 2. 自訂錯誤訊息

#### 方法 1: 使用 Template

```html
<nz-form-control [nzErrorTip]="errorTpl">
  <input nz-input formControlName="email" />
  <ng-template #errorTpl let-control>
    @if (control.hasError('required')) {
      <span>Email 為必填</span>
    }
    @if (control.hasError('email')) {
      <span>請輸入有效的 Email</span>
    }
  </ng-template>
</nz-form-control>
```

#### 方法 2: 直接使用字串

```html
<nz-form-control nzErrorTip="此欄位為必填">
  <input nz-input formControlName="fieldName" />
</nz-form-control>
```

---

### 3. 響應式網格佈局

```html
<div nz-row [nzGutter]="16">
  <!-- 桌面: 3欄, 平板: 2欄, 手機: 1欄 -->
  <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8">
    <nz-form-item>
      <!-- 表單內容 -->
    </nz-form-item>
  </div>
</div>
```

Grid 斷點：
- `nzXs`: < 576px (手機)
- `nzSm`: ≥ 576px (平板)
- `nzMd`: ≥ 768px (小型桌面)
- `nzLg`: ≥ 992px (中型桌面)
- `nzXl`: ≥ 1200px (大型桌面)
- `nzXXl`: ≥ 1600px (超大桌面)

---

### 4. 動態表單驗證

```typescript
// 動態新增/移除驗證
ngOnInit() {
  // 監聽某個欄位變化
  this.form.controls.category.valueChanges.subscribe(value => {
    if (value === 'other') {
      // 新增驗證
      this.form.controls.otherDetail.setValidators([Validators.required]);
    } else {
      // 移除驗證
      this.form.controls.otherDetail.clearValidators();
    }
    this.form.controls.otherDetail.updateValueAndValidity();
  });
}
```

---

### 5. 自訂驗證器

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// 日期區間驗證
export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateRange = control.value as Date[];
    if (!dateRange || dateRange.length !== 2) {
      return null;
    }

    const [start, end] = dateRange;
    const diffDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    // 限制最多選擇 31 天
    if (diffDays > 31) {
      return { dateRangeExceeded: { max: 31, actual: diffDays } };
    }

    return null;
  };
}

// 使用
dateRange: new FormControl<Date[]>([], [Validators.required, dateRangeValidator()])
```

---

### 6. 表單提交處理

```typescript
onSubmit() {
  if (this.searchForm.valid) {
    const formData = this.searchForm.value;
    console.log('表單資料:', formData);

    // 呼叫 API
    // this.apiService.submit(formData).subscribe(...);
  } else {
    // 標記所有欄位為 dirty，顯示錯誤
    Object.values(this.searchForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
}
```

---

## 🎨 常用圖示 (Icons)

Ng-Zorro 使用 Ant Design Icons：

```html
<!-- 常用圖示 -->
<span nz-icon nzType="search"></span>
<span nz-icon nzType="user"></span>
<span nz-icon nzType="calendar"></span>
<span nz-icon nzType="check"></span>
<span nz-icon nzType="close"></span>
<span nz-icon nzType="delete"></span>
<span nz-icon nzType="edit"></span>
<span nz-icon nzType="plus"></span>
<span nz-icon nzType="download"></span>
<span nz-icon nzType="upload"></span>

<!-- 帶主題 -->
<span nz-icon nzType="heart" nzTheme="fill"></span>
<span nz-icon nzType="heart" nzTheme="outline"></span>
<span nz-icon nzType="heart" nzTheme="twotone"></span>

<!-- 自訂顏色和大小 -->
<span nz-icon nzType="check-circle" style="color: #52c41a; font-size: 24px;"></span>
```

完整圖示列表：https://ng.ant.design/components/icon/zh

---

## 💡 實用提示

### 1. 訊息提示 (Message)

```typescript
import { NzMessageService } from 'ng-zorro-antd/message';

constructor(private message: NzMessageService) {}

onSubmit() {
  if (this.form.valid) {
    this.message.success('儲存成功！');
  } else {
    this.message.error('請填寫所有必填欄位');
  }
}
```

### 2. 通知 (Notification)

```typescript
import { NzNotificationService } from 'ng-zorro-antd/notification';

constructor(private notification: NzNotificationService) {}

showNotification() {
  this.notification.success(
    '操作成功',
    '您的資料已成功儲存',
    { nzDuration: 3000 }
  );
}
```

### 3. 對話框 (Modal)

```typescript
import { NzModalService } from 'ng-zorro-antd/modal';

constructor(private modal: NzModalService) {}

showConfirm() {
  this.modal.confirm({
    nzTitle: '確認刪除？',
    nzContent: '此操作無法復原',
    nzOnOk: () => {
      console.log('確認');
    }
  });
}
```

---

## 📊 完整範例：搜尋表單

這是一個完整的搜尋表單範例，包含各種常用元件：

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
})
export class SearchFormComponent {
  searchForm: FormGroup;

  statusOptions = [
    { label: '啟用', value: 'active' },
    { label: '停用', value: 'inactive' },
  ];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.searchForm = this.fb.group({
      keyword: [''],
      status: [null],
      dateRange: [null, [Validators.required]],
      amount: [null],
    });

    this.setDefaultDateRange();
  }

  private setDefaultDateRange() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.searchForm.patchValue({ dateRange: [firstDay, lastDay] });
  }

  onSearch() {
    if (this.searchForm.valid) {
      console.log('搜尋條件:', this.searchForm.value);
      this.message.success('查詢成功');
    } else {
      this.message.error('請填寫必填欄位');
    }
  }

  onReset() {
    this.searchForm.reset();
    this.setDefaultDateRange();
  }
}
```

---

## 🆚 Ng-Zorro vs PrimeNG vs Angular Material

| 特性 | Ng-Zorro | PrimeNG | Angular Material |
|------|----------|---------|------------------|
| 元件數量 | 60+ | 90+ | 40+ |
| 設計風格 | Ant Design | 多樣 | Material Design |
| 日期區間 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 多選下拉 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| 表單驗證 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 圖示豐富度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 客製化 | 中高 | 高 | 中 |
| Bundle Size | 中等 | 中等 | 較小 |
| 中文文件 | ✅ 優秀 | ❌ 較少 | ❌ 較少 |
| 虛擬滾動 | ✅ | ✅ | ✅ |
| 社群活躍度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 📚 參考資源

- **官方網站**: https://ng.ant.design/
- **中文文件**: https://ng.ant.design/docs/introduce/zh
- **元件列表**: https://ng.ant.design/components/overview/zh
- **GitHub**: https://github.com/NG-ZORRO/ng-zorro-antd
- **圖示庫**: https://ng.ant.design/components/icon/zh
- **Design Spec**: https://ant.design/

---

## 💡 最終建議

### 選擇 Ng-Zorro 如果：

✅ **你的需求完全符合**：
- 需要完整的表單元件（日期區間、多選下拉等）
- 喜歡 Ant Design 的現代、簡潔風格
- 需要中文文件支持
- 專案是企業後台、管理系統

✅ **優勢**：
- 日期區間選擇器 (`nz-range-picker`) 非常好用
- 多選下拉功能完整（搜尋、全選、虛擬滾動）
- 表單驗證錯誤提示清晰
- 中文社群活躍，文件齊全
- 圖示豐富且美觀

✅ **與 PrimeNG 相比**：
- Ng-Zorro 更輕量、視覺更現代
- 中文文件更友善
- Ant Design 在亞洲更流行
- 但元件數量較 PrimeNG 少（60+ vs 90+）

---

**總結**：根據你的需求（視覺一致性 + 表單好用 + 不需過度客製化），**Ng-Zorro 和 PrimeNG 都非常適合**！

- **Ng-Zorro**：更現代、輕量、中文友善
- **PrimeNG**：元件更多、主題選擇更多

我個人推薦 **Ng-Zorro**，因為它的表單元件確實很好用，而且 Ant Design 的設計風格很適合企業應用！
