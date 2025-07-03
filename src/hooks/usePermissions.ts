import { useLocation } from 'react-router-dom';
import { PermissionLevel, UserRole } from '../configs/permissions';
import { useAuthProvider } from '../contexts/AuthContext';
import { usePermissionCheck } from './usePermissionCheck';

/**
 * Legacy usePermissions hook - now delegates to usePermissionCheck
 * Maintains backward compatibility while using the new permission system
 */
export const usePermissions = () => {
  const { userInfo } = useAuthProvider();
  const location = useLocation();
  const permissionCheck = usePermissionCheck();

  // Delegate to usePermissionCheck for all permission logic
  const {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canAccessAdmin: canAccessAdminArea,
    roleKey,
    getUserPermissions,
    getRoleInfo,
    canCreateProduct,
    canUpdateProduct,
    canDeleteProduct,
    canViewProduct,
    canCreateCategory,
    canUpdateCategory,
    canDeleteCategory,
    canViewCategory,
    canCreateBrand,
    canUpdateBrand,
    canDeleteBrand,
    canViewBrand,
    canCreateUser,
    canUpdateUser,
    canDeleteUser,
    canViewUser,
    canCreateArticle,
    canUpdateArticle,
    canDeleteArticle,
    canViewArticle,
    canViewOrder,
    canUpdateOrderStatus,
    canDeleteOrder,
    canViewAnalytics,
    canViewReport,
    canViewBasicReport,
    canManageRole,
    canViewRole
  } = permissionCheck;

  // Legacy compatibility
  const hasRoleId = !!userInfo?.result?.data?.roleId;
  const isAdminUser = roleKey === 'admin';
  const isUserRole = roleKey === 'user';
  const isCustomerRole = !hasRoleId && !!userInfo?.result?.data;
  const isAuthenticatedUser = !!userInfo?.result?.data;

  // Simple route permission logic using new permission system
  const hasRoutePermission = (path?: string) => {
    const checkPath = path || location.pathname;

    if (checkPath.startsWith('/admin')) {
      return canAccessAdminArea();
    }

    if (checkPath.startsWith('/profile') || checkPath.startsWith('/orders') ||
        checkPath.startsWith('/cart') || checkPath.startsWith('/checkout')) {
      return isAuthenticatedUser;
    }

    return true; // Public routes
  };

  // Legacy API compatibility - delegate to new permission system
  const isAdmin = () => isAdminUser;
  const isAuthenticated = () => isAuthenticatedUser;
  const canAccessAdmin = () => canAccessAdminArea();

  // API permission check using new system
  const hasApiPermission = (endpoint: string, method: string = 'GET') => {
    // Use permission-based checking instead of hardcoded lists
    const action = method.toLowerCase();

    // Map common API patterns to permissions
    if (endpoint.includes('/products')) {
      if (action === 'post') return hasPermission('product:create');
      if (action === 'put' || action === 'patch') return hasPermission('product:update');
      if (action === 'delete') return hasPermission('product:delete');
      return hasPermission('product:view');
    }

    if (endpoint.includes('/categories')) {
      if (action === 'post') return hasPermission('category:create');
      if (action === 'put' || action === 'patch') return hasPermission('category:update');
      if (action === 'delete') return hasPermission('category:delete');
      return hasPermission('category:view');
    }

    if (endpoint.includes('/users')) {
      if (action === 'post') return hasPermission('user:create');
      if (action === 'put' || action === 'patch') return hasPermission('user:update');
      if (action === 'delete') return hasPermission('user:delete');
      return hasPermission('user:view');
    }

    // Default: allow if authenticated for most APIs
    return isAuthenticatedUser;
  };

  // Permission level check
  const hasPermissionLevel = (level: PermissionLevel) => {
    switch (level) {
      case PermissionLevel.PUBLIC:
        return true;
      case PermissionLevel.AUTH:
        return isAuthenticatedUser;
      case PermissionLevel.ADMIN:
        return canAccessAdminArea();
      default:
        return false;
    }
  };

  // Role check
  const hasRole = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return isAdminUser;
      case UserRole.USER:
        return isUserRole;
      case UserRole.CUSTOMER:
        return isCustomerRole;
      case UserRole.PUBLIC:
        return true;
      default:
        return false;
    }
  };

  const hasAnyRole = (roles: UserRole[]) => {
    return roles.some(role => hasRole(role));
  };

  return {
    // User info
    userInfo,
    currentUserRole: isCustomerRole ? 'customer' : (roleKey || 'public'),
    getUserInfo: getRoleInfo,

    // Authentication checks
    isAuthenticated,
    isAdmin,

    // Permission checks (delegate to new system)
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRoutePermission,
    canAccessAdmin,
    hasApiPermission,
    hasPermissionLevel,
    hasRole,
    hasAnyRole,

    // Specific permission checks
    canCreateProduct,
    canUpdateProduct,
    canDeleteProduct,
    canViewProduct,
    canCreateCategory,
    canUpdateCategory,
    canDeleteCategory,
    canViewCategory,
    canCreateUser,
    canUpdateUser,
    canDeleteUser,
    canViewUser,

    // Utility
    location
  };
};

export default usePermissions;
