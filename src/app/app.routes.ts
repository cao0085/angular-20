import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayoutComponent } from './core/layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { Unauthorized } from './pages/unauthorized/unauthorized';
import { ROUTE_CONFIGS, convertToRoutes } from './core/config/route.config';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'unauthorized',
        component: Unauthorized
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],  // 需要登入才能訪問
        children: convertToRoutes(ROUTE_CONFIGS)  // 使用集中管理的路由配置
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];
