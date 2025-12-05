import { Component } from '@angular/core';

@Component({
    selector: 'app-system-directory',
    standalone: true,
    template: `
    <div class="page-container">
      <h1>歡迎來到 基礎系統 - 系統目錄</h1>
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
export class SystemDirectoryComponent { }
