# Hệ thống Phân quyền (Permission System)

## Tổng quan

Hệ thống phân quyền này được thiết kế để quản lý truy cập vào các routes và API endpoints dựa trên role của user. Hệ thống bao gồm:

- **3 levels phân quyền**: PUBLIC, AUTH, ADMIN
- **4 user roles**: PUBLIC, USER, CUSTOMER, ADMIN
- **Route protection**: Bảo vệ các routes dựa trên permissions
- **API permission checking**: Kiểm tra quyền truy cập API endpoints

## Cấu trúc Files

```
src/
├── configs/
│   └── permissions.ts          # Cấu hình permissions chính
├── components/
│   └── ProtectedRoute.tsx      # Component bảo vệ routes
├── hooks/
│   └── usePermissions.ts       # Hook để sử dụng permissions
├── contexts/
│   └── AuthContext.tsx         # Context đã được cập nhật
└── examples/
    └── PermissionUsageExample.tsx # Ví dụ sử dụng
```

## User Roles

```typescript
enum UserRole {
  PUBLIC = 'public',      // Chưa đăng nhập
  USER = 'user',          // User đã đăng nhập
  CUSTOMER = 'customer',  // Customer đã đăng nhập
  ADMIN = 'admin'         // Admin
}
```

## Permission Levels

```typescript
enum PermissionLevel {
  PUBLIC = 'public',      // Ai cũng truy cập được
  AUTH = 'auth',          // Cần đăng nhập
  ADMIN = 'admin'         // Chỉ admin
}
```

## Cách sử dụng

### 1. Bảo vệ Routes với ProtectedRoute

```tsx
import ProtectedRoute from '../components/ProtectedRoute';
import { UserRole } from '../configs/permissions';

// Bảo vệ route cần đăng nhập
<ProtectedRoute requiredRole={UserRole.USER}>
  <UserProfile />
</ProtectedRoute>

// Bảo vệ route chỉ admin
<ProtectedRoute requiredRole={UserRole.ADMIN}>
  <AdminDashboard />
</ProtectedRoute>
```

### 2. Sử dụng usePermissions Hook

```tsx
import { usePermissions } from '../hooks/usePermissions';

const MyComponent = () => {
  const { 
    isAuthenticated, 
    isAdmin, 
    hasRoutePermission,
    hasApiPermission,
    hasPermissionLevel 
  } = usePermissions();

  return (
    <div>
      {isAuthenticated && <p>Đã đăng nhập</p>}
      {isAdmin && <AdminPanel />}
      
      {hasRoutePermission('/admin/orders') && (
        <button>Quản lý đơn hàng</button>
      )}
      
      {hasApiPermission('/products', 'POST') && (
        <button>Thêm sản phẩm</button>
      )}
    </div>
  );
};
```

### 3. Conditional Rendering

```tsx
const NavigationMenu = () => {
  const { hasPermissionLevel } = usePermissions();

  return (
    <nav>
      {/* Public links */}
      <a href="/">Home</a>
      
      {/* Auth required */}
      {hasPermissionLevel(PermissionLevel.AUTH) && (
        <a href="/profile">Profile</a>
      )}
      
      {/* Admin only */}
      {hasPermissionLevel(PermissionLevel.ADMIN) && (
        <a href="/admin">Admin</a>
      )}
    </nav>
  );
};
```

### 4. API Permission Checking

```tsx
const { hasApiPermission } = usePermissions();

const handleDeleteProduct = async (id: string) => {
  if (!hasApiPermission('/products/:id', 'DELETE')) {
    alert('Bạn không có quyền xóa sản phẩm');
    return;
  }
  
  // Thực hiện xóa
  await deleteProduct(id);
};
```

## Cấu hình Routes trong App.tsx

```tsx
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './configs/permissions';

// Public routes
<Route path="/" element={<HomePage />} />
<Route path="/login" element={<LoginPage />} />

// Auth required routes
<Route path="/profile" element={
  <ProtectedRoute requiredRole={UserRole.USER}>
    <ProfilePage />
  </ProtectedRoute>
} />

// Admin only routes
<Route path="/admin/*" element={
  <ProtectedRoute requiredRole={UserRole.ADMIN}>
    <AdminLayout />
  </ProtectedRoute>
} />
```

## API Permissions Mapping

Hệ thống đã map sẵn tất cả API endpoints theo 3 nhóm:

### PUBLIC APIs (19 endpoints)
- Xem sản phẩm, danh mục, thương hiệu
- Xem bài viết, voucher, comments
- Đăng nhập/đăng ký
- Tạo/xem đơn hàng

### AUTH APIs (15 endpoints)  
- Quản lý profile, giỏ hàng
- Quản lý comments của user
- Thanh toán

### ADMIN APIs (25 endpoints)
- CRUD tất cả entities
- Quản lý serials, statistics
- Xóa users

## Lưu ý quan trọng

1. **AuthContext đã được cập nhật** với các thuộc tính mới:
   - `userRole`: Role hiện tại của user
   - `isAuthenticated`: Trạng thái đăng nhập
   - `isAdmin`: Có phải admin không

2. **Route protection tự động**: Hệ thống sẽ tự động redirect:
   - Chưa đăng nhập → `/login`
   - Không đủ quyền → `/`

3. **Flexible configuration**: Có thể dễ dàng thêm/sửa permissions trong `permissions.ts`

4. **Type safety**: Tất cả đều có TypeScript types đầy đủ

## Troubleshooting

### Lỗi thường gặp:

1. **"useAuthProvider must be used within a AuthProvider tag"**
   - Đảm bảo component được wrap trong `<AuthProvider>`

2. **Permission không hoạt động**
   - Check xem `userInfo.role` có đúng format không
   - Verify route path trong `routePermissions`

3. **Redirect loop**
   - Check logic trong `ProtectedRoute`
   - Đảm bảo public routes không bị protect

## Mở rộng

Để thêm permission mới:

1. Thêm vào `routePermissions` trong `permissions.ts`
2. Thêm API endpoint vào `apiPermissions`
3. Sử dụng `usePermissions` hook để check

Hệ thống này cung cấp foundation mạnh mẽ và linh hoạt cho việc quản lý phân quyền trong ứng dụng React.
