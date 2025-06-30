import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissionCheck } from '../hooks/usePermissionCheck';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAllPermissions?: boolean;
  fallbackPath?: string;
}

/**
 * AdminRouteGuard - Bảo vệ các route admin dựa trên permissions cụ thể
 * Sử dụng cho các route con của /admin để kiểm tra quyền chi tiết
 */
const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  children,
  requiredPermission,
  requiredPermissions,
  requireAllPermissions = true,
  fallbackPath = '/admin'
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission, roleKey } = usePermissionCheck();
  const location = useLocation();

  // Debug logs
  console.log("AdminRouteGuard DEBUG:");
  console.log("- location.pathname:", location.pathname);
  console.log("- roleKey:", roleKey);
  console.log("- requiredPermission:", requiredPermission);
  console.log("- requiredPermissions:", requiredPermissions);

  // Kiểm tra quyền cụ thể nếu được chỉ định
  if (requiredPermission) {
    const hasRequiredPermission = hasPermission(requiredPermission);
    console.log(`- hasPermission(${requiredPermission}):`, hasRequiredPermission);
    
    if (!hasRequiredPermission) {
      console.log(`AdminRouteGuard - Access denied: Missing permission ${requiredPermission}`);
      return <Navigate to={fallbackPath} replace />;
    }
  }

  // Kiểm tra nhiều quyền nếu được chỉ định
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAllPermissions 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
    
    console.log(`- hasRequiredPermissions (${requireAllPermissions ? 'ALL' : 'ANY'}):`, hasRequiredPermissions);
    
    if (!hasRequiredPermissions) {
      console.log(`AdminRouteGuard - Access denied: Missing permissions ${requiredPermissions.join(', ')}`);
      return <Navigate to={fallbackPath} replace />;
    }
  }

  console.log("AdminRouteGuard - Access granted");
  return <>{children}</>;
};

export default AdminRouteGuard;
