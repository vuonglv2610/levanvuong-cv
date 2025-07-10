// Định nghĩa các role trong hệ thống
export enum UserRole {
  PUBLIC = 'public',
  USER = 'user',
  CUSTOMER = 'customer', 
  ADMIN = 'admin'
}

// Định nghĩa các permission levels
export enum PermissionLevel {
  PUBLIC = 'public',
  AUTH = 'auth',
  ADMIN = 'admin'
}

// Interface cho route permission
export interface RoutePermission {
  path: string;
  level: PermissionLevel;
  roles: UserRole[];
  exact?: boolean;
  children?: RoutePermission[];
}

// Cấu hình permissions cho các routes
export const routePermissions: RoutePermission[] = [
  // PUBLIC ROUTES - Không cần đăng nhập
  {
    path: '/',
    level: PermissionLevel.PUBLIC,
    roles: [UserRole.PUBLIC, UserRole.USER, UserRole.CUSTOMER, UserRole.ADMIN],
    exact: true
  },
  {
    path: '/login',
    level: PermissionLevel.PUBLIC,
    roles: [UserRole.PUBLIC],
    exact: true
  },
  {
    path: '/register',
    level: PermissionLevel.PUBLIC,
    roles: [UserRole.PUBLIC],
    exact: true
  },
  {
    path: '/product',
    level: PermissionLevel.PUBLIC,
    roles: [UserRole.PUBLIC, UserRole.USER, UserRole.CUSTOMER, UserRole.ADMIN],
    exact: true
  },
  {
    path: '/product/:id',
    level: PermissionLevel.PUBLIC,
    roles: [UserRole.PUBLIC, UserRole.USER, UserRole.CUSTOMER, UserRole.ADMIN],
    exact: false
  },
  {
    path: '/search',
    level: PermissionLevel.PUBLIC,
    roles: [UserRole.PUBLIC, UserRole.USER, UserRole.CUSTOMER, UserRole.ADMIN],
    exact: true
  },

  {
    path: '/404',
    level: PermissionLevel.PUBLIC,
    roles: [UserRole.PUBLIC, UserRole.USER, UserRole.CUSTOMER, UserRole.ADMIN],
    exact: true
  },

  // AUTH ROUTES - Cần đăng nhập (Customer/User)
  {
    path: '/profile',
    level: PermissionLevel.AUTH,
    roles: [UserRole.USER, UserRole.CUSTOMER, UserRole.ADMIN],
    exact: true
  },
  {
    path: '/orders',
    level: PermissionLevel.AUTH,
    roles: [UserRole.USER, UserRole.CUSTOMER, UserRole.ADMIN],
    exact: true
  },
  {
    path: '/order-success',
    level: PermissionLevel.AUTH,
    roles: [UserRole.USER, UserRole.CUSTOMER, UserRole.ADMIN],
    exact: true
  },
  {
    path: '/cart',
    level: PermissionLevel.AUTH,
    roles: [UserRole.USER, UserRole.CUSTOMER, UserRole.ADMIN],
    exact: true
  },
  {
    path: '/checkout',
    level: PermissionLevel.AUTH,
    roles: [UserRole.USER, UserRole.CUSTOMER, UserRole.ADMIN],
    exact: true
  },


  // ADMIN ROUTES - Cần quyền Admin
  {
    path: '/admin',
    level: PermissionLevel.ADMIN,
    roles: [UserRole.ADMIN],
    exact: false
  },
  {
    path: '/admin/profile',
    level: PermissionLevel.ADMIN,
    roles: [UserRole.ADMIN],
    exact: true
  },
  {
    path: '/admin/change-password',
    level: PermissionLevel.ADMIN,
    roles: [UserRole.ADMIN],
    exact: true
  },
  // Product management
  {
    path: '/admin/product',
    level: PermissionLevel.ADMIN,
    roles: [UserRole.ADMIN],
    exact: false
  },
  // Category management
  {
    path: '/admin/category',
    level: PermissionLevel.ADMIN,
    roles: [UserRole.ADMIN],
    exact: false
  },
  // Brand management
  {
    path: '/admin/brand',
    level: PermissionLevel.ADMIN,
    roles: [UserRole.ADMIN],
    exact: false
  },

  // User management
  {
    path: '/admin/user',
    level: PermissionLevel.ADMIN,
    roles: [UserRole.ADMIN],
    exact: false
  },
  // Order management
  {
    path: '/admin/orders',
    level: PermissionLevel.ADMIN,
    roles: [UserRole.ADMIN],
    exact: true
  },
  // Inventory management
  {
    path: '/admin/inventory',
    level: PermissionLevel.ADMIN,
    roles: [UserRole.ADMIN],
    exact: false
  }
];

