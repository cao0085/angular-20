import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

/**
 * 自定義路由重用策略
 * 用於保留分頁系統中的組件狀態
 */
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
    /**
     * 儲存已分離的路由組件
     * key: 路由路徑
     * value: 組件快照（包含狀態）
     */
    private handlers: Map<string, DetachedRouteHandle> = new Map();

    /**
     * 標記準備要被銷毀的路由路徑
     * 用於處理「關閉當前分頁」的情況，防止路由在導航離開時被再次保存
     */
    private safeToDestroy = new Set<string>();

    /**
     * 決定是否應該分離（保存）這個路由
     * @param route 當前路由快照
     * @returns true = 保存組件, false = 銷毀組件
     */
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getRouteKey(route);

        // 如果該路徑被標記為要銷毀（即正在關閉分頁）
        if (this.safeToDestroy.has(path)) {
            this.safeToDestroy.delete(path);
            console.log(`[RouteReuse] 路由標記為銷毀，不進行保存: ${path}`);
            return false;
        }

        // 只保存有 data.reuseRoute 標記的路由
        return route.data['reuseRoute'] === true;
    }

    /**
     * 儲存分離的路由組件
     * @param route 路由快照
     * @param handle 組件快照（包含 DOM、狀態等）
     */
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        const path = this.getRouteKey(route);

        // 再次檢查是否被標記為銷毀（雙重保險）
        if (this.safeToDestroy.has(path)) {
            this.safeToDestroy.delete(path);
            return;
        }

        if (handle) {
            this.handlers.set(path, handle);
            console.log(`[RouteReuse] 保存路由: ${path}`);
        }
    }

    /**
     * 決定是否應該重新附加（恢復）之前保存的路由
     * @param route 路由快照
     * @returns true = 使用保存的組件, false = 創建新組件
     */
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        const path = this.getRouteKey(route);
        const hasStored = this.handlers.has(path);

        if (hasStored) {
            console.log(`[RouteReuse] 恢復路由: ${path}`);
        }

        return hasStored;
    }

    /**
     * 取回之前保存的路由組件
     * @param route 路由快照
     * @returns 保存的組件快照
     */
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        const path = this.getRouteKey(route);
        return this.handlers.get(path) || null;
    }

    /**
     * 決定是否應該重用路由
     * @param future 即將進入的路由
     * @param curr 當前路由
     * @returns true = 重用, false = 不重用
     */
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return future.routeConfig === curr.routeConfig;
    }

    /**
     * 處理分頁關閉的邏輯
     * @param url 完整的路由路徑 (e.g. /main/basic-system/log)
     */
    close(url: string): void {
        // 確保格式一致（移除開頭 slash）
        const key = url.startsWith('/') ? url.substring(1) : url;

        console.log(`[RouteReuse] 嘗試關閉路由: ${key}`);

        // 1. 如果該路由目前在背景緩存中，直接移除並銷毀
        if (this.handlers.has(key)) {
            const handle = this.handlers.get(key);
            this.handlers.delete(key);

            // 嘗試手動銷毀組件以釋放資源
            if (handle && (handle as any).componentRef) {
                (handle as any).componentRef.destroy();
            }
            console.log(`[RouteReuse] 已清除緩存並銷毀組件: ${key}`);
        }

        // 2. 標記該路徑為待銷毀
        // 這樣如果它是「當前分頁」，在導航離開觸發 shouldDetach 時會回傳 false
        this.safeToDestroy.add(key);
    }

    /**
     * 生成路由的唯一鍵值
     * @param route 路由快照
     * @returns 路由鍵值
     */
    private getRouteKey(route: ActivatedRouteSnapshot): string {
        return route.pathFromRoot
            .map(r => r.url.map(segment => segment.path).join('/'))
            .filter(path => path)
            .join('/');
    }

    /**
     * 清除所有保存的路由
     */
    clearAll(): void {
        this.handlers.forEach(handle => {
            if (handle && (handle as any).componentRef) {
                (handle as any).componentRef.destroy();
            }
        });
        this.handlers.clear();
        this.safeToDestroy.clear();
        console.log('[RouteReuse] 清除所有保存的路由');
    }

    /**
     * 清除特定路由（舊版相容）
     */
    clear(path: string): void {
        this.close(path);
    }
}
