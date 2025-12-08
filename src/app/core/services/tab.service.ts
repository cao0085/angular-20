import { Injectable, signal, inject } from '@angular/core';
import { Router, RouteReuseStrategy, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CustomRouteReuseStrategy } from '../strategies/route-reuse.strategy';
import { PermissionService } from './permission.service';
import { ROUTE_CONFIGS } from '../config/route.config';

export interface Tab {
    id: string;
    title: string;
    route: string;
    closable: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class TabService {
    // 使用 signal 替代 BehaviorSubject
    private tabs = signal<Tab[]>([]);
    private activeTabId = signal<string>('');

    // 公開的唯讀 signal
    readonly tabs$ = this.tabs.asReadonly();
    readonly activeTabId$ = this.activeTabId.asReadonly();

    private permissionService = inject(PermissionService);

    constructor(
        private router: Router,
        private routeReuseStrategy: RouteReuseStrategy
    ) {
        // 監聽路由變化，自動同步 tab
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
            this.syncTabFromRoute(event.urlAfterRedirects || event.url);
        });
    }

    /**
     * 根據當前路由自動創建/切換
     */
    private syncTabFromRoute(url: string) {
        // 移除查詢參數
        const cleanUrl = url.split('?')[0];

        // 如果是根路徑、登入頁或未授權頁，不創建 tab
        if (cleanUrl === '/' || cleanUrl === '' ||
            cleanUrl.startsWith('/login') ||
            cleanUrl.startsWith('/unauthorized')) {
            return;
        }

        // path 回推是哪個路由配置
        const path = cleanUrl.substring(1);
        const routeConfig = ROUTE_CONFIGS.find(config => config.path === path);

        if (!routeConfig) {
            console.warn(`找不到路由配置: ${path}`);
            // TODO: 未找到路由配置時，應該導向到 404 頁面
            return;
        }

        // 檢查該用戶有無訪問權限
        const claim = this.permissionService.userClaims()
            .find(c => c.code === routeConfig.claim);

        if (!claim) {
            console.warn(`找不到權限: ${routeConfig.claim}`);
            return;
        }

        // route 當作唯一 tab ID
        const newTab: Tab = {
            id: path.replace(/\//g, '-'),
            title: claim.name,
            route: cleanUrl,
            closable: true
        };

        this.openTab(newTab);
    }

    /**
     * 開啟新分頁
     */
    openTab(tab: Tab) {
        const currentTabs = this.tabs();
        const existingTab = currentTabs.find(t => t.id === tab.id);
        console.log(existingTab);
        if (existingTab) {
            this.setActiveTab(tab.id); // 若已存在，顯示該分頁
        } else {
            this.tabs.set([...currentTabs, tab]); // 若不存在，新增該分頁
            this.setActiveTab(tab.id);
        }
        this.router.navigate([tab.route]);
    }

    /**
     * 關閉分頁
     */
    closeTab(tabId: string) {
        const currentTabs = this.tabs();
        const index = currentTabs.findIndex(t => t.id === tabId);

        if (index === -1) return; // findIndex找不到會回傳-1

        const tabToRemove = currentTabs[index];
        this.clearTabCache(tabToRemove);

        const newTabs = currentTabs.filter(t => t.id !== tabId); // 排除目標的陣列
        this.tabs.set(newTabs); // 使用 set() 更新

        // 如果關閉的是當前分頁，切換到前一個或後一個
        if (this.activeTabId() === tabId && newTabs.length > 0) {
            const newActiveIndex = Math.max(0, index - 1);
            this.setActiveTab(newTabs[newActiveIndex].id);
            this.router.navigate([newTabs[newActiveIndex].route]);
        } else if (newTabs.length === 0) {
            this.activeTabId.set('');
            // 回到首頁
            this.router.navigate(['/']);
        }
    }

    /**
     * 設定當前分頁
     */
    setActiveTab(tabId: string) {
        this.activeTabId.set(tabId);
    }

    /**
     * 關閉所有分頁
     */
    closeAllTabs() {
        // 清除所有路由緩存
        if (this.routeReuseStrategy instanceof CustomRouteReuseStrategy) {
            this.routeReuseStrategy.clearAll();
        }
        this.tabs.set([]);
        this.activeTabId.set('');
        // 回到首頁
        this.router.navigate(['/']);
    }

    /**
     * 關閉其他分頁
     */
    closeOtherTabs(tabId: string) {
        const currentTabs = this.tabs();
        const keepTab = currentTabs.find(t => t.id === tabId);

        if (keepTab) {
            // 清除其他分頁的緩存
            const tabsToRemove = currentTabs.filter(t => t.id !== tabId);
            tabsToRemove.forEach(tab => this.clearTabCache(tab));

            this.tabs.set([keepTab]);
            this.setActiveTab(tabId);
        }
    }

    /**
     * 清除特定分頁的路由緩存
     */
    private clearTabCache(tab: Tab) {
        console.log(tab);
        if (this.routeReuseStrategy instanceof CustomRouteReuseStrategy) {
            // 移除開頭的 slash 以符合 strategy 中的 key 格式
            const path = tab.route.startsWith('/') ? tab.route.substring(1) : tab.route;
            this.routeReuseStrategy.clear(path);
        }
    }
}
