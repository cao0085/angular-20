import { Route } from '@angular/router';
// import { ClaimCode } from '../constants/claims';
import { permissionGuard } from '../guards/auth.guard';

/**
 * 權限代碼枚舉
 * 對應 userPermission.json 中的 claims.code
 */
export enum ClaimCode {
    // ========================================
    // Basic System
    // ========================================
    BASIC_SYSTEM_MODULE = 'BASIC_SYSTEM_MODULE',
    BASIC_SYSTEM_LOG = 'BASIC_SYSTEM_LOG',
    BASIC_SYSTEM_DIRECTORY = 'BASIC_SYSTEM_DIRECTORY',

    // ========================================
    // External System
    // ========================================
    EXTERNAL_SYSTEM_MODULE = 'EXTERNAL_SYSTEM_MODULE',
    EXTERNAL_SYSTEM_VENDOR_DATA = 'EXTERNAL_SYSTEM_VENDOR_DATA',
    EXTERNAL_SYSTEM_VENDOR_INTEGRATION = 'EXTERNAL_SYSTEM_VENDOR_INTEGRATION',
}

export interface RouteConfig {
    path: string;
    claim: ClaimCode;
    loadComponent: () => Promise<any>;
    reuseRoute?: boolean;
}

/**
 * 集中管理的路由配置
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