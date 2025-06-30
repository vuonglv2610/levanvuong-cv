/**
 * Permission Config Watcher
 * Monitors changes to permissions.json and triggers updates
 */

// Type declaration for webpack Hot Module Replacement
declare global {
  interface NodeModule {
    hot?: {
      accept(path?: string | string[], callback?: () => void): void;
      decline(path?: string | string[]): void;
    };
  }
}

class PermissionWatcher {
  private watchers: (() => void)[] = [];
  private isWatching = false;

  /**
   * Start watching for permission config changes
   */
  public startWatching() {
    if (this.isWatching) return;
    
    this.isWatching = true;
    
    // In development, setup file watching
    if (process.env.NODE_ENV === 'development') {
      this.setupDevelopmentWatcher();
    }
    
    // In production, setup periodic checks or API-based updates
    if (process.env.NODE_ENV === 'production') {
      this.setupProductionWatcher();
    }
  }

  /**
   * Setup file watcher for development
   */
  private setupDevelopmentWatcher() {
    // Use webpack hot module replacement if available
    if (module.hot) {
      module.hot.accept('../configs/permissions.json', () => {
        console.log('🔄 Permissions config changed, reloading...');
        this.notifyWatchers();
      });
    }

    // Alternative: Use browser's file system access API (if supported)
    if ('showDirectoryPicker' in window) {
      this.setupFileSystemWatcher();
    }
  }

  /**
   * Setup production watcher (API-based or periodic checks)
   */
  private setupProductionWatcher() {
    // Option 1: Periodic API checks
    setInterval(() => {
      this.checkForConfigUpdates();
    }, 30000); // Check every 30 seconds

    // Option 2: WebSocket for real-time updates
    this.setupWebSocketWatcher();
  }

  /**
   * Setup file system watcher using File System Access API
   */
  private async setupFileSystemWatcher() {
    try {
      // This is experimental and requires user permission
      // Only works in modern browsers with HTTPS
      console.log('📁 Setting up file system watcher...');
      
      // Note: This requires user interaction to grant permission
      // You would need to trigger this from a user action
    } catch (error) {
      console.log('📁 File system watcher not available');
    }
  }

  /**
   * Check for config updates via API
   */
  private async checkForConfigUpdates() {
    try {
      // Make API call to check if permissions config has changed
      const response = await fetch('/api/permissions/version');
      const data = await response.json();
      
      const currentVersion = localStorage.getItem('permissions_version');
      
      if (data.version !== currentVersion) {
        console.log('🔄 New permissions version detected, reloading...');
        localStorage.setItem('permissions_version', data.version);
        
        // Fetch new config
        await this.fetchUpdatedConfig();
        this.notifyWatchers();
      }
    } catch (error) {
      // Silently fail - API might not be available
    }
  }

  /**
   * Setup WebSocket for real-time updates
   */
  private setupWebSocketWatcher() {
    try {
      const ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/permissions`);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'permissions_updated') {
          console.log('🔄 Permissions updated via WebSocket');
          this.notifyWatchers();
        }
      };
      
      ws.onerror = () => {
        // Silently fail - WebSocket might not be available
      };
    } catch (error) {
      // WebSocket not available
    }
  }

  /**
   * Fetch updated config from API
   */
  private async fetchUpdatedConfig() {
    try {
      const response = await fetch('/api/permissions/config');
      const newConfig = await response.json();
      
      // Update local storage or trigger config reload
      localStorage.setItem('permissions_config', JSON.stringify(newConfig));
      
      return newConfig;
    } catch (error) {
      console.error('Failed to fetch updated permissions config:', error);
    }
  }

  /**
   * Add watcher callback
   */
  public addWatcher(callback: () => void): () => void {
    this.watchers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.watchers.indexOf(callback);
      if (index > -1) {
        this.watchers.splice(index, 1);
      }
    };
  }

  /**
   * Notify all watchers
   */
  private notifyWatchers() {
    this.watchers.forEach(watcher => {
      try {
        watcher();
      } catch (error) {
        console.error('Error in permission watcher callback:', error);
      }
    });
  }

  /**
   * Stop watching
   */
  public stopWatching() {
    this.isWatching = false;
    this.watchers = [];
  }

  /**
   * Manual trigger for config reload
   */
  public triggerReload() {
    console.log('🔄 Manually triggering permissions reload...');
    this.notifyWatchers();
  }
}

// Singleton instance
export const permissionWatcher = new PermissionWatcher();

// Auto-start watching in development
if (process.env.NODE_ENV === 'development') {
  permissionWatcher.startWatching();
}

export default permissionWatcher;
