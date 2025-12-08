import { Route } from '@angular/router';
import { ClaimCode } from '../models/claims';
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
    {
        path: 'basic-system/permission-list',
        claim: ClaimCode.BASIC_SYSTEM_PERMISSION,
        loadComponent: () => import('../../features/basic-system/permission-list/permission-list')
            .then(m => m.PermissionList),
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
    },

    // ========================================
    // 金流系統
    // ========================================
    {
        path: 'payment-system/payment-method',
        claim: ClaimCode.PAYMENT_SYSTEM_METHOD,
        loadComponent: () => import('../../features/payment-system/payment-method.component')
            .then(m => m.PaymentMethodComponent),
        reuseRoute: true
    },
    {
        path: 'payment-system/payment-integration',
        claim: ClaimCode.PAYMENT_SYSTEM_INTEGRATION,
        loadComponent: () => import('../../features/payment-system/payment-integration.component')
            .then(m => m.PaymentIntegrationComponent),
        reuseRoute: true
    },

    // ========================================
    // 路邊停車系統
    // ========================================
    {
        path: 'parking-system/order-management',
        claim: ClaimCode.PARKING_SYSTEM_ORDER,
        loadComponent: () => import('../../features/parking-system/order-management.component')
            .then(m => m.OrderManagementComponent),
        reuseRoute: true
    },
    {
        path: 'parking-system/report-analysis/void-report',
        claim: ClaimCode.PARKING_SYSTEM_REPORT_VOID,
        loadComponent: () => import('../../features/parking-system/report-analysis/void-report.component')
            .then(m => m.VoidReportComponent),
        reuseRoute: true
    },
    {
        path: 'parking-system/report-analysis/billing-detail',
        claim: ClaimCode.PARKING_SYSTEM_REPORT_BILLING,
        loadComponent: () => import('../../features/parking-system/report-analysis/billing-detail.component')
            .then(m => m.BillingDetailComponent),
        reuseRoute: true
    },
    {
        path: 'parking-system/report-analysis/upload-statistics',
        claim: ClaimCode.PARKING_SYSTEM_REPORT_UPLOAD,
        loadComponent: () => import('../../features/parking-system/report-analysis/upload-statistics.component')
            .then(m => m.UploadStatisticsComponent),
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
