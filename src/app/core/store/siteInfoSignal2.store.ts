import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import siteInfoData from '../../../mockDB/siteInfo.json';

export interface SiteInfo {
  id: number;
  code: number;
  serial: string;
  name: string;
  url: string;
  description: string;
}

interface SiteInfoState {
  allSite: SiteInfo[];
  userSite: SiteInfo[];
}

const initialState: SiteInfoState = {
  allSite: siteInfoData.siteInfos,
  userSite: siteInfoData.siteInfos.filter(site => [1, 3, 5, 7, 9].includes(site.id))
};

/**
 * NgRx SignalStore version
 * Using @ngrx/signals for official signal-based state management
 */
export const SiteInfoSignal2Store = signalStore(
  { providedIn: 'root' },

  // Define state
  withState(initialState),

  // Define computed values (selectors)
  withComputed((store) => ({
    allSiteCount: computed(() => store.allSite().length),
    userSiteCount: computed(() => store.userSite().length)
  })),

  // Define methods (actions)
  withMethods((store) => ({
    /**
     * Update all sites data
     */
    updateAllSite(sites: SiteInfo[]): void {
      patchState(store, { allSite: sites });
    },

    /**
     * Update user's accessible sites
     */
    updateUserSite(sites: SiteInfo[]): void {
      patchState(store, { userSite: sites });
    },

    /**
     * Update user site permissions by site IDs
     */
    updateUserSiteByIds(siteIds: number[]): void {
      const filteredSites = store.allSite().filter(site => siteIds.includes(site.id));
      patchState(store, { userSite: filteredSites });
    },

    /**
     * Add a new site to allSite
     */
    addSite(site: SiteInfo): void {
      const currentSites = store.allSite();
      patchState(store, { allSite: [...currentSites, site] });
    },

    /**
     * Remove a site from both allSite and userSite
     */
    removeSite(siteId: number): void {
      const filteredAllSites = store.allSite().filter(s => s.id !== siteId);
      const filteredUserSites = store.userSite().filter(s => s.id !== siteId);
      patchState(store, {
        allSite: filteredAllSites,
        userSite: filteredUserSites
      });
    },

    /**
     * Get site info by ID
     */
    getSiteById(siteId: number): SiteInfo | undefined {
      return store.allSite().find(site => site.id === siteId);
    },

    /**
     * Check if user has permission to access a site
     */
    hasUserSitePermission(siteId: number): boolean {
      return store.userSite().some(site => site.id === siteId);
    },

    /**
     * Reset to initial state
     */
    reset(): void {
      patchState(store, initialState);
    }
  }))
);