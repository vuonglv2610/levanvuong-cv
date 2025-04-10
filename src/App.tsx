import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthProvider from "contexts/AuthContext";
import Cart from "pages/Cart";
import React, { useEffect } from "react";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import TableManage from "./components/TableManage";
import AdminLayout from "./layouts/Admin";
import ClientLayout from "./layouts/Client";
import { getCookie } from "./libs/getCookie";
import NotFoundPage from "./pages/404";
import Dashboard from "./pages/Dashboard";
import DetailPage from "./pages/Detail";
import LoginPage from "./pages/Login";
import ProductsList from "./pages/Products";
import RegisterPage from "./pages/RegisterPage";
// import "./src/fontawasome.js";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
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
            const token = getCookie("accessToken");
            // if (!token) return redirect("/login");
            return null;
          }}
        >
          <Route index element={<HomePage />} />
          <Route path="/product" element={<ProductsList />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route
          path="admin"
          element={<AdminLayout />}
          //  loader={async () => {
          //check auth role
          // const token = getCookie('accessToken')
          // const userId = getCookie('userId')
          // const res = await get(`/users/${getCookie("userId")}`);
          // const userId = getCookie('userId')
          // if (!token && userId && res?.data?.role === 'admin') return redirect('/')
          // return null
          // }}
        >
          <Route index element={<Dashboard />} />
          <Route
            path="product"
            element={<TableManage url="/products" isShowFooter />}
          />
          <Route path="product/:id" element={<DetailPage />} />
          <Route path="product/edit/:id" element={<DetailPage />} />
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
    </div>
  );
}

export default App;
