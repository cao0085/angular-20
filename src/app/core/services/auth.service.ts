import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import userPermissionData from '../../../mockDB/userPermission.json';

export interface User {
    id: number;
    username: string;
    email: string;
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
     * 登入
     * @returns { success: boolean, message?: string }
     */
    login(username: string, password: string): { success: boolean; message?: string } {
        // 從 userPermission.json 中查找使用者
        const foundUser = userPermissionData.users.find(
            u => u.username === username && u.password === password
        );

        if (!foundUser) {
            return {
                success: false,
                message: '帳號或密碼錯誤'
            };
        }

        const user: User = {
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email
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
