import { computed, Injectable, signal } from '@angular/core';
import siteInfoData from '../../../mockDB/siteInfo.json';

export interface SiteInfo {
  id: number;
  code: number;
  serial: string;
  name: string;
  url: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class SiteInfoStore {
  // All sites
  private readonly _allSite = signal<SiteInfo[]>(siteInfoData.siteInfos);

  // User's accessible sites (randomly selected sites with id: 1, 3, 5, 7, 9)
  private readonly _userSite = signal<SiteInfo[]>(
    siteInfoData.siteInfos.filter(site => [1, 3, 5, 7, 9].includes(site.id))
  );

  // Public readonly signals
  readonly allSite = this._allSite.asReadonly();
  readonly userSite = this._userSite.asReadonly();

  // Computed values
  readonly userSiteCount = computed(() => this._userSite().length);
  readonly allSiteCount = computed(() => this._allSite().length);

  /**
   * Update all sites data
   */
  updateAllSite(sites: SiteInfo[]): void {
    this._allSite.set(sites);
  }

  /**
   * Update user's accessible sites
   */
  updateUserSite(sites: SiteInfo[]): void {
    this._userSite.set(sites);
  }

  /**
   * Update user site permissions by site IDs
   */
  updateUserSiteByIds(siteIds: number[]): void {
    const filteredSites = this._allSite().filter(site => siteIds.includes(site.id));
    this._userSite.set(filteredSites);
  }

  /**
   * Add a new site to allSite
   */
  addSite(site: SiteInfo): void {
    this._allSite.update(sites => [...sites, site]);
  }

  /**
   * Remove a site from allSite
   */
  removeSite(siteId: number): void {
    this._allSite.update(sites => sites.filter(s => s.id !== siteId));
    this._userSite.update(sites => sites.filter(s => s.id !== siteId));
  }

  /**
   * Get site info by ID
   */
  getSiteById(siteId: number): SiteInfo | undefined {
    return this._allSite().find(site => site.id === siteId);
  }

  /**
   * Check if user has permission to access a site
   */
  hasUserSitePermission(siteId: number): boolean {
    return this._userSite().some(site => site.id === siteId);
  }
}
