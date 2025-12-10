import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
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
export class SiteInfoRxJsStore {
  // All sites - private BehaviorSubject
  private readonly _allSite$ = new BehaviorSubject<SiteInfo[]>(siteInfoData.siteInfos);

  // User's accessible sites (randomly selected sites with id: 1, 3, 5, 7, 9)
  private readonly _userSite$ = new BehaviorSubject<SiteInfo[]>(
    siteInfoData.siteInfos.filter(site => [1, 3, 5, 7, 9].includes(site.id))
  );

  // Public readonly observables
  readonly allSite$: Observable<SiteInfo[]> = this._allSite$.asObservable();
  readonly userSite$: Observable<SiteInfo[]> = this._userSite$.asObservable();

  // Computed observables (derived state)
  readonly userSiteCount$: Observable<number> = this._userSite$.pipe(
    map(sites => sites.length)
  );

  readonly allSiteCount$: Observable<number> = this._allSite$.pipe(
    map(sites => sites.length)
  );

  /**
   * Update all sites data
   */
  updateAllSite(sites: SiteInfo[]): void {
    this._allSite$.next(sites);
  }

  /**
   * Update user's accessible sites
   */
  updateUserSite(sites: SiteInfo[]): void {
    this._userSite$.next(sites);
  }

  /**
   * Update user site permissions by site IDs
   */
  updateUserSiteByIds(siteIds: number[]): void {
    const currentAllSites = this._allSite$.value;
    const filteredSites = currentAllSites.filter(site => siteIds.includes(site.id));
    this._userSite$.next(filteredSites);
  }

  /**
   * Add a new site to allSite
   */
  addSite(site: SiteInfo): void {
    const currentSites = this._allSite$.value;
    this._allSite$.next([...currentSites, site]);
  }

  /**
   * Remove a site from allSite
   */
  removeSite(siteId: number): void {
    const currentAllSites = this._allSite$.value;
    const currentUserSites = this._userSite$.value;

    this._allSite$.next(currentAllSites.filter(s => s.id !== siteId));
    this._userSite$.next(currentUserSites.filter(s => s.id !== siteId));
  }

  /**
   * Get site info by ID (returns Observable)
   */
  getSiteById$(siteId: number): Observable<SiteInfo | undefined> {
    return this._allSite$.pipe(
      map(sites => sites.find(site => site.id === siteId))
    );
  }

  /**
   * Get site info by ID (returns current value)
   */
  getSiteById(siteId: number): SiteInfo | undefined {
    return this._allSite$.value.find(site => site.id === siteId);
  }

  /**
   * Check if user has permission to access a site (returns Observable)
   */
  hasUserSitePermission$(siteId: number): Observable<boolean> {
    return this._userSite$.pipe(
      map(sites => sites.some(site => site.id === siteId))
    );
  }

  /**
   * Check if user has permission to access a site (returns current value)
   */
  hasUserSitePermission(siteId: number): boolean {
    return this._userSite$.value.some(site => site.id === siteId);
  }

  /**
   * Get current value of allSite (synchronous)
   */
  getAllSiteValue(): SiteInfo[] {
    return this._allSite$.value;
  }

  /**
   * Get current value of userSite (synchronous)
   */
  getUserSiteValue(): SiteInfo[] {
    return this._userSite$.value;
  }
}