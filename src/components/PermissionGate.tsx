import React from 'react';
import { usePermissionCheck } from '../hooks/usePermissionCheck';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean; // true = AND logic, false = OR logic
  fallback?: React.ReactNode;
  role?: 'admin' | 'user' | 'customer';
}

/**
 * PermissionGate component để bảo vệ UI elements dựa trên permissions
 * 
 * @param permission - Single permission cần check
 * @param permissions - Array permissions cần check
 * @param requireAll - true: cần tất cả permissions (AND), false: cần ít nhất 1 (OR)
 * @param fallback - Component hiển thị khi không có quyền
 * @param role - Role cụ thể cần check
 */
const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permission,
  permissions,
  requireAll = true,
  fallback = null,
  role
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission, roleKey } = usePermissionCheck();

  // Check role nếu được chỉ định
  if (role && roleKey !== role) {
    return <>{fallback}</>;
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    const hasRequiredPermissions = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
      
    if (!hasRequiredPermissions) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

export default PermissionGate;
