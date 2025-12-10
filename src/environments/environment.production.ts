/**
 * 生產環境配置
 * 用於 ng build --configuration production
 */
export const environment = {
    production: true,
    apiUrls: {
        npcsDomain: 'https://api-1.production.com',
        domain2: 'https://api-2.production.com',
        domain3: 'https://api-3.production.com',
        domain4: 'https://api-4.production.com'
    }
};