// API Permissions mapping theo danh sách bạn cung cấp
export const apiPermissions = {
  // PUBLIC APIs
  public: [
    'GET /',
    'GET /:id',
    'GET /categories',
    'GET /categories/:id', 
    'GET /brands',
    'GET /brands/:id',

    'POST /auth/login',
    'POST /auth/login-success',
    'POST /auth/register',
    'GET /auth/google',
    'GET /auth/google/callback',
    'GET /vouchers',
    'GET /vouchers/:id',
    'GET /vouchers/code/:code',
    'GET /comments',
    'GET /comments/product/:productId',
    'GET /comments/customer/:customerId',
    'GET /comments/:id',
    'GET /orders',
    'GET /orders/:id',
    'POST /orders',
    'PUT /orders/:id',
    'DELETE /orders/:id',
    'GET /payments/check-vnpay'
  ],

  // AUTH APIs (Customer/User logged in)
  auth: [
    'GET /users',
    'GET /users/:id',
    'POST /users',
    'PUT /users/edit/:id',
    'POST /customers',
    'PUT /customers/edit/:id',
    'DELETE /customers/:id',
    'GET /shopping-cart',
    'GET /shopping-cart/:id',
    'GET /shopping-cart/customer/:id',
    'POST /shopping-cart',
    'PUT /shopping-cart/edit/:id',
    'DELETE /shopping-cart/:id',
    'GET /profile',
    'PUT /profile',
    'PUT /profile/change-password',
    'POST /comments',
    'PUT /comments/:id',
    'DELETE /comments/:id',
    'POST /payments/create-from-cart',
    'GET /payments/:id'
  ],

  // ADMIN APIs
  admin: [
    'POST /products',
    'PUT /products/edit/:id',
    'DELETE /products/:id',
    'POST /categories',
    'PUT /categories/edit/:id',
    'DELETE /categories/:id',
    'POST /brands',
    'PUT /brands/:id',
    'DELETE /brands/:id',

    'POST /vouchers',
    'PUT /vouchers/:id',
    'DELETE /vouchers/:id',
    'GET /serials',
    'GET /serials/:id',
    'GET /serials/product/:productId',
    'POST /serials',
    'POST /serials/bulk',
    'PUT /serials/:id',
    'DELETE /serials/:id',
    'DELETE /users/:id',
    'GET /payments',
    'GET /statistics/dashboard',
    'GET /statistics/revenue',
    'GET /statistics/revenue/comparison',
    'GET /statistics/orders',
    'GET /statistics/products/top',
    'GET /statistics/customers',
    'GET /statistics/categories',
    'GET /statistics/brands',
    'GET /statistics/payment-methods',
    'GET /roles'
  ]
};

// Helper functions để check permissions
export const checkRoutePermission = (
  currentPath: string,
  userRole: UserRole | null
): boolean => {
  // Nếu chưa đăng nhập, chỉ cho phép truy cập public routes
  if (!userRole) {
    userRole = UserRole.PUBLIC;
  }

  // Tìm route permission phù hợp
  const permission = findRoutePermission(currentPath, routePermissions);

  if (!permission) {
    // Nếu không tìm thấy permission, mặc định là public
    return true;
  }

  return permission.roles.includes(userRole);
};

const findRoutePermission = (
  path: string,
  permissions: RoutePermission[]
): RoutePermission | null => {
  for (const permission of permissions) {
    if (matchPath(path, permission.path, permission.exact)) {
      return permission;
    }

    // Check children nếu có
    if (permission.children) {
      const childPermission = findRoutePermission(path, permission.children);
      if (childPermission) {
        return childPermission;
      }
    }
  }

  return null;
};

const matchPath = (currentPath: string, routePath: string, exact = false): boolean => {
  if (exact) {
    return currentPath === routePath;
  }
  
  // Convert route path với params thành regex
  const regexPath = routePath
    .replace(/:[^/]+/g, '[^/]+') // Replace :id với [^/]+
    .replace(/\//g, '\\/'); // Escape forward slashes
  
  const regex = new RegExp(`^${regexPath}$`);
  return regex.test(currentPath);
};

export const getUserRoleFromString = (roleString: string): UserRole => {
  switch (roleString?.toLowerCase()) {
    case 'admin':
      return UserRole.ADMIN;
    case 'customer':
      return UserRole.CUSTOMER;
    case 'user':
      return UserRole.USER;
    default:
      return UserRole.PUBLIC;
  }
};
