import { Component } from '@angular/core';

@Component({
    selector: 'app-order-management',
    standalone: true,
    template: `
    <div class="page-container">
      <h1>歡迎來到 路邊停車系統 - 訂單管理</h1>
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
export class OrderManagementComponent { }
