import { useLocation } from 'react-router-dom';
import {
  apiPermissions,
  PermissionLevel,
  UserRole
} from '../configs/permissions';
import { useAuthProvider } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { userInfo, isAuthenticated: authStatus, isAdmin: adminStatus } = useAuthProvider();
  const location = useLocation();

  // Lấy role từ API thực tế
  const roleKey = userInfo?.result?.data?.role?.role_key;

  // Simple checks
  const isAdminUser = roleKey === 'admin';
  const isAuthenticatedUser = !!userInfo && !!roleKey;

  // Check permission cho route hiện tại
  const hasRoutePermission = (path?: string) => {
    const checkPath = path || location.pathname;

    // Simple route permission logic
    if (checkPath.startsWith('/admin')) {
      return isAdminUser;
    }

    if (checkPath.startsWith('/profile') || checkPath.startsWith('/orders') ||
        checkPath.startsWith('/cart') || checkPath.startsWith('/checkout') ||
        checkPath.startsWith('/wishlist')) {
      return isAuthenticatedUser;
    }

    return true; // Public routes
  };

  // Check xem user có phải admin không
  const isAdmin = () => {
    return isAdminUser;
  };

  // Check xem user đã đăng nhập chưa
  const isAuthenticated = () => {
    return isAuthenticatedUser;
  };

  // Check xem user có thể truy cập admin area không
  const canAccessAdmin = () => {
    return isAdminUser;
  };

  // Check permission cho API endpoint
  const hasApiPermission = (endpoint: string, method: string = 'GET') => {
    const fullEndpoint = `${method.toUpperCase()} ${endpoint}`;

    // Simple API permission logic
    if (isAdminUser) {
      return apiPermissions.admin.includes(fullEndpoint);
    }

    if (isAuthenticatedUser) {
      return apiPermissions.auth.includes(fullEndpoint) || apiPermissions.public.includes(fullEndpoint);
    }

    return apiPermissions.public.includes(fullEndpoint);
  };

  // Check permission level
  const hasPermissionLevel = (level: PermissionLevel) => {
    switch (level) {
      case PermissionLevel.PUBLIC:
        return true;
      case PermissionLevel.AUTH:
        return isAuthenticatedUser;
      case PermissionLevel.ADMIN:
        return isAdminUser;
      default:
        return false;
    }
  };

  // Check specific role
  const hasRole = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return isAdminUser;
      case UserRole.USER:
      case UserRole.CUSTOMER:
        return isAuthenticatedUser;
      case UserRole.PUBLIC:
        return true;
      default:
        return false;
    }
  };

  // Check multiple roles
  const hasAnyRole = (roles: UserRole[]) => {
    return roles.some(role => hasRole(role));
  };

  // Get user info
  const getUserInfo = () => {
    return {
      userInfo,
      role: roleKey || 'public',
      isLoggedIn: isAuthenticatedUser,
      isAdmin: isAdminUser
    };
  };

  return {
    // User info
    userInfo,
    currentUserRole: roleKey || 'public',
    getUserInfo,

    // Authentication checks
    isAuthenticated,
    isAdmin,

    // Permission checks
    hasRoutePermission,
    canAccessAdmin,
    hasApiPermission,
    hasPermissionLevel,
    hasRole,
    hasAnyRole,

    // Utility
    location
  };
};

export default usePermissions;
