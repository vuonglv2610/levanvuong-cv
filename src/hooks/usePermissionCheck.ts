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

  // Lấy thông tin từ API response
  const roleKey = userInfo?.result?.data?.role?.role_key;
  const hasRoleId = !!userInfo?.result?.data?.roleId;
  const accountType = userInfo?.result?.data?.accountType;

  // Xác định role thực tế với logic phân biệt accountType và role
  const actualRole = (() => {
    // Nếu không có roleId thì là customer
    if (!hasRoleId) return 'customer';

    // Nếu có roleId, kiểm tra accountType
    if (accountType === 'user') {
      // User có accountType='user' được coi như admin về permissions
      return 'admin';
    }

    // Còn lại sử dụng role_key từ database
    return roleKey;
  })();

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
