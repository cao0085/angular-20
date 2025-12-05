import { Injectable, signal } from '@angular/core';
import { Router, RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from '../strategies/route-reuse.strategy';

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

    constructor(
        private router: Router,
        private routeReuseStrategy: RouteReuseStrategy
    ) { }

    /**
     * 開啟新分頁
     */
    openTab(tab: Tab) {
        const currentTabs = this.tabs();  // 使用 () 取得當前值
        const existingTab = currentTabs.find(t => t.id === tab.id);

        if (existingTab) {
            // 如果分頁已存在，切換到該分頁
            this.setActiveTab(tab.id);
            this.router.navigate([tab.route]);
        } else {
            // 新增分頁 - 使用 set() 更新
            this.tabs.set([...currentTabs, tab]);
            this.setActiveTab(tab.id);
            this.router.navigate([tab.route]);
        }
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
