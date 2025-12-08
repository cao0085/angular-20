import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-left">
        <h2>停車管理系統</h2>
      </div>
      <div class="header-right">
        @if (currentUser()) {
          <div class="user-info">
            <span class="user-name">{{ currentUser()?.username }}</span>
          </div>
          <button class="logout-btn" (click)="logout()" title="登出">
            <span class="logout-text">登出</span>
          </button>
        }
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: 50px;
      background: #ffffff;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .header-left h2 {
      margin: 0;
      font-size: 18px;
      color: #2c3e50;
      font-weight: 600;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding-right: 15px;
      border-right: 1px solid #e0e0e0;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;
    }

    .user-role {
      font-size: 12px;
      color: #7f8c8d;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #ffffff;
      border: 1px solid #e74c3c;
      border-radius: 4px;
      color: #e74c3c;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background: #e74c3c;
      color: white;
    }

    .logout-icon {
      font-size: 16px;
    }

    .logout-text {
      font-weight: 500;
    }
  `]
})
export class HeaderComponent {
  private authService = inject(AuthService);

  // 使用 computed 獲取當前使用者
  currentUser = computed(() => this.authService.getCurrentUser());

  // 登出功能
  logout() {
    if (confirm('確定要登出嗎？')) {
      this.authService.logout();
    }
  }
}
