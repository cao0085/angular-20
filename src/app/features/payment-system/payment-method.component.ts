import { Component } from '@angular/core';

@Component({
    selector: 'app-payment-method',
    standalone: true,
    template: `
    <div class="page-container">
      <h1>歡迎來到 金流系統 - 收費方式</h1>
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
export class PaymentMethodComponent { }
