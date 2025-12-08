import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';

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
 * 權限守衛 - 檢查使用者是否有指定的權限
 * 使用方式：
 * {
 *   path: 'some-path',
 *   component: SomeComponent,
 *   canActivate: [authGuard, permissionGuard],
 *   data: { requiredClaim: 'BASIC_SYSTEM_LOG' }
 * }
 */
export const permissionGuard: CanActivateFn = (route, state) => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);

    // 從 route data 取得所需的權限代碼
    const requiredClaim = route.data['requiredClaim'] as string;

    // 如果沒有設定權限要求，直接允許訪問
    if (!requiredClaim) {
        console.warn('路由未設定 requiredClaim，建議設定權限要求');
        return true;
    }

    // 檢查使用者是否有所需權限
    if (permissionService.hasClaim(requiredClaim)) {
        return true;
    }

    // 沒有權限，導向未授權頁面
    console.log(`沒有權限訪問此頁面，需要權限: ${requiredClaim}`);
    return router.createUrlTree(['/unauthorized']);
};

/**
 * 多重權限守衛 - 檢查使用者是否有任一權限（OR 邏輯）
 * 使用方式：
 * {
 *   path: 'some-path',
 *   component: SomeComponent,
 *   canActivate: [authGuard, anyPermissionGuard],
 *   data: { requiredClaims: ['CLAIM_A', 'CLAIM_B'] }
 * }
 */
// export const anyPermissionGuard: CanActivateFn = (route, state) => {
//     const permissionService = inject(PermissionService);
//     const router = inject(Router);

//     const requiredClaims = route.data['requiredClaims'] as string[];

//     if (!requiredClaims || requiredClaims.length === 0) {
//         console.warn('路由未設定 requiredClaims');
//         return true;
//     }

//     // 檢查是否有任一權限（OR）
//     const hasPermission = requiredClaims.some(claim =>
//         permissionService.hasClaim(claim)
//     );

//     if (hasPermission) {
//         return true;
//     }

//     console.log(`沒有權限訪問此頁面，需要以下任一權限: ${requiredClaims.join(', ')}`);
//     return router.createUrlTree(['/unauthorized']);
// };

/**
 * 全部權限守衛 - 檢查使用者是否同時擁有所有權限（AND 邏輯）
 * 使用方式：
 * {
 *   path: 'some-path',
 *   component: SomeComponent,
 *   canActivate: [authGuard, allPermissionsGuard],
 *   data: { requiredClaims: ['CLAIM_A', 'CLAIM_B'] }
 * }
 */
// export const allPermissionsGuard: CanActivateFn = (route, state) => {
//     const permissionService = inject(PermissionService);
//     const router = inject(Router);

//     const requiredClaims = route.data['requiredClaims'] as string[];

//     if (!requiredClaims || requiredClaims.length === 0) {
//         console.warn('路由未設定 requiredClaims');
//         return true;
//     }

//     // 檢查是否同時擁有所有權限（AND）
//     const hasAllPermissions = requiredClaims.every(claim =>
//         permissionService.hasClaim(claim)
//     );

//     if (hasAllPermissions) {
//         return true;
//     }

//     console.log(`沒有權限訪問此頁面，需要以下所有權限: ${requiredClaims.join(', ')}`);
//     return router.createUrlTree(['/unauthorized']);
// };
