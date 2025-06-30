import { useEffect, useState } from 'react';
import permissionManager from '../configs/PermissionManager';
import { useAuthProvider } from '../contexts/AuthContext';

export const usePermissionCheck = () => {
  const { userInfo } = useAuthProvider();
  const [, forceUpdate] = useState({});

  // Subscribe to permission config changes
  useEffect(() => {
    const unsubscribe = permissionManager.subscribe(() => {
      forceUpdate({}); // Force re-render when config changes
    });

    return unsubscribe;
  }, []);

  // Lấy role từ API response
  const roleKey = userInfo?.result?.data?.role?.role_key;
  const hasRoleId = !!userInfo?.result?.data?.roleId;

  // Xác định role thực tế: nếu không có roleId thì là customer
  const actualRole = hasRoleId ? roleKey : 'customer';

  // Lấy permissions từ PermissionManager
  const getUserPermissions = (): string[] => {
    if (!actualRole) return [];
    return permissionManager.getRolePermissions(actualRole);
  };

  // Check xem user có permission cụ thể không
  const hasPermission = (permission: string): boolean => {
    if (!actualRole) return false;
    return permissionManager.hasPermission(actualRole, permission);
  };

  // Check multiple permissions (AND logic - phải có tất cả)
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!actualRole) return false;
    return permissionManager.hasAllPermissions(actualRole, permissions);
  };

  // Check multiple permissions (OR logic - có ít nhất 1)
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!actualRole) return false;
    return permissionManager.hasAnyPermission(actualRole, permissions);
  };
  
  // Check quyền cho từng module
  const canCreateProduct = () => hasPermission('product:create');
  const canUpdateProduct = () => hasPermission('product:update');
  const canDeleteProduct = () => hasPermission('product:delete');
  const canViewProduct = () => hasPermission('product:view');
  
  const canCreateCategory = () => hasPermission('category:create');
  const canUpdateCategory = () => hasPermission('category:update');
  const canDeleteCategory = () => hasPermission('category:delete');
  const canViewCategory = () => hasPermission('category:view');
  
  const canCreateBrand = () => hasPermission('brand:create');
  const canUpdateBrand = () => hasPermission('brand:update');
  const canDeleteBrand = () => hasPermission('brand:delete');
  const canViewBrand = () => hasPermission('brand:view');
  
  const canCreateUser = () => hasPermission('user:create');
  const canUpdateUser = () => hasPermission('user:update');
  const canDeleteUser = () => hasPermission('user:delete');
  const canViewUser = () => hasPermission('user:view');
  
  const canCreateArticle = () => hasPermission('article:create');
  const canUpdateArticle = () => hasPermission('article:update');
  const canDeleteArticle = () => hasPermission('article:delete');
  const canViewArticle = () => hasPermission('article:view');
  
  const canViewOrder = () => hasPermission('order:view');
  const canUpdateOrderStatus = () => hasPermission('order:update_status');
  const canDeleteOrder = () => hasPermission('order:delete');
  
  const canViewAnalytics = () => hasPermission('analytics:view');
  const canViewReport = () => hasPermission('report:view');
  const canViewBasicReport = () => hasPermission('report:view_basic');
  
  const canManageRole = () => hasPermission('role:manage');
  const canViewRole = () => hasPermission('role:view');
  
  // Helper để check quyền truy cập admin area
  const canAccessAdmin = (): boolean => {
    return permissionManager.canAccessAdmin(actualRole || '');
  };

  // Get role info
  const getRoleInfo = () => {
    if (!actualRole) return null;
    return permissionManager.getRole(actualRole);
  };

  return {
    // Core permission checks
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    getUserPermissions,
    getRoleInfo,

    // Role checks
    roleKey: actualRole,
    canAccessAdmin,
    
    // Product permissions
    canCreateProduct,
    canUpdateProduct,
    canDeleteProduct,
    canViewProduct,
    
    // Category permissions
    canCreateCategory,
    canUpdateCategory,
    canDeleteCategory,
    canViewCategory,
    
    // Brand permissions
    canCreateBrand,
    canUpdateBrand,
    canDeleteBrand,
    canViewBrand,
    
    // User permissions
    canCreateUser,
    canUpdateUser,
    canDeleteUser,
    canViewUser,
    
    // Article permissions
    canCreateArticle,
    canUpdateArticle,
    canDeleteArticle,
    canViewArticle,
    
    // Order permissions
    canViewOrder,
    canUpdateOrderStatus,
    canDeleteOrder,
    
    // Analytics & Reports
    canViewAnalytics,
    canViewReport,
    canViewBasicReport,
    
    // Role management
    canManageRole,
    canViewRole,
  };
};

export default usePermissionCheck;
