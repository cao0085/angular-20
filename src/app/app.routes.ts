import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayoutComponent } from './core/layout/main-layout.component';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { ModulePermissions, ModuleId } from './core/models/roles';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'main',
        component: MainLayoutComponent,
        canActivate: [authGuard],  // 所有 /main 路由都需要登入
        children: [
            // ========================================
            // 基礎系統 - 場地管理員 + 系統人員
            // ========================================
            {
                path: 'basic-system/log',
                loadComponent: () => import('./features/basic-system/system-log.component')
                    .then(m => m.SystemLogComponent),
                canActivate: [roleGuard],
                data: {
                    roles: ModulePermissions[ModuleId.BASIC_SYSTEM],
                    reuseRoute: true  // 啟用路由重用
                }
            },
            {
                path: 'basic-system/directory',
                loadComponent: () => import('./features/basic-system/system-directory.component')
                    .then(m => m.SystemDirectoryComponent),
                canActivate: [roleGuard],
                data: {
                    roles: ModulePermissions[ModuleId.BASIC_SYSTEM],
                    reuseRoute: true  // 啟用路由重用
                }
            },

            // ========================================
            // 外部系統 - 場地經理 + 系統人員
            // ========================================
            {
                path: 'external-system/vendor-data',
                loadComponent: () => import('./features/external-system/vendor-data.component')
                    .then(m => m.VendorDataComponent),
                canActivate: [roleGuard],
                data: {
                    roles: ModulePermissions[ModuleId.EXTERNAL_SYSTEM],
                    reuseRoute: true
                }
            },
            {
                path: 'external-system/vendor-integration',
                loadComponent: () => import('./features/external-system/vendor-integration.component')
                    .then(m => m.VendorIntegrationComponent),
                canActivate: [roleGuard],
                data: {
                    roles: ModulePermissions[ModuleId.EXTERNAL_SYSTEM],
                    reuseRoute: true
                }
            },

            // ========================================
            // 金流系統 - 假設系統人員
            // ========================================
            {
                path: 'payment-system/payment-method',
                loadComponent: () => import('./features/payment-system/payment-method.component')
                    .then(m => m.PaymentMethodComponent),
                canActivate: [roleGuard],
                data: {
                    roles: ModulePermissions[ModuleId.PAYMENT_SYSTEM],
                    reuseRoute: true
                }
            },
            {
                path: 'payment-system/payment-integration',
                loadComponent: () => import('./features/payment-system/payment-integration.component')
                    .then(m => m.PaymentIntegrationComponent),
                canActivate: [roleGuard],
                data: {
                    roles: ModulePermissions[ModuleId.PAYMENT_SYSTEM],
                    reuseRoute: true
                }
            },

            // ========================================
            // 路邊停車系統 - 所有登入使用者
            // ========================================
            {
                path: 'parking-system/order-management',
                loadComponent: () => import('./features/parking-system/order-management.component')
                    .then(m => m.OrderManagementComponent),
                canActivate: [roleGuard],
                data: {
                    roles: ModulePermissions[ModuleId.PARKING_SYSTEM],
                    reuseRoute: true
                }
            },
            {
                path: 'parking-system/report-analysis/void-report',
                loadComponent: () => import('./features/parking-system/report-analysis/void-report.component')
                    .then(m => m.VoidReportComponent),
                canActivate: [roleGuard],
                data: {
                    roles: ModulePermissions[ModuleId.PARKING_SYSTEM],
                    reuseRoute: true
                }
            },
            {
                path: 'parking-system/report-analysis/billing-detail',
                loadComponent: () => import('./features/parking-system/report-analysis/billing-detail.component')
                    .then(m => m.BillingDetailComponent),
                canActivate: [roleGuard],
                data: {
                    roles: ModulePermissions[ModuleId.PARKING_SYSTEM],
                    reuseRoute: true
                }
            },
            {
                path: 'parking-system/report-analysis/upload-statistics',
                loadComponent: () => import('./features/parking-system/report-analysis/upload-statistics.component')
                    .then(m => m.UploadStatisticsComponent),
                canActivate: [roleGuard],
                data: {
                    roles: ModulePermissions[ModuleId.PARKING_SYSTEM],
                    reuseRoute: true
                }
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];
