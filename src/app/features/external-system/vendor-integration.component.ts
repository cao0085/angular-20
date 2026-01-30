import { Component } from '@angular/core';

@Component({
  selector: 'app-vendor-integration',
  standalone: true,
  template: `
    <div class="page-container">
      <h1>Test Data 2</h1>
      <div> Test if input values persist across tab/route changes.</div>
      <input type="text"/>
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
export class VendorIntegrationComponent { }
