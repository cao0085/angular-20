import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';
import { TabContainerComponent } from './tab-container.component';
import { LoadingService } from '../services/loading.service';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent,
    TabContainerComponent
  ],
  template: `
    <div class="main-layout">
      <!-- 左側側邊欄 -->
      <app-sidebar></app-sidebar>

      <!-- 右側主要內容區 -->
      <div class="main-content">
        <!-- Header Bar -->
        <app-header></app-header>

        <!-- 分頁容器 -->
        <app-tab-container></app-tab-container>
      </div>

      <!-- 全域 Loading 遮罩 -->
      @if (loadingService.isLoading()) {
        <div class="loading-overlay">
          <div class="spinner"></div>
        </div>
      }

      <!-- Toast 通知容器 -->
      <div class="toast-container">
        @for (msg of notifyService.messages(); track msg.id) {
          <div class="toast toast-{{msg.type}}" (click)="notifyService.remove(msg.id)">
            <span class="toast-message">{{msg.message}}</span>
            <button class="toast-close">&times;</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
      position: relative;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #f5f6fa;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    ` + `@keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }

    .toast {
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      min-width: 300px;
    }

    .toast-message {
      flex: 1;
      color: white;
      font-size: 14px;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      line-height: 1;
      opacity: 0.8;
    }

    .toast-close:hover {
      opacity: 1;
    }

    .toast-success {
      background: #10b981;
    }

    .toast-error {
      background: #ef4444;
    }

    .toast-warning {
      background: #f59e0b;
    }

    .toast-info {
      background: #3b82f6;
    }

    ` + `@keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class MainLayoutComponent {
  loadingService = inject(LoadingService);
  notifyService = inject(NotifyService);
}
