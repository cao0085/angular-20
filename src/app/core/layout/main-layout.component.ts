import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';
import { TabContainerComponent } from './tab-container.component';

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
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #f5f6fa;
    }
  `]
})
export class MainLayoutComponent { }
