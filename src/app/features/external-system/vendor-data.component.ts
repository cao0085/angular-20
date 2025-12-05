import { Component } from '@angular/core';

@Component({
  selector: 'app-vendor-data',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>歡迎來到 外部系統 - 廠商資料</h1>
      <input type="text" placeholder="測試狀態有沒有保留">
    </div>
  `,
  styles: [`
    .page-container {
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      font-size: 24px;
    }
  `]
})
export class VendorDataComponent { }
