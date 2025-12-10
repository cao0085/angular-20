import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageStore } from '../store/storage.store';

/**
 * Auth Interceptor
 * 自動在 HTTP 請求中加上 Authorization Token
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageStore = inject(StorageStore);

  // 從 localStorage 取得 token（可以改成其他來源）
  const token = storageStore.getLocal<string>('token');

  // 如果有 token，複製請求並加上 Authorization header
  if (token) {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // 繼續處理請求
  return next(req);
};
