import { Injectable, signal, effect } from '@angular/core';

/**
 * Cookie 選項介面
 */
export interface CookieOptions {
  expires?: number | Date; // 過期時間（天數或 Date）
  path?: string;           // 路徑，預設 '/'
  domain?: string;         // 域名
  secure?: boolean;        // 僅 HTTPS
  sameSite?: 'Strict' | 'Lax' | 'None'; // SameSite 屬性
}

/**
 * 瀏覽器端 Storage Store (Signal 版本)
 * 統一管理 localStorage、sessionStorage 和 cookies
 */
@Injectable({
  providedIn: 'root'
})
export class StorageStore {
  // ========================================
  // LocalStorage 操作
  // ========================================

  /**
   * 設定 localStorage
   */
  setLocal<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`[StorageStore] setLocal error for key "${key}":`, error);
    }
  }

  /**
   * 取得 localStorage (泛型版本)
   */
  getLocal<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[StorageStore] getLocal error for key "${key}":`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * 移除 localStorage
   */
  removeLocal(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageStore] removeLocal error for key "${key}":`, error);
    }
  }

  /**
   * 清空 localStorage
   */
  clearLocal(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('[StorageStore] clearLocal error:', error);
    }
  }

  /**
   * 檢查 localStorage 是否存在某個 key
   */
  hasLocal(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * 取得所有 localStorage keys
   */
  getLocalKeys(): string[] {
    return Object.keys(localStorage);
  }

  // ========================================
  // SessionStorage 操作
  // ========================================

  /**
   * 設定 sessionStorage
   */
  setSession<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`[StorageStore] setSession error for key "${key}":`, error);
    }
  }

  /**
   * 取得 sessionStorage (泛型版本)
   */
  getSession<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[StorageStore] getSession error for key "${key}":`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * 移除 sessionStorage
   */
  removeSession(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`[StorageStore] removeSession error for key "${key}":`, error);
    }
  }

  /**
   * 清空 sessionStorage
   */
  clearSession(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('[StorageStore] clearSession error:', error);
    }
  }

  /**
   * 檢查 sessionStorage 是否存在某個 key
   */
  hasSession(key: string): boolean {
    return sessionStorage.getItem(key) !== null;
  }

  /**
   * 取得所有 sessionStorage keys
   */
  getSessionKeys(): string[] {
    return Object.keys(sessionStorage);
  }

  // ========================================
  // Cookie 操作
  // ========================================

  /**
   * 設定 cookie
   */
  setCookie(key: string, value: string, options?: CookieOptions): void {
    try {
      let cookieString = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

      if (options) {
        // 處理過期時間
        if (options.expires) {
          let expiresDate: Date;
          if (typeof options.expires === 'number') {
            expiresDate = new Date();
            expiresDate.setTime(expiresDate.getTime() + options.expires * 24 * 60 * 60 * 1000);
          } else {
            expiresDate = options.expires;
          }
          cookieString += `; expires=${expiresDate.toUTCString()}`;
        }

        // 路徑
        if (options.path) {
          cookieString += `; path=${options.path}`;
        } else {
          cookieString += `; path=/`; // 預設路徑
        }

        // 域名
        if (options.domain) {
          cookieString += `; domain=${options.domain}`;
        }

        // Secure
        if (options.secure) {
          cookieString += `; secure`;
        }

        // SameSite
        if (options.sameSite) {
          cookieString += `; samesite=${options.sameSite}`;
        }
      } else {
        cookieString += `; path=/`; // 預設路徑
      }

      document.cookie = cookieString;
    } catch (error) {
      console.error(`[StorageStore] setCookie error for key "${key}":`, error);
    }
  }

  /**
   * 取得 cookie
   */
  getCookie(key: string): string | null {
    try {
      const nameEQ = encodeURIComponent(key) + '=';
      const cookies = document.cookie.split(';');

      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(nameEQ)) {
          return decodeURIComponent(cookie.substring(nameEQ.length));
        }
      }
      return null;
    } catch (error) {
      console.error(`[StorageStore] getCookie error for key "${key}":`, error);
      return null;
    }
  }

  /**
   * 移除 cookie
   */
  removeCookie(key: string, options?: Pick<CookieOptions, 'path' | 'domain'>): void {
    try {
      this.setCookie(key, '', {
        expires: new Date(0),
        path: options?.path || '/',
        domain: options?.domain
      });
    } catch (error) {
      console.error(`[StorageStore] removeCookie error for key "${key}":`, error);
    }
  }

  /**
   * 檢查 cookie 是否存在
   */
  hasCookie(key: string): boolean {
    return this.getCookie(key) !== null;
  }

  /**
   * 取得所有 cookie keys
   */
  getCookieKeys(): string[] {
    try {
      return document.cookie
        .split(';')
        .map(cookie => cookie.trim().split('=')[0])
        .map(key => decodeURIComponent(key))
        .filter(key => key !== '');
    } catch (error) {
      console.error('[StorageStore] getCookieKeys error:', error);
      return [];
    }
  }

  /**
   * 清空所有 cookies（僅當前路徑和域名）
   */
  clearCookies(): void {
    const keys = this.getCookieKeys();
    keys.forEach(key => this.removeCookie(key));
  }

  // ========================================
  // 跨分頁同步監聽 (選用功能)
  // ========================================

  /**
   * 監聽 localStorage 的跨分頁變化
   * 回傳取消監聽的函式
   */
  onStorageChange(callback: (event: StorageEvent) => void): () => void {
    window.addEventListener('storage', callback);
    return () => window.removeEventListener('storage', callback);
  }
}
