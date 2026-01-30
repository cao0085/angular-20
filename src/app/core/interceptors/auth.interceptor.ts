import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Auth Interceptor
 * 自動在 HTTP 請求中加上 Authorization Token
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // 從 localStorage 取得 token（可以改成其他來源）
  const token = localStorage.getItem('token');
  
  if (token) {
    req = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  // 繼續處理請求
  return next(req);

  // 也可以在這統一處理 404 Error - refreash token 等
};
