import { Injectable, resource, Signal, WritableSignal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// 定義 domain 類型
export type DomainKey = keyof BaseApiHttpResourceService['domains'];

/**
 * 基於 Resource API 的 API Service
 * 使用 Angular 新的 Signal-based Resource API
 *
 * 主要特點：
 * 1. 使用 Signal 來管理狀態和數據
 * 2. 自動追蹤 loading、error、value 狀態
 * 3. 更簡潔的響應式編程模型
 * 4. 更好的 TypeScript 類型推導
 */
@Injectable({
    providedIn: 'root'
})
export class BaseApiHttpResourceService {
    // 固定的兩個 domain
    protected readonly domains = {
        DOMAIN_1: 'https://api-1.example.com',
        DOMAIN_2: 'https://api-2.example.com'
    } as const;

    /**
     * 創建 GET Resource
     * @param domain - 選擇使用的 domain
     * @param url - API 端點 (使用 Signal)
     * @param params - 查詢參數（可選，使用 Signal）
     *
     * 使用範例：
     * const userId = signal('1');
     * const userUrl = computed(() => `/users/${userId()}`);
     * const userResource = this.createGetResource('DOMAIN_1', userUrl);
     * // 在 template 中：userResource.value()
     * // 檢查狀態：userResource.isLoading()
     * // 當 userId 改變時，會自動重新請求
     */
    protected createGetResource<T>(
        domain: DomainKey,
        url: Signal<string> | WritableSignal<string>,
        params?: Signal<Record<string, string>> | WritableSignal<Record<string, string>>
    ) {
        const apiUrl = this.domains[domain];

        return resource({
            loader: async (loaderParams) => {
                try {
                    const currentUrl = url();
                    const currentParams = params?.();

                    const queryString = currentParams
                        ? '?' + new URLSearchParams(currentParams).toString()
                        : '';

                    const response = await fetch(`${apiUrl}${currentUrl}${queryString}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                    }

                    return await response.json() as T;
                } catch (error) {
                    this.handleError(error);
                    throw error;
                }
            }
        });
    }

    /**
     * 創建 POST Resource
     * @param domain - 選擇使用的 domain
     * @param url - API 端點 (使用 Signal)
     * @param data - 請求數據 (使用 Signal)
     *
     * 使用範例：
     * const createUserData = signal({ name: 'John', email: 'john@example.com' });
     * const createUserResource = this.createPostResource('DOMAIN_1', signal('/users'), createUserData);
     * // 更新數據會自動觸發請求
     * createUserData.set({ name: 'Jane', email: 'jane@example.com' });
     */
    protected createPostResource<T, D = any>(
        domain: DomainKey,
        url: Signal<string> | WritableSignal<string>,
        data: Signal<D> | WritableSignal<D>
    ) {
        const apiUrl = this.domains[domain];

        return resource({
            loader: async (loaderParams) => {
                try {
                    const currentUrl = url();
                    const currentData = data();

                    const response = await fetch(`${apiUrl}${currentUrl}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(currentData)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                    }

                    return await response.json() as T;
                } catch (error) {
                    this.handleError(error);
                    throw error;
                }
            }
        });
    }

    /**
     * 創建 PUT Resource
     * @param domain - 選擇使用的 domain
     * @param url - API 端點 (使用 Signal)
     * @param data - 請求數據 (使用 Signal)
     */
    protected createPutResource<T, D = any>(
        domain: DomainKey,
        url: Signal<string> | WritableSignal<string>,
        data: Signal<D> | WritableSignal<D>
    ) {
        const apiUrl = this.domains[domain];

        return resource({
            loader: async (loaderParams) => {
                try {
                    const currentUrl = url();
                    const currentData = data();

                    const response = await fetch(`${apiUrl}${currentUrl}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(currentData)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                    }

                    return await response.json() as T;
                } catch (error) {
                    this.handleError(error);
                    throw error;
                }
            }
        });
    }

    /**
     * 創建 DELETE Resource
     * @param domain - 選擇使用的 domain
     * @param url - API 端點 (使用 Signal)
     */
    protected createDeleteResource<T>(
        domain: DomainKey,
        url: Signal<string> | WritableSignal<string>
    ) {
        const apiUrl = this.domains[domain];

        return resource({
            loader: async (loaderParams) => {
                try {
                    const currentUrl = url();

                    const response = await fetch(`${apiUrl}${currentUrl}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                    }

                    return await response.json() as T;
                } catch (error) {
                    this.handleError(error);
                    throw error;
                }
            }
        });
    }

    /**
     * 創建 PATCH Resource
     * @param domain - 選擇使用的 domain
     * @param url - API 端點 (使用 Signal)
     * @param data - 請求數據 (使用 Signal)
     */
    protected createPatchResource<T, D = any>(
        domain: DomainKey,
        url: Signal<string> | WritableSignal<string>,
        data: Signal<D> | WritableSignal<D>
    ) {
        const apiUrl = this.domains[domain];

        return resource({
            loader: async (loaderParams) => {
                try {
                    const currentUrl = url();
                    const currentData = data();

                    const response = await fetch(`${apiUrl}${currentUrl}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(currentData)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
                    }

                    return await response.json() as T;
                } catch (error) {
                    this.handleError(error);
                    throw error;
                }
            }
        });
    }

    /**
     * 錯誤處理
     */
    private handleError(error: any): void {
        let errorMessage = '發生錯誤';

        if (error instanceof HttpErrorResponse) {
            if (error.error instanceof ErrorEvent) {
                // 客戶端錯誤
                errorMessage = `錯誤: ${error.error.message}`;
            } else {
                // 服務器錯誤
                errorMessage = `錯誤代碼: ${error.status}, 訊息: ${error.message}`;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error(errorMessage);
    }
}
