import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";

// Swiper CSS imports
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./App.css";

// Context imports
import AuthProvider from "contexts/AuthContext";

// Permission imports

// Component imports
import ProductManager from "components/ProductManager";
import { ErrorBoundary } from "./components/ErrorBoundary";
import HomePage from "./components/HomePage";
import TableManage from "./components/TableManage";

// Layout imports
import AdminLayout from "./layouts/Admin";
import ClientLayout from "./layouts/Client";

// Page imports
import Cart from "pages/Cart";
import Checkout from "pages/Checkout";
import SearchPage from "pages/SearchPage";
import NotFoundPage from "./pages/404";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ArticlesPage from "./pages/ArticlesPage";
import Dashboard from "./pages/Dashboard";
import DetailPage from "./pages/Detail";
import LoginPage from "./pages/Login";
import OrdersPage from "./pages/OrdersPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import ProductsList from "./pages/Products";
import UserProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import WishlistPage from "./pages/WishlistPage";

// Admin page imports
import { default as AddArticlePage } from "pages/admin/AddArticlePage";
import AddBrandPage from "pages/admin/AddBrandPage";
import AddCategoryPage from "pages/admin/AddCategoryPage";
import AddInventoryReceipt from "pages/admin/AddInventoryReceipt";
import AddProductPage from "pages/admin/AddProductPage";
import AddUserPage from "pages/admin/AddUserPage";
import ArticleManagement from "pages/admin/ArticleManagement";
import BrandManagement from "pages/admin/BrandManagement";
import { default as EditArticlePage } from "pages/admin/EditArticlePage";
import EditBrandPage from "pages/admin/EditBrandPage";
import EditCategoryPage from "pages/admin/EditCategoryPage";
import EditInventoryReceipt from "pages/admin/EditInventoryReceipt";
import EditProductPage from "pages/admin/EditProductPage";
import EditUserPage from "pages/admin/EditUserPage";
import InventoryManagement from "pages/admin/InventoryManagement";
import OrderManagement from "pages/admin/OrderManagement";
import UserManagement from "pages/admin/UserManagement";
import ChangePasswordPage from "./pages/admin/ChangePasswordPage";
import ProfilePage from "./pages/admin/ProfilePage";
import PermissionDemoPage from "./pages/PermissionDemoPage";

// Import permission components
import ProtectedRoute from "./components/ProtectedRoute";
import { UserRole } from "./configs/permissions";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<ErrorBoundary />}>
        <Route>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/register"
            loader={() => null}
            element={<RegisterPage />}
          />
          <Route
            path="/"
            element={<ClientLayout />}
            loader={() => {
              // const token = getCookie("accessToken");
              // if (!token) return redirect("/login");
              return null;
            }}
          >
            <Route index element={<HomePage />} />
            <Route path="/product" element={<ProductsList />} />
            <Route path="/product/:id" element={<DetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={
              <ProtectedRoute requiredRole={UserRole.USER}>
                <UserProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute requiredRole={UserRole.USER}>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/order-success" element={
              <ProtectedRoute requiredRole={UserRole.USER}>
                <OrderSuccessPage />
              </ProtectedRoute>
            } />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:id" element={<ArticleDetailPage />} />
            <Route path="/permission-demo" element={<PermissionDemoPage />} />
            <Route path="/wishlist" element={
              <ProtectedRoute requiredRole={UserRole.USER}>
                <WishlistPage />
              </ProtectedRoute>
            } />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/cart" element={
              <ProtectedRoute requiredRole={UserRole.USER}>
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute requiredRole={UserRole.USER}>
                <Checkout />
              </ProtectedRoute>
            } />
          </Route>
          <Route
            path="admin"
            element={
              <ProtectedRoute requiredRole={UserRole.ADMIN}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />

            {/* Route cho sản phẩm */}
            <Route path="product" element={<ProductManager />} />
            <Route path="product/:id" element={<DetailPage />} />
            <Route path="product/edit/:id" element={<EditProductPage />} />
            <Route path="product/add" element={<AddProductPage />} />

            {/* Route cho danh mục */}
            <Route
              path="category"
              element={
                <TableManage
                  url="/categories"
                  isShowFooter={true}
                  title="Quản lý danh mục"
                  addButtonText="Thêm danh mục mới"
                  addPath="/admin/category/add"
                  editPath="/admin/category/edit"
                  columns={[
                    { key: "name", header: "Tên danh mục", render: (item: any) => (
                      <span className="font-medium text-gray-900">{item?.name || "Không có tên"}</span>
                    )},
                    { key: "description", header: "Mô tả", render: (item: any) => (
                      <span>{item?.description || "Không có mô tả"}</span>
                    )}
                  ]}
                  filterOptions={{ showCategoryFilter: false }}
                />
              }
            />
            <Route path="category/:id" element={<DetailPage />} />
            <Route path="category/edit/:id" element={<EditCategoryPage />} />
            <Route path="category/add" element={<AddCategoryPage />} />

            {/* Route cho thương hiệu */}
            <Route path="brand" element={<BrandManagement />} />
            <Route path="brand/edit/:id" element={<EditBrandPage />} />
            <Route path="brand/add" element={<AddBrandPage />} />

            {/* Route cho bài viết */}
            <Route path="articles" element={<ArticleManagement />} />
            <Route path="articles/add" element={<AddArticlePage />} />
            <Route path="articles/edit/:id" element={<EditArticlePage />} />

            {/* Route cho người dùng */}
            <Route
              path="user"
              element={<UserManagement />}
            />
            <Route path="user/add" element={<AddUserPage />} />
            <Route path="user/edit/:id" element={<EditUserPage />} />

            {/* Route cho đơn hàng */}
            <Route path="orders" element={<OrderManagement />} />

            <Route
              path="inventory"
              element={<InventoryManagement />}
            />
            <Route path="inventory/add" element={<AddInventoryReceipt />} />
            <Route path="inventory/edit/:id" element={<EditInventoryReceipt />} />
          </Route>
        </Route>
      </Route>
    )
  );

  const queryClient = new QueryClient();

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
      <ScrollToTop smooth={true} className="bg-primary flex justify-center items-center" color="white" width="20px" height="20px" />
    </div>
  );
}

export default App;








