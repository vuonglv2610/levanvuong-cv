import React, { useEffect } from 'react';
import './App.css';
import "aos/dist/aos.css";
import AOS from 'aos';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, redirect } from "react-router-dom";
import LoginPage from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import ClientLayout from './layouts/Client';
import { getCookie } from './libs/getCookie';
import HomePage from './components/HomePage';
import ProductsList from './pages/Products';
import Gallery from './components/Gallery';
import NotFoundPage from './pages/404';
import AdminLayout from './layouts/Admin';
import Dashboard from './pages/Dashboard';
import TableManage from './components/TableManage';
import DetailPage from './pages/Detail';
import AuthProvider from 'contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/' element={<ClientLayout />} loader={() => {
          const token = getCookie('accessToken')
          if (!token) return redirect('/login')
          return null
        }}>
          <Route index element={<HomePage />} />
          <Route path='/product' element={<ProductsList />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/404' element={<NotFoundPage />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}
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
          <Route path="product" element={<TableManage url="/products" isShowFooter/>} />
          <Route path="product/:id" element={<DetailPage />} />
          <Route path="product/edit/:id" element={<DetailPage />} />
        </Route>
      </Route>
    )
  );

  const queryClient = new QueryClient()

  useEffect(() => {
    AOS.init({
      duration: 1000
    });
    AOS.refresh();
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <QueryClientProvider client={queryClient} >
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
