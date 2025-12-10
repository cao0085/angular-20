import { Injectable, signal } from '@angular/core';

/**
 * 全域 Loading Service
 * 提供全畫面遮罩的 loading 效果
 */
@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loadingSignal = signal<boolean>(false);
    public isLoading = this.loadingSignal.asReadonly();

    private showTimestamp: number | null = null;
    private hideTimeout: any = null;
    private readonly MIN_DISPLAY_TIME = 500; // 最少顯示 0.5 秒

    /**
     * 顯示 loading 遮罩
     */
    show(): void {
        // 清除之前的隱藏計時器（如果有）
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }

        this.showTimestamp = Date.now();
        this.loadingSignal.set(true);
    }

    /**
     * 隱藏 loading 遮罩
     * 確保至少顯示 MIN_DISPLAY_TIME 毫秒，但不阻塞流程
     */
    hide(): void {
        if (!this.showTimestamp) {
            this.loadingSignal.set(false);
            return;
        }

        const elapsedTime = Date.now() - this.showTimestamp;
        const remainingTime = this.MIN_DISPLAY_TIME - elapsedTime;

        if (remainingTime > 0) {
            this.hideTimeout = setTimeout(() => {
                this.loadingSignal.set(false);
                this.showTimestamp = null;
                this.hideTimeout = null;
            }, remainingTime);
        } else {
            this.loadingSignal.set(false);
            this.showTimestamp = null;
        }
    }
}
