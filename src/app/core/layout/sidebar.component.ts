import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabService } from '../services/tab.service';
import { PermissionService, ClaimType, ClaimTreeNode } from '../services/permission.service';
import { ClaimCode } from '../models/claims';
import { buildAllClaimRouteMap } from '../config/route.config';
import { Router } from '@angular/router';

interface MenuItem {
  id: string;
  name: string;
  route: string;
  icon?: string;
  children?: MenuItem[];
  expanded?: boolean;
  claimCode?: string; // 權限代碼
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <!-- 標頭：首頁按鈕 + 收合按鈕 -->
      <div class="sidebar-header">
        <button class="home-btn" (click)="goToHome()" *ngIf="!isCollapsed" title="回到首頁">
          <span class="label">首頁</span>
        </button>
        <button class="toggle-btn" (click)="toggleSidebar()" [title]="isCollapsed ? '展開側邊欄' : '收合側邊欄'">
          <span>{{ isCollapsed ? '▶' : '◀' }}</span>
        </button>
      </div>

      <!-- 選單列表 -->
      <nav class="menu" *ngIf="!isCollapsed">
        <ul class="menu-list">
          <li *ngFor="let item of menuItems()" class="menu-item">
            <!-- 父選單 -->
            <div class="menu-label" (click)="toggleMenu(item)">
              <span class="icon" *ngIf="item.icon">{{ item.icon }}</span>
              <span class="label">{{ item.name }}</span>
              <span class="arrow" *ngIf="item.children">
                {{ item.expanded ? '▼' : '▶' }}
              </span>
            </div>

            <!-- 子選單 -->
            <ul *ngIf="item.children && item.expanded" class="submenu">
              <li *ngFor="let child of item.children" class="submenu-item">
                <!-- 如果還有子選單 -->
                <div *ngIf="child.children" class="submenu-label" (click)="toggleMenu(child)">
                  <span>{{ child.name }}</span>
                  <span class="arrow">{{ child.expanded ? '▼' : '▶' }}</span>
                </div>
                
                <!-- 如果沒有子選單，直接點擊開啟分頁 -->
                <div *ngIf="!child.children" class="submenu-label clickable" (click)="goToRoute(child)">
                  <span>{{ child.name }}</span>
                </div>

                <!-- 第三層選單 -->
                <ul *ngIf="child.children && child.expanded" class="submenu-level-3">
                  <li *ngFor="let subChild of child.children" 
                      class="submenu-item-level-3"
                      (click)="goToRoute(subChild)">
                    {{ subChild.name }}
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

    .sidebar-header {
      height: 50px;
      display: flex;
      align-items: center;
      background: #34495e;
      border-bottom: 1px solid #1a252f;
    }

    .home-btn {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
      padding: 0 15px;
    }

    .home-btn:hover {
      background: #3d566e;
    }

    .home-btn .icon {
      font-size: 18px;
    }

    .toggle-btn {
      width: 50px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      border-left: 1px solid #1a252f;
      color: white;
      cursor: pointer;
      font-size: 18px;
      transition: background 0.2s;
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
  private allRouteMap = buildAllClaimRouteMap();

  // UI DataSource => 根據權限動態建構
  menuItems = computed(() => {
    const claimTree = this.permissionService.userClaimTree();
    const routeTree = this.filterRoutePermissions(claimTree);
    return this.convertToMenuItems(routeTree);
  });

  constructor(
    private tabService: TabService,
    private permissionService: PermissionService,
    private router: Router
  ) { }

  /**
   * 拿 ROUTE 類型的權限(遞迴)
   */
  private filterRoutePermissions(nodes: ClaimTreeNode[]): ClaimTreeNode[] {
    return nodes
      .filter(node => node.type === ClaimType.ROUTE)
      .map(node => ({
        ...node,
        children: node.children ? this.filterRoutePermissions(node.children) : []
      }));
  }

  /**
   * 將 ClaimTreeNode 轉換為 MenuItem (遞迴)
   */
  private convertToMenuItems(nodes: ClaimTreeNode[]): MenuItem[] {
    return nodes.map(node => {
      const route = this.allRouteMap[node.code as ClaimCode] || '#';

      return {
        id: node.id.toString(),
        name: node.name,
        route: route,
        claimCode: node.code,
        expanded: false,
        children: node.children && node.children.length > 0
          ? this.convertToMenuItems(node.children)
          : undefined
      };
    });
  }

  goToHome() {
    // 關閉所有分頁，返回首頁
    this.tabService.closeAllTabs();
  }

  goToRoute(item: MenuItem) {
    this.router.navigate([item.route]);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMenu(item: MenuItem) {
    item.expanded = !item.expanded;
  }
}
