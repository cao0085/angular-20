import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TabService, Tab } from '../services/tab.service';
import { HomeComponent } from '../../features/home.component';

@Component({
  selector: 'app-tab-container',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HomeComponent],
  template: `
    <div class="tab-container">
      <!-- 分頁標籤列 -->
      <div class="tab-bar" *ngIf="tabs$().length">
        <div *ngFor="let tab of tabs$()" 
             class="tab"
             [class.active]="tab.id === activeTabId$()"
             (click)="switchTab(tab)">
          <span class="tab-title">{{ tab.title }}</span>
          <button *ngIf="tab.closable" 
                  class="close-btn"
                  (click)="closeTab($event, tab.id)">
            ✕
          </button>
        </div>
      </div>

      <!-- 分頁內容區 -->
      <div class="tab-content">
        <!-- 當有 tabs 時顯示 router-outlet -->
        <router-outlet *ngIf="tabs$().length"></router-outlet>
        
        <!-- 當沒有 tabs 時顯示首頁 -->
        <app-home *ngIf="!tabs$().length"></app-home>
      </div>
    </div>
  `,
  styles: [`
    .tab-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .tab-bar {
      display: flex;
      background: #ecf0f1;
      border-bottom: 2px solid #bdc3c7;
      overflow-x: auto;
      flex-shrink: 0;
    }

    .tab {
      display: flex;
      align-items: center;
      padding: 10px 15px;
      background: #ecf0f1;
      border-right: 1px solid #bdc3c7;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
      min-width: 120px;
    }

    .tab:hover {
      background: #d5dbdb;
    }

    .tab.active {
      background: white;
      border-bottom: 2px solid white;
      margin-bottom: -2px;
      font-weight: 500;
    }

    .tab-title {
      margin-right: 8px;
      font-size: 13px;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0 4px;
      font-size: 16px;
      color: #7f8c8d;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 3px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      color: #e74c3c;
      background: rgba(231, 76, 60, 0.1);
    }

    .tab-content {
      flex: 1;
      overflow: auto;
      background: white;
      padding: 20px;
    }

    /* 滾動條樣式 */
    .tab-bar::-webkit-scrollbar {
      height: 6px;
    }

    .tab-bar::-webkit-scrollbar-track {
      background: #ecf0f1;
    }

    .tab-bar::-webkit-scrollbar-thumb {
      background: #bdc3c7;
      border-radius: 3px;
    }

    .tab-bar::-webkit-scrollbar-thumb:hover {
      background: #95a5a6;
    }
  `]
})
export class TabContainerComponent {
  private tabService = inject(TabService);

  // 取得 service 中的內部狀態，提供給 html template event + rerender
  tabs$ = this.tabService.tabs$;
  activeTabId$ = this.tabService.activeTabId$;

  switchTab(tab: Tab) {
    this.tabService.openTab(tab);
  }

  closeTab(event: Event, tabId: string) {
    event.stopPropagation();
    this.tabService.closeTab(tabId);
  }
}
