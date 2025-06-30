import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../configs/permissions';
import { useAuthProvider } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login'
}) => {
  const { userInfo, isLoading } = useAuthProvider();
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
  console.log("- roleKey:", roleKey);

  // Check admin dựa trên role_key
  const isAdmin = roleKey === 'admin';
  const hasUserInfo = !!userInfo?.result?.data;
  console.log("- isAdmin:", isAdmin);
  console.log("- hasUserInfo:", hasUserInfo);

  // Nếu không có userInfo sau khi loading xong, redirect to login
  if (!hasUserInfo) {
    console.log("ProtectedRoute - No user data after loading, redirecting to login");
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // Check specific role requirements
  if (requiredRole === UserRole.ADMIN && !isAdmin) {
    console.log("ProtectedRoute - Admin required but user is not admin");
    return <Navigate to="/" replace />;
  }

  if ((requiredRole === UserRole.USER || requiredRole === UserRole.CUSTOMER) && !roleKey) {
    console.log("ProtectedRoute - User role required but no role found");
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute - Access granted!");
  return <>{children}</>;
};

export default ProtectedRoute;
