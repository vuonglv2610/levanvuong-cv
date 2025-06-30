# 🔐 Enhanced Permission System

## Tổng quan
Hệ thống phân quyền đã được cải thiện để bảo vệ chi tiết các route admin và ẩn UI elements dựa trên permissions cụ thể.

## ✨ Tính năng mới

### 1. **AdminRouteGuard Component**
- Bảo vệ các route con của `/admin` với permissions cụ thể
- Tự động redirect về `/admin` nếu không có quyền
- Debug logs để theo dõi permission checking

```tsx
<AdminRouteGuard requiredPermission="product:create">
  <AddProductPage />
</AdminRouteGuard>
```

### 2. **PermissionButton Component**
- Button/Link component với permission checking tích hợp
- Tự động ẩn hoặc hiển thị fallback nếu không có quyền
- Hỗ trợ cả button và link

```tsx
<PermissionButton
  permission="product:create"
  className="bg-blue-500 text-white px-4 py-2 rounded"
  onClick={handleCreate}
>
  Create Product
</PermissionButton>
```

### 3. **Enhanced TableManage**
- Thêm props `permissions` để kiểm tra quyền cho CRUD operations
- Tự động ẩn Add/Edit/Delete buttons nếu không có quyền
- Tích hợp với PermissionButton

```tsx
<TableManage
  url="/products"
  permissions={{
    create: "product:create",
    update: "product:update", 
    delete: "product:delete"
  }}
  // ... other props
/>
```

### 4. **Enhanced AdminLayout**
- Sidebar navigation với permission filtering
- Tự động ẩn menu items nếu không có quyền
- Debug info trong development mode

## 🛡️ Route Protection

### Cấp độ bảo vệ:

1. **Level 1: Admin Area Access**
   ```tsx
   <ProtectedRoute requiredRole={UserRole.ADMIN}>
     <AdminLayout />
   </ProtectedRoute>
   ```

2. **Level 2: Specific Route Protection**
   ```tsx
   <AdminRouteGuard requiredPermission="product:view">
     <ProductManager />
   </AdminRouteGuard>
   ```

3. **Level 3: UI Element Protection**
   ```tsx
   <PermissionButton permission="product:create">
     Add Product
   </PermissionButton>
   ```

## 📋 Protected Routes

### Product Management
- `/admin/product` - requires `product:view`
- `/admin/product/add` - requires `product:create`
- `/admin/product/edit/:id` - requires `product:update`

### Category Management
- `/admin/category` - requires `category:view`
- `/admin/category/add` - requires `category:create`
- `/admin/category/edit/:id` - requires `category:update`

### Brand Management
- `/admin/brand` - requires `brand:view`
- `/admin/brand/add` - requires `brand:create`
- `/admin/brand/edit/:id` - requires `brand:update`

### User Management
- `/admin/user` - requires `user:view`
- `/admin/user/add` - requires `user:create`
- `/admin/user/edit/:id` - requires `user:update`

### Order Management
- `/admin/orders` - requires `order:view`

### Inventory Management
- `/admin/inventory` - requires `serial:view`
- `/admin/inventory/add` - requires `serial:create`
- `/admin/inventory/edit/:id` - requires `serial:update`

### Permission Management
- `/admin/permissions` - requires `role:manage`

## 🎯 Permission Testing

### Test Page: `/admin/permission-test`
- Hiển thị current user permissions
- Test buttons cho các operations khác nhau
- Visual feedback cho permission status
- Real-time permission checking

## 🔧 Components

### Core Components:
- `ProtectedRoute` - Route-level protection
- `AdminRouteGuard` - Admin route protection
- `PermissionGate` - UI element protection
- `PermissionButton` - Button with permission checking

### Enhanced Components:
- `TableManage` - CRUD table with permission support
- `AdminLayout` - Navigation with permission filtering

## 📊 Permission Matrix

| Role | Product | Category | Brand | User | Order | Inventory | Role |
|------|---------|----------|-------|------|-------|-----------|------|
| **Admin** | CRUD | CRUD | CRUD | CRUD | View/Update | CRUD | Manage |
| **User** | View/Update | View | View | - | View/Update | View/Update | - |
| **Customer** | View | View | View | - | Own only | - | - |

## 🚀 Usage Examples

### 1. Protecting a new admin page:
```tsx
<Route path="new-feature" element={
  <AdminRouteGuard requiredPermission="feature:view">
    <NewFeaturePage />
  </AdminRouteGuard>
} />
```

### 2. Adding permission-aware buttons:
```tsx
<PermissionButton
  permission="feature:create"
  type="link"
  to="/admin/feature/add"
  className="btn-primary"
  fallback={<span className="text-gray-400">No permission</span>}
>
  Add New Feature
</PermissionButton>
```

### 3. Conditional UI rendering:
```tsx
<PermissionGate permission="feature:manage">
  <AdminPanel />
</PermissionGate>
```

## 🐛 Debug Features

### Development Mode:
- Console logs cho permission checks
- Visual indicators cho hidden elements
- Permission status trong navigation
- Real-time permission testing

### Production Mode:
- Clean UI without debug info
- Optimized permission checking
- Secure route protection

## 📝 Notes

1. **Backward Compatibility**: Existing code continues to work
2. **Performance**: Permission checks are cached and optimized
3. **Security**: Client-side protection + server-side validation required
4. **Flexibility**: Easy to add new permissions and roles
5. **Testing**: Comprehensive test page for validation

## 🔄 Next Steps

1. Add server-side permission validation
2. Implement permission caching
3. Add audit logging for permission changes
4. Create permission management UI
5. Add role hierarchy support
