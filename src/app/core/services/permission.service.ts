import { Injectable, signal, computed } from '@angular/core';
import { AuthService } from './auth.service';
import userPermissionData from '../../../mockDB/userPermission.json';

/**
 * 權限類型
 */
export enum ClaimType {
    ROUTE = 'ROUTE',    // 路由權限（頁面訪問）
    ACTION = 'ACTION'   // 操作權限（功能按鈕）
}

/**
 * 權限聲明介面
 */
export interface Claim {
    id: number;
    code: string;
    name: string;
    type: ClaimType;
    module: string;
    parentId: number | null;
}

/**
 * 使用者權限關聯介面
 */
export interface UserClaim {
    userId: number;
    claimId: number;
}

/**
 * 權限樹節點（用於建立階層結構）
 */
export interface ClaimTreeNode extends Claim {
    children: ClaimTreeNode[];
}

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    // 所有權限定義
    private allClaims = signal<Claim[]>([]);

    // 當前使用者的權限 ID 列表
    private userClaimIds = signal<number[]>([]);

    // 當前使用者的權限物件列表(List)（computed）
    readonly userClaims = computed(() => {
        const claimIds = this.userClaimIds();
        return this.allClaims().filter(claim => claimIds.includes(claim.id));
    });

    // 當前使用者的權限樹狀結構（computed, 僅包含使用者擁有的權限）
    readonly userClaimTree = computed<ClaimTreeNode[]>(() => {
        // 取得使用者擁有的權限列表
        const userClaimList = this.userClaims();

        // 用 Map 儲存節點，方便透過 ID 查找父節點
        const claimMap = new Map<number, ClaimTreeNode>();

        // 1. 初始化使用者擁有的節點
        userClaimList.forEach(claim => {
            // 使用展開運算子 (...) 建立一個新的物件，符合 ClaimTreeNode 介面
            claimMap.set(claim.id, { ...claim, children: [] });
        });

        // 2. 建立樹狀結構並過濾
        const rootNodes: ClaimTreeNode[] = [];
        claimMap.forEach(node => {
            if (node.parentId === null) {
                // 根節點 (ParentId 為 null) 直接加入根列表
                rootNodes.push(node);
            } else {
                // 嘗試從 claimMap 中取得父節點
                const parent = claimMap.get(node.parentId);

                // 確保父節點存在 (因為我們只處理使用者擁有的節點，所以 parentId 必須在 claimMap 內)
                if (parent) {
                    parent.children.push(node);
                }
            }
        });

        // 3. 回傳樹的根節點列表
        console.log('userClaimTree', rootNodes);
        return rootNodes;
    });

    // 權限是否已載入
    private isLoaded = signal<boolean>(false);

    constructor(private authService: AuthService) {
        // 載入所有權限定義
        this.loadClaims();

        // 監聽登入狀態，自動載入使用者權限
        this.authService.user$();
        this.loadUserClaims();
    }

    /**
     * 載入所有權限定義
     */
    private loadClaims(): void {
        const claims = userPermissionData.claims.map(claim => ({
            id: claim.id,
            code: claim.code,
            name: claim.name,
            type: claim.type as ClaimType,
            module: claim.module,
            parentId: claim.parentId
        }));

        this.allClaims.set(claims);
    }

    /**
     * 載入當前使用者的權限
     */
    loadUserClaims(): void {
        const user = this.authService.getCurrentUser();

        if (!user) {
            this.userClaimIds.set([]);
            this.isLoaded.set(false);
            return;
        }

        // 從 userPermission.json 中查找該使用者的權限
        const userClaimRelations = userPermissionData.userClaims.filter(
            uc => uc.userId === user.id
        );

        const claimIds = userClaimRelations.map(uc => uc.claimId);
        this.userClaimIds.set(claimIds);
        this.isLoaded.set(true);
    }

    /**
     * 核心方法：檢查是否有指定的權限
     * @param claimCode 權限代碼，例如 'BASIC_SYSTEM_LOG_VIEW'
     */
    hasClaim(claimCode: string): boolean {
        const claim = this.allClaims().find(c => c.code === claimCode);
        if (!claim) {
            console.warn(`權限代碼 ${claimCode} 不存在`);
            return false;
        }
        return this.userClaimIds().includes(claim.id);
    }

    /**
     * 檢查權限是否已載入
     */
    isPermissionLoaded(): boolean {
        return this.isLoaded();
    }

    /**
     * 清除使用者權限（登出時使用）
     */
    clearUserClaims(): void {
        this.userClaimIds.set([]);
        this.isLoaded.set(false);
    }

    /**
     * Debug 用：印出當前使用者的所有權限
     */
    debugPrintUserClaims(): void {
        console.group('🔐 使用者權限列表');
        console.log('使用者:', this.authService.getCurrentUser());
        console.log('權限數量:', this.userClaims().length);
        console.table(this.userClaims());
        console.groupEnd();
    }
}
