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

// Permission system imports

// Swiper CSS imports
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "./App.css";

// Context imports
import AuthProvider from "contexts/AuthContext";
import { NotificationProvider } from "contexts/NotificationContext";

// Permission imports

// Component imports
import ProductManager from "components/ProductManager";
import ToastContainer from "components/ToastContainer";
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

// Permission system components
import UserManagement from "pages/admin/UserManagement";
import ChangePasswordPage from "./pages/admin/ChangePasswordPage";
import PermissionTestPage from "./pages/admin/PermissionTestPage";
import ProfilePage from "./pages/admin/ProfilePage";
import PermissionDemoPage from "./pages/PermissionDemoPage";

// Import permission components
import PermissionAdminPanel from "components/PermissionAdminPanel";
import PermissionExamples from "examples/PermissionExamples";
import PaymentCallbackPage from "pages/PaymentCallbackPage";
import PaymentDebugPage from "pages/PaymentDebugPage";
import PaymentFailedPage from "pages/PaymentFailedPage";
import PaymentProcessingPage from "pages/PaymentProcessingPage";
import AdminRouteGuard from "./components/AdminRouteGuard";
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
            <Route path="/payment-processing" element={
              <ProtectedRoute requiredRole={UserRole.USER}>
                <PaymentProcessingPage />
              </ProtectedRoute>
            } />
            <Route path="/payment-debug" element={
              <ProtectedRoute requiredRole={UserRole.USER}>
                <PaymentDebugPage />
              </ProtectedRoute>
            } />
            <Route path="/payment-callback" element={<PaymentCallbackPage />} />
            <Route path="/payment-failed" element={
              <ProtectedRoute requiredRole={UserRole.USER}>
                <PaymentFailedPage />
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
            <Route path="product" element={
              <AdminRouteGuard requiredPermission="product:view">
                <ProductManager />
              </AdminRouteGuard>
            } />
            <Route path="product/:id" element={
              <AdminRouteGuard requiredPermission="product:view">
                <DetailPage />
              </AdminRouteGuard>
            } />
            <Route path="product/edit/:id" element={
              <AdminRouteGuard requiredPermission="product:update">
                <EditProductPage />
              </AdminRouteGuard>
            } />
            <Route path="product/add" element={
              <AdminRouteGuard requiredPermission="product:create">
                <AddProductPage />
              </AdminRouteGuard>
            } />

            {/* Route cho danh mục */}
            <Route
              path="category"
              element={
                <AdminRouteGuard requiredPermission="category:view">
                  <TableManage
                    url="/categories"
                    isShowFooter={true}
                    title="Quản lý danh mục"
                    addButtonText="Thêm danh mục mới"
                    addPath="/admin/category/add"
                    editPath="/admin/category/edit"
                    permissions={{
                      create: "category:create",
                      update: "category:update",
                      delete: "category:delete"
                    }}
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
                </AdminRouteGuard>
              }
            />
            <Route path="category/:id" element={
              <AdminRouteGuard requiredPermission="category:view">
                <DetailPage />
              </AdminRouteGuard>
            } />
            <Route path="category/edit/:id" element={
              <AdminRouteGuard requiredPermission="category:update">
                <EditCategoryPage />
              </AdminRouteGuard>
            } />
            <Route path="category/add" element={
              <AdminRouteGuard requiredPermission="category:create">
                <AddCategoryPage />
              </AdminRouteGuard>
            } />

            {/* Route cho thương hiệu */}
            <Route path="brand" element={
              <AdminRouteGuard requiredPermission="brand:view">
                <BrandManagement />
              </AdminRouteGuard>
            } />
            <Route path="brand/edit/:id" element={
              <AdminRouteGuard requiredPermission="brand:update">
                <EditBrandPage />
              </AdminRouteGuard>
            } />
            <Route path="brand/add" element={
              <AdminRouteGuard requiredPermission="brand:create">
                <AddBrandPage />
              </AdminRouteGuard>
            } />

            {/* Route cho bài viết */}
            <Route path="articles" element={
              <AdminRouteGuard requiredPermission="article:view">
                <ArticleManagement />
              </AdminRouteGuard>
            } />
            <Route path="articles/add" element={
              <AdminRouteGuard requiredPermission="article:create">
                <AddArticlePage />
              </AdminRouteGuard>
            } />
            <Route path="articles/edit/:id" element={
              <AdminRouteGuard requiredPermission="article:update">
                <EditArticlePage />
              </AdminRouteGuard>
            } />

            {/* Route cho người dùng */}
            <Route
              path="user"
              element={
                <AdminRouteGuard requiredPermission="user:view">
                  <UserManagement />
                </AdminRouteGuard>
              }
            />
            <Route path="user/add" element={
              <AdminRouteGuard requiredPermission="user:create">
                <AddUserPage />
              </AdminRouteGuard>
            } />
            <Route path="user/edit/:id" element={
              <AdminRouteGuard requiredPermission="user:update">
                <EditUserPage />
              </AdminRouteGuard>
            } />

            {/* Route cho đơn hàng */}
            <Route path="orders" element={
              <AdminRouteGuard requiredPermission="order:view">
                <OrderManagement />
              </AdminRouteGuard>
            } />

            <Route
              path="inventory"
              element={
                <AdminRouteGuard requiredPermission="serial:view">
                  <InventoryManagement />
                </AdminRouteGuard>
              }
            />
            <Route path="inventory/add" element={
              <AdminRouteGuard requiredPermission="serial:create">
                <AddInventoryReceipt />
              </AdminRouteGuard>
            } />
            <Route path="inventory/edit/:id" element={
              <AdminRouteGuard requiredPermission="serial:update">
                <EditInventoryReceipt />
              </AdminRouteGuard>
            } />

            {/* Permission Management Routes */}
            <Route path="permissions" element={
              <AdminRouteGuard requiredPermission="role:manage">
                <PermissionAdminPanel />
              </AdminRouteGuard>
            } />

            {/* Permission Test Page */}
            <Route path="permission-test" element={<PermissionTestPage />} />
          </Route>
        </Route>

        {/* Permission Demo Routes - Public access for testing */}
        <Route path="/permission-examples" element={<PermissionExamples />} />
      </Route>
    )
  );

  const queryClient = new QueryClient();

  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
    AOS.refresh();

    // Initialize permission watcher in development
    if (process.env.NODE_ENV === 'development') {
      import('./utils/PermissionWatcher').then(({ permissionWatcher }) => {
        permissionWatcher.startWatching();
      });
    }
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <NotificationProvider>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ToastContainer />
          </QueryClientProvider>
        </NotificationProvider>
      </AuthProvider>
      <ScrollToTop smooth={true} className="bg-primary flex justify-center items-center" color="white" width="20px" height="20px" />
    </div>
  );
}

export default App;








