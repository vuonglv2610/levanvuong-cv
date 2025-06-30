import React from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom";

// Import ProtectedRoute và permissions
import ProtectedRoute from "../components/ProtectedRoute";
import { UserRole } from "../configs/permissions";

// Import layouts và pages (giả sử đã có)
import HomePage from "../components/HomePage";
import AdminLayout from "../layouts/Admin";
import ClientLayout from "../layouts/Client";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Dashboard from "../pages/Dashboard";
import DetailPage from "../pages/Detail";
import LoginPage from "../pages/Login";
import OrdersPage from "../pages/OrdersPage";
import ProductsList from "../pages/Products";
import UserProfilePage from "../pages/ProfilePage";
import RegisterPage from "../pages/RegisterPage";

// Ví dụ cách tích hợp ProtectedRoute vào App.tsx
function AppWithPermissions() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        {/* PUBLIC ROUTES - Không cần bảo vệ */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* CLIENT LAYOUT với các routes được bảo vệ */}
        <Route path="/" element={<ClientLayout />}>
          {/* Public routes trong client layout */}
          <Route index element={<HomePage />} />
          <Route path="product" element={<ProductsList />} />
          <Route path="product/:id" element={<DetailPage />} />
          
          {/* AUTH REQUIRED ROUTES - Cần đăng nhập */}
          <Route path="profile" element={
            <ProtectedRoute requiredRole={UserRole.USER}>
              <UserProfilePage />
            </ProtectedRoute>
          } />
          
          <Route path="orders" element={
            <ProtectedRoute requiredRole={UserRole.USER}>
              <OrdersPage />
            </ProtectedRoute>
          } />
          
          <Route path="cart" element={
            <ProtectedRoute requiredRole={UserRole.USER}>
              <Cart />
            </ProtectedRoute>
          } />
          
          <Route path="checkout" element={
            <ProtectedRoute requiredRole={UserRole.USER}>
              <Checkout />
            </ProtectedRoute>
          } />
        </Route>

        {/* ADMIN ROUTES - Chỉ admin */}
        <Route path="admin" element={
          <ProtectedRoute requiredRole={UserRole.ADMIN}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          
          {/* Tất cả admin routes đều được bảo vệ bởi parent ProtectedRoute */}
          <Route path="products" element={<div>Product Management</div>} />
          <Route path="orders" element={<div>Order Management</div>} />
          <Route path="users" element={<div>User Management</div>} />
          <Route path="categories" element={<div>Category Management</div>} />
          <Route path="brands" element={<div>Brand Management</div>} />
          <Route path="articles" element={<div>Article Management</div>} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

// Ví dụ cách sử dụng trong component riêng lẻ
const ProductManagementPage = () => {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <div>
        <h1>Product Management</h1>
        <p>Chỉ admin mới có thể truy cập trang này</p>
        {/* Nội dung quản lý sản phẩm */}
      </div>
    </ProtectedRoute>
  );
};

// Ví dụ cách bảo vệ một phần của component
const ProductCard = ({ product }: { product: any }) => {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      
      {/* Chỉ admin mới thấy phần này */}
      <ProtectedRoute requiredRole={UserRole.ADMIN}>
        <div className="admin-actions">
          <button>Edit</button>
          <button>Delete</button>
        </div>
      </ProtectedRoute>
    </div>
  );
};

// Ví dụ navigation với permission checking
const NavigationWithPermissions = () => {
  return (
    <nav>
      <ul>
        {/* Public links */}
        <li><a href="/">Home</a></li>
        <li><a href="/products">Products</a></li>
        
        {/* Auth required links - sẽ ẩn nếu chưa đăng nhập */}
        <ProtectedRoute requiredRole={UserRole.USER}>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/orders">My Orders</a></li>
          <li><a href="/cart">Cart</a></li>
        </ProtectedRoute>
        
        {/* Admin only links */}
        <ProtectedRoute requiredRole={UserRole.ADMIN}>
          <li><a href="/admin">Admin Dashboard</a></li>
        </ProtectedRoute>
      </ul>
    </nav>
  );
};

export default AppWithPermissions;
export { NavigationWithPermissions, ProductCard, ProductManagementPage };

/*
HƯỚNG DẪN TÍCH HỢP VÀO APP.TSX HIỆN TẠI:

1. Import ProtectedRoute và UserRole:
   import ProtectedRoute from "./components/ProtectedRoute";
   import { UserRole } from "./configs/permissions";

2. Wrap các routes cần bảo vệ:
   
   // Thay vì:
   <Route path="/profile" element={<UserProfilePage />} />
   
   // Sử dụng:
   <Route path="/profile" element={
     <ProtectedRoute requiredRole={UserRole.USER}>
       <UserProfilePage />
     </ProtectedRoute>
   } />

3. Đối với admin routes, có thể bảo vệ toàn bộ admin layout:
   
   <Route path="admin" element={
     <ProtectedRoute requiredRole={UserRole.ADMIN}>
       <AdminLayout />
     </ProtectedRoute>
   }>
     {/* Tất cả child routes sẽ được bảo vệ }
   </Route>

4. Hoặc bảo vệ từng route riêng lẻ nếu cần logic phức tạp hơn.

5. Đảm bảo AuthProvider đã wrap toàn bộ app để ProtectedRoute hoạt động.
*/
