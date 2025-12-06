import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabService } from '../services/tab.service';
import { AuthService } from '../services/auth.service';
import { ModuleId, ModulePermissions } from '../models/roles';

interface MenuItem {
  id: string;
  label: string;
  route: string;
  icon?: string;
  children?: MenuItem[];
  expanded?: boolean;
  moduleId?: ModuleId; // 新增：關聯到權限模組
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <!-- 收合按鈕 -->
      <div class="toggle-btn" (click)="toggleSidebar()">
        <span>{{ isCollapsed ? '▶' : '◀' }}</span>
      </div>

      <!-- 選單列表 -->
      <nav class="menu" *ngIf="!isCollapsed">
        <ul class="menu-list">
          <li *ngFor="let item of menuItems()" class="menu-item">
            <!-- 父選單 -->
            <div class="menu-label" (click)="toggleMenu(item)">
              <span class="icon" *ngIf="item.icon">{{ item.icon }}</span>
              <span class="label">{{ item.label }}</span>
              <span class="arrow" *ngIf="item.children">
                {{ item.expanded ? '▼' : '▶' }}
              </span>
            </div>

            <!-- 子選單 -->
            <ul *ngIf="item.children && item.expanded" class="submenu">
              <li *ngFor="let child of item.children" class="submenu-item">
                <!-- 如果還有子選單 -->
                <div *ngIf="child.children" class="submenu-label" (click)="toggleMenu(child)">
                  <span>{{ child.label }}</span>
                  <span class="arrow">{{ child.expanded ? '▼' : '▶' }}</span>
                </div>
                
                <!-- 如果沒有子選單，直接點擊開啟分頁 -->
                <div *ngIf="!child.children" class="submenu-label clickable" (click)="openTab(child)">
                  <span>{{ child.label }}</span>
                </div>

                <!-- 第三層選單 -->
                <ul *ngIf="child.children && child.expanded" class="submenu-level-3">
                  <li *ngFor="let subChild of child.children" 
                      class="submenu-item-level-3"
                      (click)="openTab(subChild)">
                    {{ subChild.label }}
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      background: #2c3e50;
      color: white;
      height: 100vh;
      overflow-y: auto;
      transition: width 0.3s ease;
      position: relative;
    }

    .sidebar.collapsed {
      width: 50px;
    }

    .toggle-btn {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: #34495e;
      border-bottom: 1px solid #1a252f;
      font-size: 18px;
    }

    .toggle-btn:hover {
      background: #3d566e;
    }

    .menu {
      padding: 10px 0;
    }

    .menu-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .menu-item {
      margin-bottom: 5px;
    }

    .menu-label {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      cursor: pointer;
      transition: background 0.2s;
      user-select: none;
    }

    .menu-label:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .icon {
      margin-right: 10px;
      font-size: 18px;
    }

    .label {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }

    .arrow {
      font-size: 12px;
      margin-left: auto;
    }

    .submenu {
      list-style: none;
      padding: 0;
      margin: 0;
      background: rgba(0, 0, 0, 0.2);
    }

    .submenu-item {
      margin: 0;
    }

    .submenu-label {
      display: flex;
      align-items: center;
      padding: 10px 20px 10px 45px;
      font-size: 13px;
      transition: background 0.2s;
      user-select: none;
    }

    .submenu-label.clickable {
      cursor: pointer;
    }

    .submenu-label.clickable:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .submenu-label span:first-child {
      flex: 1;
    }

    .submenu-level-3 {
      list-style: none;
      padding: 0;
      margin: 0;
      background: rgba(0, 0, 0, 0.3);
    }

    .submenu-item-level-3 {
      padding: 8px 20px 8px 60px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .submenu-item-level-3:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    /* 滾動條樣式 */
    .sidebar::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar::-webkit-scrollbar-track {
      background: #1a252f;
    }

    .sidebar::-webkit-scrollbar-thumb {
      background: #34495e;
      border-radius: 3px;
    }

    .sidebar::-webkit-scrollbar-thumb:hover {
      background: #4a6278;
    }
  `]
})
export class SidebarComponent {
  isCollapsed = false;

  // 完整的選單定義（包含所有項目）
  private allMenuItems: MenuItem[] = [
    {
      id: 'basic-system',
      label: '基礎系統',
      route: '/main/basic-system',
      expanded: false,
      moduleId: ModuleId.BASIC_SYSTEM, // 關聯權限模組
      children: [
        { id: 'system-log', label: '系統日誌', route: '/main/basic-system/log' },
        { id: 'system-directory', label: '系統目錄', route: '/main/basic-system/directory' },
        { id: 'permission-list', label: '權限管理', route: '/main/basic-system/permission-list' }
      ]
    },
    {
      id: 'external-system',
      label: '外部系統',
      route: '/main/external-system',
      expanded: false,
      moduleId: ModuleId.EXTERNAL_SYSTEM,
      children: [
        { id: 'vendor-data', label: '廠商資料', route: '/main/external-system/vendor-data' },
        { id: 'vendor-integration', label: '廠商串接', route: '/main/external-system/vendor-integration' }
      ]
    },
    {
      id: 'payment-system',
      label: '金流系統',
      route: '/main/payment-system',
      expanded: false,
      moduleId: ModuleId.PAYMENT_SYSTEM,
      children: [
        { id: 'payment-method', label: '收費方式', route: '/main/payment-system/payment-method' },
        { id: 'payment-integration', label: '金流串接', route: '/main/payment-system/payment-integration' }
      ]
    },
    {
      id: 'parking-system',
      label: '路邊停車系統',
      route: '/main/parking-system',
      expanded: false,
      moduleId: ModuleId.PARKING_SYSTEM,
      children: [
        { id: 'order-management', label: '訂單管理', route: '/main/parking-system/order-management' },
        {
          id: 'report-analysis',
          label: '報表分析',
          route: '/main/parking-system/report-analysis',
          expanded: false,
          children: [
            { id: 'void-report', label: '作廢報表', route: '/main/parking-system/report-analysis/void-report' },
            { id: 'billing-detail', label: '開單明細', route: '/main/parking-system/report-analysis/billing-detail' },
            { id: 'upload-statistics', label: '上傳統計', route: '/main/parking-system/report-analysis/upload-statistics' }
          ]
        }
      ]
    }
  ];

  // 根據使用者權限過濾選單項目
  menuItems = computed(() => {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return [];
    }

    return this.allMenuItems.filter(item => {
      // 如果沒有設定 moduleId，表示所有人都可以看到
      if (!item.moduleId) {
        return true;
      }

      // 檢查使用者角色是否有權限訪問此模組
      const allowedRoles = ModulePermissions[item.moduleId];
      return allowedRoles.includes(currentUser.role);
    });
  });

  // 也可以用 inject()
  // private tabService = inject(TabService);
  // private authService = inject(AuthService);
  constructor(
    private tabService: TabService,
    private authService: AuthService
  ) { }
  ;
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMenu(item: MenuItem) {
    item.expanded = !item.expanded;
  }

  openTab(item: MenuItem) {
    this.tabService.openTab({
      id: item.id,
      title: item.label,
      route: item.route,
      closable: true
    });
  }
}
