import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../models/roles';
import usersData from '../../../mockDB/user.json';

export interface User {
    id: string;
    username: string;
    role: UserRole;  // 改為單一角色
    displayName: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // 使用 signal 管理登入狀態
    private currentUser = signal<User | null>(null);
    private token = signal<string | null>(null);

    // 公開的唯讀 signal
    readonly user$ = this.currentUser.asReadonly();
    readonly isLoggedIn$ = this.currentUser.asReadonly();

    constructor(private router: Router) {
        // 從 localStorage 恢復登入狀態
        this.restoreSession();
    }

    /**
     * 檢查是否已登入
     */
    isAuthenticated(): boolean {
        return this.currentUser() !== null && this.token() !== null;
    }

    /**
     * 檢查是否有指定角色
     */
    hasRole(role: UserRole): boolean {
        const user = this.currentUser();
        return user ? user.role === role : false;
    }

    /**
     * 檢查是否有任一角色（支援多個角色檢查）
     */
    hasAnyRole(roles: UserRole[]): boolean {
        const user = this.currentUser();
        return user ? roles.includes(user.role) : false;
    }

    /**
     * 檢查是否為系統人員（admin 有所有權限）
     */
    isAdmin(): boolean {
        return this.hasRole(UserRole.ADMIN);
    }

    /**
     * 登入
     * @returns { success: boolean, message?: string }
     */
    login(username: string, password: string): { success: boolean; message?: string } {
        // 從 user.json 中查找使用者 模擬 API
        const foundUser = usersData.users.find(
            u => u.username === username && u.password === password
        );

        if (!foundUser) {
            return {
                success: false,
                message: '帳號或密碼錯誤'
            };
        }

        // 將 JSON 中的 role 轉換為 UserRole enum
        const roleMap: Record<string, UserRole> = {
            'admin': UserRole.ADMIN,
            'site_manager': UserRole.SITE_MANAGER,
            'site_director': UserRole.SITE_DIRECTOR,
            'user': UserRole.SITE_MANAGER // 預設將 'user' 映射為場地管理員
        };

        const userRole = roleMap[foundUser.role] || UserRole.SITE_MANAGER;

        const user: User = {
            id: foundUser.id.toString(),
            username: foundUser.username,
            role: userRole,
            displayName: this.getRoleDisplayName(userRole)
        };

        const token = foundUser.token;

        // 更新狀態
        this.currentUser.set(user);
        this.token.set(token);

        // 儲存到 localStorage
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        return {
            success: true
        };
    }

    /**
     * 取得角色顯示名稱
     */
    private getRoleDisplayName(role: UserRole): string {
        const displayNames: Record<UserRole, string> = {
            [UserRole.ADMIN]: '系統人員',
            [UserRole.SITE_MANAGER]: '場地管理員',
            [UserRole.SITE_DIRECTOR]: '場地經理'
        };
        return displayNames[role];
    }

    /**
     * 登出
     */
    logout() {
        this.currentUser.set(null);
        this.token.set(null);

        // 清除 localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // 導向登入頁
        this.router.navigate(['/login']);
    }

    /**
     * 從 localStorage 恢復登入狀態
     */
    private restoreSession() {
        const userJson = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (userJson && token) {
            try {
                const user = JSON.parse(userJson) as User;
                this.currentUser.set(user);
                this.token.set(token);
            } catch (error) {
                console.error('恢復登入狀態失敗', error);
                this.logout();
            }
        }
    }

    /**
     * 取得當前使用者
     */
    getCurrentUser(): User | null {
        return this.currentUser();
    }

    /**
     * 取得 Token
     */
    getToken(): string | null {
        return this.token();
    }
}
