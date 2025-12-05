/**
 * 系統角色定義
 */
export enum UserRole {
    ADMIN = 'admin',              // 系統人員（無限制）
    SITE_MANAGER = 'site_manager', // 場地管理員
    SITE_DIRECTOR = 'site_director' // 場地經理
}

/**
 * 角色顯示名稱
 */
export const RoleDisplayNames: Record<UserRole, string> = {
    [UserRole.ADMIN]: '系統人員',
    [UserRole.SITE_MANAGER]: '場地管理員',
    [UserRole.SITE_DIRECTOR]: '場地經理'
};

/**
 * 功能模組 ID（用於 Sidebar 和路由）
 */
export enum ModuleId {
    BASIC_SYSTEM = 'BASIC_SYSTEM',
    EXTERNAL_SYSTEM = 'EXTERNAL_SYSTEM',
    PAYMENT_SYSTEM = 'PAYMENT_SYSTEM',
    PARKING_SYSTEM = 'PARKING_SYSTEM'
}

/**
 * 功能模組權限對照表
 * 集中管理所有功能的權限設定
 */
export const ModulePermissions: Record<ModuleId, readonly UserRole[]> = {
    // 基礎系統 - 只有場地管理員和系統人員可以訪問
    [ModuleId.BASIC_SYSTEM]: [UserRole.SITE_MANAGER, UserRole.ADMIN],

    // 外部系統 - 只有場地經理和系統人員可以訪問
    [ModuleId.EXTERNAL_SYSTEM]: [UserRole.SITE_DIRECTOR, UserRole.ADMIN],

    // 金流系統 - 只有系統人員可以訪問
    [ModuleId.PAYMENT_SYSTEM]: [UserRole.ADMIN],

    // 路邊停車系統 - 所有登入使用者都可以訪問
    [ModuleId.PARKING_SYSTEM]: [UserRole.SITE_MANAGER, UserRole.SITE_DIRECTOR, UserRole.ADMIN]
} as const;
