import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map paths to readable labels
  const pathLabels: { [key: string]: string } = {
    admin: 'Admin',
    product: 'Sản phẩm',
    category: 'Danh mục',
    brand: 'Thương hiệu',
    user: 'Người dùng',
    orders: 'Đơn hàng',
    inventory: 'Kho hàng',
    add: 'Thêm mới',
    edit: 'Chỉnh sửa',
    profile: 'Thông tin cá nhân',
    'change-password': 'Đổi mật khẩu'
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Trang chủ', path: '/admin' }
    ];

    let currentPath = '';
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;
      
      // Skip if it's a UUID (edit pages)
      if (pathname.length === 36 && pathname.includes('-')) {
        return;
      }

      const label = pathLabels[pathname] || pathname;
      const isActive = index === pathnames.length - 1;
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isActive
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index > 0 && (
            <FontAwesomeIcon 
              icon={faChevronRight} 
              className="w-3 h-3 text-slate-400 dark:text-slate-500" 
            />
          )}
          
          {breadcrumb.isActive ? (
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              to={breadcrumb.path}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center"
            >
              {index === 0 && (
                <FontAwesomeIcon icon={faHome} className="w-4 h-4 mr-1" />
              )}
              {breadcrumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
