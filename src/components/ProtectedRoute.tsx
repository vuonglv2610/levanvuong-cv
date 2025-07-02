import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../configs/permissions';
import { useAuthProvider } from '../contexts/AuthContext';
import { usePermissionCheck } from '../hooks/usePermissionCheck';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAllPermissions?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  requiredPermissions,
  requireAllPermissions = true,
  redirectTo = '/login'
}) => {
  const { userInfo, isLoading } = useAuthProvider();
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissionCheck();
  const location = useLocation();

  // Debug logs
  console.log("ProtectedRoute DEBUG:");
  console.log("- userInfo:", userInfo);
  console.log("- isLoading:", isLoading);
  console.log("- location.pathname:", location.pathname);
  console.log("- requiredRole:", requiredRole);

  // Nếu đang loading, hiển thị loading
  if (isLoading) {
    console.log("ProtectedRoute - Loading user data...");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Lấy role từ API response thực tế
  const roleKey = userInfo?.result?.data?.role?.role_key;
  const hasRoleId = !!userInfo?.result?.data?.roleId;
  // console.log("- roleKey:", roleKey);
  // console.log("- hasRoleId:", hasRoleId);

  // Check roles dựa trên role_key và roleId
  const isAdmin = roleKey === 'admin';
  const isUser = roleKey === 'user';
  const isCustomer = !hasRoleId; // Customer không có roleId
  const hasUserInfo = !!userInfo?.result?.data;

  // console.log("- isAdmin:", isAdmin);
  // console.log("- isUser:", isUser);
  // console.log("- isCustomer:", isCustomer);
  // console.log("- hasUserInfo:", hasUserInfo);

  // Nếu không có userInfo sau khi loading xong, redirect to login
  if (!hasUserInfo) {
    console.log("ProtectedRoute - No user data after loading, redirecting to login");
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // Check specific role requirements
  if (requiredRole === UserRole.ADMIN) {
    // Cho phép cả admin và user truy cập admin area
    if (!isAdmin && !isUser) {
      console.log("ProtectedRoute - Admin area requires admin or user role");
      return <Navigate to="/" replace />;
    }
  }

  if (requiredRole === UserRole.USER || requiredRole === UserRole.CUSTOMER) {
    if (!isUser && !isCustomer && !isAdmin) {
      console.log("ProtectedRoute - User area requires valid role");
      return <Navigate to="/" replace />;
    }
  }

  // Check specific permissions if provided
  if (requiredPermission) {
    if (!hasPermission(requiredPermission)) {
      console.log(`ProtectedRoute - Missing required permission: ${requiredPermission}`);
      return <Navigate to="/" replace />;
    }
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasRequiredPermissions) {
      console.log(`ProtectedRoute - Missing required permissions: ${requiredPermissions.join(', ')}`);
      return <Navigate to="/" replace />;
    }
  }

  console.log("ProtectedRoute - Access granted!");
  return <>{children}</>;
};

export default ProtectedRoute;
