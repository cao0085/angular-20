import { Route } from '@angular/router';
import { ClaimCode } from '../constants/claims';
import { permissionGuard } from '../guards/auth.guard';

/**
 * 路由配置介面
 */
export interface RouteConfig {
    path: string;
    claim: ClaimCode;
    loadComponent: () => Promise<any>;
    reuseRoute?: boolean;
}

/**
 * 集中管理的路由配置
 * 同時定義路由路徑、權限、和元件
 */
export const ROUTE_CONFIGS: RouteConfig[] = [
    // ========================================
    // 基礎系統
    // ========================================
    {
        path: 'basic-system/log',
        claim: ClaimCode.BASIC_SYSTEM_LOG,
        loadComponent: () => import('../../features/basic-system/system-log.component')
            .then(m => m.SystemLogComponent),
        reuseRoute: true
    },
    {
        path: 'basic-system/directory',
        claim: ClaimCode.BASIC_SYSTEM_DIRECTORY,
        loadComponent: () => import('../../features/basic-system/system-directory.component')
            .then(m => m.SystemDirectoryComponent),
        reuseRoute: true
    },

    // ========================================
    // 外部系統
    // ========================================
    {
        path: 'external-system/vendor-data',
        claim: ClaimCode.EXTERNAL_SYSTEM_VENDOR_DATA,
        loadComponent: () => import('../../features/external-system/vendor-data.component')
            .then(m => m.VendorDataComponent),
        reuseRoute: true
    },
    {
        path: 'external-system/vendor-integration',
        claim: ClaimCode.EXTERNAL_SYSTEM_VENDOR_INTEGRATION,
        loadComponent: () => import('../../features/external-system/vendor-integration.component')
            .then(m => m.VendorIntegrationComponent),
        reuseRoute: true
    }
];

/**
 * 將 RouteConfig 轉換為 Angular Route
 */
export function convertToRoute(config: RouteConfig): Route {
    return {
        path: config.path,
        loadComponent: config.loadComponent,
        canActivate: [permissionGuard],
        data: {
            requiredClaim: config.claim,
            reuseRoute: config.reuseRoute ?? true
        }
    };
}

/**
 * 將所有 RouteConfig 轉換為 Angular Routes
 */
export function convertToRoutes(configs: RouteConfig[]): Route[] {
    return configs.map(convertToRoute);
}

/**
 * 從 ROUTE_CONFIGS 取出所有路徑設定，建立權限(ClaimCode)到路由(path)的映射表
 */
export function buildAllClaimRouteMap(): Partial<Record<ClaimCode, string>> {
    const map: Partial<Record<ClaimCode, string>> = {};

    ROUTE_CONFIGS.forEach(config => {
        map[config.claim] = `${config.path}`;
    });

    return map;
}
