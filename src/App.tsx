import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthProvider from "contexts/AuthContext";
import AddCategoryPage from "pages/admin/AddCategoryPage";
import AddProductPage from "pages/admin/AddProductPage";
import EditCategoryPage from "pages/admin/EditCategoryPage";
import EditProductPage from "pages/admin/EditProductPage";
import Cart from "pages/Cart";
import React, { useEffect } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";
import "./App.css";
import HomePage from "./components/HomePage";
import TableManage from "./components/TableManage";
import AdminLayout from "./layouts/Admin";
import ClientLayout from "./layouts/Client";
import NotFoundPage from "./pages/404";
import Dashboard from "./pages/Dashboard";
import DetailPage from "./pages/Detail";
import LoginPage from "./pages/Login";
import ProductsList from "./pages/Products";
import RegisterPage from "./pages/RegisterPage";
// import "./src/fontawasome.js";

// Thêm import cho các trang quản lý người dùng
import AddUserPage from "pages/admin/AddUserPage";
import EditUserPage from "pages/admin/EditUserPage";
import UserManagement from "pages/admin/UserManagement";
import Checkout from "pages/Checkout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ChangePasswordPage from "./pages/admin/ChangePasswordPage";
import ProfilePage from "./pages/admin/ProfilePage";

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
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
          <Route
            path="admin"
            element={<AdminLayout />}
          // loader={async () => {
          // check auth role
          // const token = getCookie('accessToken')
          // const userId = getCookie('userId')
          // const res = await get(`/users/${getCookie("userId")}`);
          // if (!token || userId && res?.data?.role === 'admin') return redirect('/')
          // return null
          // }}
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
            
            {/* Route cho sản phẩm */}
            <Route
              path="product"
              element={
                <TableManage 
                  url="/products" 
                  isShowFooter={true}
                  title="Quản lý sản phẩm"
                  addButtonText="Thêm sản phẩm mới"
                  addPath="/admin/product/add"
                  editPath="/admin/product/edit"
                  columns={[
                    { key: "name", header: "Tên sản phẩm", render: (item) => (
                      <span className="font-medium text-gray-900">{item?.name || "Không có tên"}</span>
                    )},
                    { key: "img", header: "Hình ảnh", render: (item) => (
                      <div className="w-16 h-16 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                        <img
                          src={item?.img || "https://via.placeholder.com/64x64?text=No+Image"}
                          alt={item?.name || "Product image"}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Image';
                          }}
                        />
                      </div>
                    )},
                    { key: "price", header: "Giá", render: (item) => (
                      <span className="font-medium">
                        {typeof item?.price === 'number'
                          ? item.price.toLocaleString('vi-VN') + '₫'
                          : item?.price || "Chưa có giá"}
                      </span>
                    )},
                    // Thêm column cho danh mục
                    { key: "category", header: "Danh mục", render: (item) => (
                      <span className="text-gray-600">
                        {item?.category?.name || "Không có danh mục"}
                      </span>
                    )}
                  ]}
                  filterOptions={{ showCategoryFilter: true }}
                />
              }
            />
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
                    { key: "name", header: "Tên danh mục", render: (item) => (
                      <span className="font-medium text-gray-900">{item?.name || "Không có tên"}</span>
                    )},
                    { key: "description", header: "Mô tả", render: (item) => (
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
            
            {/* Route cho người dùng */}
            <Route
              path="user"
              element={<UserManagement />}
            />
            <Route path="user/add" element={<AddUserPage />} />
            <Route path="user/edit/:id" element={<EditUserPage />} />
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
