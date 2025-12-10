import { Injectable, resource, Signal } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * 基礎 API Service
 */
@Injectable({
    providedIn: 'root'
})
export class BaseApiService {
    protected baseUrl = '';

    constructor(protected http: HttpClient) { }

    /**
     * 構建完整 URL
     * 如果有 baseUrl 則自動拼接，否則直接使用傳入的 url
     */
    protected buildUrl(path: string): string {
        if (!this.baseUrl) {
            return path;
        }
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        return `${this.baseUrl}${normalizedPath}`;
    }

    // ========================================
    // HttpResource - 只用於 GET（讀取數據，自動響應變化）
    // ========================================

    /**
     * 創建 GET Resource - 自動追蹤數據變化
     * @param url - API 端點 (使用 Signal)
     * @param params - 查詢參數（可選，使用 Signal）
     *
     * 使用範例：
     * const userId = signal('1');
     * const userResource = this.apiService.createGetResource<User>(
     *   computed(() => `/users/${userId()}`)
     * );
     */
    createGetResource<T>(
        url: Signal<string>,
        params?: Signal<Record<string, string>>
    ) {
        return resource({
            loader: async () => {
                const currentUrl = url();
                const currentParams = params?.();
                const queryString = currentParams
                    ? '?' + new URLSearchParams(currentParams).toString()
                    : '';

                const fullUrl = this.buildUrl(currentUrl);
                const response = await fetch(`${fullUrl}${queryString}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    await this.handleFetchError(response);
                }

                return await response.json() as T;
            }
        });
    }

    // ========================================
    // HttpClient - 用於所有操作（GET/POST/PUT/PATCH/DELETE）
    // ========================================

    /**
     * GET 請求 - 一次性數據獲取
     * @param url - API 端點（相對路徑）
     * @param params - 查詢參數（可選）
     */
    get<T>(url: string, params?: HttpParams): Observable<T> {
        const fullUrl = this.buildUrl(url);
        return this.http.get<T>(fullUrl, { params }).pipe(
            catchError(error => this.handleHttpClientError(error))
        );
    }

    /**
     * POST 請求 - 新增數據
     * @param url - API 端點（相對路徑）
     * @param data - 請求數據
     */
    post<T>(url: string, data: any): Observable<T> {
        const fullUrl = this.buildUrl(url);
        return this.http.post<T>(fullUrl, data).pipe(
            catchError(error => this.handleHttpClientError(error))
        );
    }

    /**
     * PUT 請求 - 完整更新
     * @param url - API 端點（相對路徑）
     * @param data - 請求數據
     */
    put<T>(url: string, data: any): Observable<T> {
        const fullUrl = this.buildUrl(url);
        return this.http.put<T>(fullUrl, data).pipe(
            catchError(error => this.handleHttpClientError(error))
        );
    }

    /**
     * PATCH 請求 - 部分更新
     * @param url - API 端點（相對路徑）
     * @param data - 請求數據
     */
    patch<T>(url: string, data: any): Observable<T> {
        const fullUrl = this.buildUrl(url);
        return this.http.patch<T>(fullUrl, data).pipe(
            catchError(error => this.handleHttpClientError(error))
        );
    }

    /**
     * DELETE 請求 - 刪除數據
     * @param url - API 端點（相對路徑）
     */
    delete<T>(url: string): Observable<T> {
        const fullUrl = this.buildUrl(url);
        return this.http.delete<T>(fullUrl).pipe(
            catchError(error => this.handleHttpClientError(error))
        );
    }

    // ========================================
    // 錯誤處理 - 只處理通用錯誤
    // ========================================

    /**
     * 處理 Fetch API 錯誤（用於 HttpResource）
     */
    private async handleFetchError(response: Response): Promise<never> {
        const status = response.status;

        // 處理通用錯誤
        this.handleGlobalError(status);

        // 拋出錯誤供外部捕獲
        throw new Error(`HTTP Error: ${status} - ${response.statusText}`);
    }

    /**
     * 處理 HttpClient 錯誤
     */
    private handleHttpClientError(error: HttpErrorResponse): Observable<never> {
        // 處理通用錯誤
        this.handleGlobalError(error.status);

        // 拋出錯誤供外部捕獲
        console.error('API Error:', error);
        return throwError(() => error);
    }

    /**
     * 通用錯誤處理
     * 只處理全局性錯誤：認證、權限、服務器錯誤、網絡錯誤
     */
    private handleGlobalError(status: number): void {
        switch (status) {
            case 401:
                console.error('[Global Error] 未授權：登入已過期，請重新登入');
                // TODO: 導向登入頁
                // this.router.navigate(['/login']);
                break;
            case 403:
                console.error('[Global Error] 無權限：您沒有權限執行此操作');
                // TODO: 顯示無權限提示
                break;
            case 500:
            case 502:
            case 503:
                console.error('[Global Error] 服務器錯誤：服務器發生錯誤，請稍後再試');
                // TODO: 顯示服務器錯誤提示
                break;
            case 0:
                console.error('[Global Error] 網絡錯誤：網絡連接失敗，請檢查網絡');
                // TODO: 顯示網絡錯誤提示
                break;
            // 其他錯誤（400, 404, 409 等）不在這裡處理，交給外部業務邏輯
        }
    }
}

// ========================================
// Domain Services - 預設 Domain 配置
// ========================================

/**
 * Domain 1 API Service
 * 自動帶 Domain 1 的 base URL（從環境配置讀取）
 */
@Injectable({
    providedIn: 'root'
})
export class NpcsApiService extends BaseApiService {
    protected override baseUrl = environment.apiUrls.npcsDomain;
}

/**
 * Domain 2 API Service
 * 自動帶 Domain 2 的 base URL（從環境配置讀取）
 */
@Injectable({
    providedIn: 'root'
})
export class Domain2ApiService extends BaseApiService {
    protected override baseUrl = environment.apiUrls.domain2;
}

/**
 * Domain 3 API Service
 * 自動帶 Domain 3 的 base URL（從環境配置讀取）
 */
@Injectable({
    providedIn: 'root'
})
export class Domain3ApiService extends BaseApiService {
    protected override baseUrl = environment.apiUrls.domain3;
}

/**
 * Domain 4 API Service
 * 自動帶 Domain 4 的 base URL（從環境配置讀取）
 */
@Injectable({
    providedIn: 'root'
})
export class Domain4ApiService extends BaseApiService {
    protected override baseUrl = environment.apiUrls.domain4;
}