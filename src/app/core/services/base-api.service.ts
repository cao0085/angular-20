import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// 定義 domain 類型
export type DomainKey = keyof BaseApiService['domains'];

@Injectable({
    providedIn: 'root'
})
export class BaseApiService {
    // 固定的兩個 domain
    protected readonly domains = {
        DOMAIN_1: 'https://api-1.example.com',
        DOMAIN_2: 'https://api-2.example.com'
    } as const;

    constructor(protected http: HttpClient) { }

    /**
     * GET 請求
     * @param domain - 選擇使用的 domain（1 或 2）
     * @param url - API 端點
     * @param params - 查詢參數（可選）
     */
    protected get<T>(
        domain: DomainKey,
        url: string,
        params?: HttpParams
    ): Observable<T> {
        const apiUrl = this.domains[domain];
        return this.http.get<T>(`${apiUrl}${url}`, { params }).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * POST 請求
     * @param domain - 選擇使用的 domain（1 或 2）
     * @param url - API 端點
     * @param data - 請求數據
     */
    protected post<T>(
        domain: DomainKey,
        url: string,
        data: any
    ): Observable<T> {
        const apiUrl = this.domains[domain];
        return this.http.post<T>(`${apiUrl}${url}`, data).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * PUT 請求
     * @param domain - 選擇使用的 domain（1 或 2）
     * @param url - API 端點
     * @param data - 請求數據
     */
    protected put<T>(
        domain: DomainKey,
        url: string,
        data: any
    ): Observable<T> {
        const apiUrl = this.domains[domain];
        return this.http.put<T>(`${apiUrl}${url}`, data).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * DELETE 請求
     * @param domain - 選擇使用的 domain（1 或 2）
     * @param url - API 端點
     */
    protected delete<T>(
        domain: DomainKey,
        url: string
    ): Observable<T> {
        const apiUrl = this.domains[domain];
        return this.http.delete<T>(`${apiUrl}${url}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * PATCH 請求
     * @param domain - 選擇使用的 domain（1 或 2）
     * @param url - API 端點
     * @param data - 請求數據
     */
    protected patch<T>(
        domain: DomainKey,
        url: string,
        data: any
    ): Observable<T> {
        const apiUrl = this.domains[domain];
        return this.http.patch<T>(`${apiUrl}${url}`, data).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * 錯誤處理
     */
    private handleError(error: HttpErrorResponse) {
        let errorMessage = '發生錯誤';

        if (error.error instanceof ErrorEvent) {
            // 客戶端錯誤
            errorMessage = `錯誤: ${error.error.message}`;
        } else {
            // 服務器錯誤
            errorMessage = `錯誤代碼: ${error.status}, 訊息: ${error.message}`;
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}