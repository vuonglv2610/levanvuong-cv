import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usePermissionCheck } from '../hooks/usePermissionCheck';

interface NavItem {
  href: string;
  title: string;
  permission?: string;
  permissions?: string[];
  requireAllPermissions?: boolean;
}

const AdminNavigation: React.FC = () => {
  const location = useLocation();
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissionCheck();

  // Cấu hình navigation với permissions
  const navItems: NavItem[] = [
    {
      href: "/admin",
      title: "Trang chủ",
    },
    {
      href: "/admin/product",
      title: "Quản lý sản phẩm",
      permission: "product:view"
    },
    {
      href: "/admin/category",
      title: "Quản lý danh mục",
      permission: "category:view"
    },
    {
      href: "/admin/brand",
      title: "Quản lý thương hiệu",
      permission: "brand:view"
    },
    {
      href: "/admin/articles",
      title: "Quản lý bài viết",
      permission: "article:view"
    },
    {
      href: "/admin/user",
      title: "Quản lý người dùng",
      permission: "user:view"
    },
    {
      href: "/admin/orders",
      title: "Quản lý đơn hàng",
      permission: "order:view"
    },
    {
      href: "/admin/inventory",
      title: "Quản lý kho hàng",
      permission: "serial:view"
    },
    {
      href: "/admin/permissions",
      title: "Quản lý phân quyền",
      permission: "role:manage"
    },
    {
      href: "/",
      title: "Trang khách hàng",
    },
  ];

  // Kiểm tra quyền cho từng nav item
  const checkPermission = (item: NavItem): boolean => {
    // Nếu không có permission requirement, cho phép truy cập
    if (!item.permission && !item.permissions) {
      return true;
    }

    // Kiểm tra single permission
    if (item.permission) {
      return hasPermission(item.permission);
    }

    // Kiểm tra multiple permissions
    if (item.permissions && item.permissions.length > 0) {
      return item.requireAllPermissions 
        ? hasAllPermissions(item.permissions)
        : hasAnyPermission(item.permissions);
    }

    return false;
  };

  // Filter nav items dựa trên permissions
  const visibleNavItems = navItems.filter(checkPermission);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/admin' && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                  ${isActive 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Debug info trong development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gray-50 border-t px-4 py-2 text-xs text-gray-500">
          <div className="container mx-auto">
            <span>Visible nav items: {visibleNavItems.length}/{navItems.length}</span>
            <span className="ml-4">
              Hidden items: {navItems.filter(item => !checkPermission(item)).map(item => item.title).join(', ')}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavigation;
