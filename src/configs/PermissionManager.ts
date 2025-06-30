import permissionsData from './permissions.json';

export interface Permission {
  role: string;
  description: string;
  permissions: string[];
}

export interface PermissionConfig {
  roles: Record<string, Permission>;
  permission_descriptions: Record<string, string>;
}

/**
 * Permission Manager - Quản lý tập trung tất cả permissions
 * Tự động reload khi permissions.json thay đổi
 */
class PermissionManager {
  private config: PermissionConfig;
  private listeners: (() => void)[] = [];

  constructor() {
    this.config = permissionsData as PermissionConfig;
    
    // Hot reload trong development
    if (process.env.NODE_ENV === 'development') {
      this.setupHotReload();
    }
  }

  /**
   * Setup hot reload cho development
   */
  private setupHotReload() {
    // Trong môi trường development, có thể setup file watcher
    // Hoặc sử dụng webpack hot reload
    if (module.hot) {
      module.hot.accept('./permissions.json', () => {
        this.reloadConfig();
      });
    }
  }

  /**
   * Reload config từ file
   */
  private reloadConfig() {
    try {
      // Re-import permissions.json
      delete require.cache[require.resolve('./permissions.json')];
      this.config = require('./permissions.json') as PermissionConfig;
      
      // Notify all listeners
      this.listeners.forEach(listener => listener());
      
      console.log('🔄 Permissions config reloaded successfully');
    } catch (error) {
      console.error('❌ Failed to reload permissions config:', error);
    }
  }

  /**
   * Subscribe to config changes
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Get all roles
   */
  public getRoles(): Record<string, Permission> {
    return this.config.roles;
  }

  /**
   * Get role by key
   */
  public getRole(roleKey: string): Permission | null {
    return this.config.roles[roleKey] || null;
  }

  /**
   * Get permissions for a role
   */
  public getRolePermissions(roleKey: string): string[] {
    const role = this.getRole(roleKey);
    return role ? role.permissions : [];
  }

  /**
   * Check if role has permission
   */
  public hasPermission(roleKey: string, permission: string): boolean {
    const permissions = this.getRolePermissions(roleKey);
    return permissions.includes(permission);
  }

  /**
   * Check if role has all permissions
   */
  public hasAllPermissions(roleKey: string, permissions: string[]): boolean {
    const rolePermissions = this.getRolePermissions(roleKey);
    return permissions.every(permission => rolePermissions.includes(permission));
  }

  /**
   * Check if role has any permission
   */
  public hasAnyPermission(roleKey: string, permissions: string[]): boolean {
    const rolePermissions = this.getRolePermissions(roleKey);
    return permissions.some(permission => rolePermissions.includes(permission));
  }

  /**
   * Get permission description
   */
  public getPermissionDescription(permission: string): string {
    return this.config.permission_descriptions[permission] || permission;
  }

  /**
   * Get all permission descriptions
   */
  public getPermissionDescriptions(): Record<string, string> {
    return this.config.permission_descriptions;
  }

  /**
   * Check if role can access admin area
   */
  public canAccessAdmin(roleKey: string): boolean {
    return roleKey === 'admin' || roleKey === 'user';
  }

  /**
   * Get role hierarchy (for future use)
   */
  public getRoleHierarchy(): string[] {
    return ['admin', 'user', 'customer', 'public'];
  }

  /**
   * Validate permission format
   */
  public isValidPermission(permission: string): boolean {
    return /^[a-z_]+:[a-z_]+$/.test(permission);
  }

  /**
   * Get permissions by category
   */
  public getPermissionsByCategory(category: string): string[] {
    const allPermissions = Object.keys(this.config.permission_descriptions);
    return allPermissions.filter(permission => permission.startsWith(`${category}:`));
  }

  /**
   * Get all categories
   */
  public getCategories(): string[] {
    const allPermissions = Object.keys(this.config.permission_descriptions);
    const categories = new Set<string>();
    
    allPermissions.forEach(permission => {
      const [category] = permission.split(':');
      if (category) {
        categories.add(category);
      }
    });
    
    return Array.from(categories).sort();
  }

  /**
   * Export current config (for debugging)
   */
  public exportConfig(): PermissionConfig {
    return JSON.parse(JSON.stringify(this.config));
  }

  /**
   * Get statistics
   */
  public getStats() {
    const roles = Object.keys(this.config.roles);
    const totalPermissions = Object.keys(this.config.permission_descriptions).length;
    const categories = this.getCategories();
    
    const roleStats = roles.map(roleKey => ({
      role: roleKey,
      permissionCount: this.getRolePermissions(roleKey).length,
      description: this.getRole(roleKey)?.description
    }));

    return {
      totalRoles: roles.length,
      totalPermissions,
      totalCategories: categories.length,
      categories,
      roleStats
    };
  }
}

// Singleton instance
export const permissionManager = new PermissionManager();

export default permissionManager;
