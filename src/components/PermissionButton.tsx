import React from 'react';
import { Link } from 'react-router-dom';
import { usePermissionCheck } from '../hooks/usePermissionCheck';

interface PermissionButtonProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAllPermissions?: boolean;
  fallback?: React.ReactNode;
  role?: 'admin' | 'user' | 'customer';
  className?: string;
  onClick?: () => void;
  to?: string;
  type?: 'button' | 'link';
  disabled?: boolean;
}

/**
 * PermissionButton - Button/Link component với permission checking
 * Tự động ẩn hoặc disable nếu không có quyền
 */
const PermissionButton: React.FC<PermissionButtonProps> = ({
  children,
  permission,
  permissions,
  requireAllPermissions = true,
  fallback = null,
  role,
  className = '',
  onClick,
  to,
  type = 'button',
  disabled = false
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission, roleKey } = usePermissionCheck();

  // Check role nếu được chỉ định
  if (role && roleKey !== role) {
    return <>{fallback}</>;
  }

  // Check permissions
  let hasRequiredPermissions = true;

  if (permission) {
    hasRequiredPermissions = hasPermission(permission);
  }

  if (permissions && permissions.length > 0) {
    hasRequiredPermissions = requireAllPermissions 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  // Nếu không có quyền, hiển thị fallback hoặc ẩn
  if (!hasRequiredPermissions) {
    return <>{fallback}</>;
  }

  // Render button hoặc link
  if (type === 'link' && to) {
    return (
      <Link
        to={to}
        className={className}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};

export default PermissionButton;
