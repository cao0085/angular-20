import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/roles';

/**
 * 路由守衛 - 檢查使用者是否已登入
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // 檢查是否已登入
    if (authService.isAuthenticated()) {
        return true;  // 允許訪問
    }

    // 未登入，導向登入頁
    console.log('未登入，導向登入頁');
    return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }  // 記住原本要去的頁面
    });
};

/**
 * 角色守衛 - 檢查使用者角色權限
 */
export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const requiredRoles = route.data['roles'] as UserRole[];

    if (!requiredRoles || requiredRoles.length === 0) {
        return true;  // 沒有角色限制
    }

    // 系統人員有所有權限
    if (authService.isAdmin()) {
        return true;
    }

    // 檢查使用者是否有所需角色
    if (authService.hasAnyRole(requiredRoles)) {
        return true;
    }

    // 沒有權限，導向登入頁或錯誤頁
    console.log('沒有權限訪問此頁面');
    return router.createUrlTree(['/login']);
};
