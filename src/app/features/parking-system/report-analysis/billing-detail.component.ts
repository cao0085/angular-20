import { Component } from '@angular/core';

@Component({
    selector: 'app-billing-detail',
    standalone: true,
    template: `
    <div class="page-container">
      <h1>歡迎來到 報表分析 - 開單明細</h1>
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
export class BillingDetailComponent { }
