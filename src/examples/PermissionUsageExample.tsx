import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import { PermissionLevel, UserRole } from '../configs/permissions';
import { usePermissions } from '../hooks/usePermissions';

// Example 1: Sử dụng ProtectedRoute component
const AdminDashboard = () => {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Chỉ admin mới có thể xem trang này</p>
      </div>
    </ProtectedRoute>
  );
};

// Example 2: Sử dụng usePermissions hook
const UserProfile = () => {
  const { isAuthenticated, isAdmin, hasRoutePermission, hasApiPermission } = usePermissions();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h1>User Profile</h1>
      
      {/* Hiển thị nội dung khác nhau dựa trên role */}
      {isAdmin() && (
        <div className="admin-section">
          <h2>Admin Controls</h2>
          <button>Manage Users</button>
        </div>
      )}

      {/* Check permission cho specific route */}
      {hasRoutePermission('/admin/orders') && (
        <button>View Order Management</button>
      )}

      {/* Check permission cho API endpoint */}
      {hasApiPermission('/statistics/dashboard', 'GET') && (
        <button>View Statistics</button>
      )}
    </div>
  );
};

// Example 3: Conditional rendering dựa trên permissions
const ProductCard = ({ product }: { product: any }) => {
  const { isAdmin, hasApiPermission } = usePermissions();

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      
      {/* Chỉ admin mới thấy nút edit/delete */}
      {isAdmin() && (
        <div className="admin-actions">
          {hasApiPermission('/products/edit/:id', 'PUT') && (
            <button>Edit Product</button>
          )}
          {hasApiPermission('/products/:id', 'DELETE') && (
            <button>Delete Product</button>
          )}
        </div>
      )}
    </div>
  );
};

// Example 4: Navigation menu với permission checking
const NavigationMenu = () => {
  const { 
    isAuthenticated, 
    isAdmin, 
    hasPermissionLevel,
    hasRole 
  } = usePermissions();

  return (
    <nav>
      <ul>
        {/* Public links */}
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/articles">Articles</a></li>

        {/* Auth required links */}
        {hasPermissionLevel(PermissionLevel.AUTH) && (
          <>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/orders">My Orders</a></li>
            <li><a href="/cart">Cart</a></li>
          </>
        )}

        {/* Admin only links */}
        {hasPermissionLevel(PermissionLevel.ADMIN) && (
          <>
            <li><a href="/admin">Admin Dashboard</a></li>
            <li><a href="/admin/products">Manage Products</a></li>
            <li><a href="/admin/orders">Manage Orders</a></li>
            <li><a href="/admin/users">Manage Users</a></li>
          </>
        )}

        {/* Role specific links */}
        {hasRole(UserRole.CUSTOMER) && (
          <li><a href="/wishlist">Wishlist</a></li>
        )}
      </ul>
    </nav>
  );
};

// Example 5: API call với permission checking
const useApiWithPermission = () => {
  const { hasApiPermission } = usePermissions();

  const callApiSafely = async (endpoint: string, method: string = 'GET', data?: any) => {
    if (!hasApiPermission(endpoint, method)) {
      throw new Error('Insufficient permissions for this API call');
    }

    // Thực hiện API call
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers here
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return response.json();
  };

  return { callApiSafely };
};

// Example 6: Higher-order component cho permission checking
const withPermission = (
  WrappedComponent: React.ComponentType<any>,
  requiredRole?: UserRole,
  redirectTo: string = '/login'
) => {
  return (props: any) => {
    const { hasRole, isAuthenticated } = usePermissions();

    if (requiredRole && !hasRole(requiredRole)) {
      if (!isAuthenticated()) {
        return <Navigate to={redirectTo} replace />;
      }
      return <Navigate to="/" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

// Sử dụng HOC
const AdminOnlyComponent = withPermission(
  () => <div>Admin Only Content</div>,
  UserRole.ADMIN
);

export {
  AdminDashboard, AdminOnlyComponent, NavigationMenu, ProductCard, useApiWithPermission, UserProfile, withPermission
};

