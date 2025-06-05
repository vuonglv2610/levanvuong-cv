import { useQuery } from "@tanstack/react-query";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import React, { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { get } from "services/api";

// Đăng ký các thành phần Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: number;
  name: string;
  sales: number;
  revenue: number;
}

const Dashboard = () => {
  // State với kiểu dữ liệu rõ ràng
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  // Sử dụng any thay vì ChartData
  const [revenueData, setRevenueData] = useState<any>({
    labels: [],
    datasets: []
  });

  const [topProducts, setTopProducts] = useState<Product[]>([]);

  // Fetch data
  const { data: productsData, isLoading: productsLoading } = useQuery({ 
    queryKey: ['/products'],
    queryFn: () => get('/products')
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({ 
    queryKey: ['/users'],
    queryFn: () => get('/users')
  });

  // Cập nhật dữ liệu biểu đồ
  useEffect(() => {
    const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'];
    const revenueByMonth = [1500000, 2200000, 1800000, 2400000, 2100000, 2700000];
    
    setRevenueData({
      labels: months,
      datasets: [
        {
          label: 'Doanh thu',
          data: revenueByMonth,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
          tension: 0.3,
        }
      ]
    });

    // Giả lập dữ liệu top sản phẩm
    setTopProducts([
      { id: 1, name: 'iPhone 14 Pro Max', sales: 42, revenue: 63000000 },
      { id: 2, name: 'Samsung Galaxy S23', sales: 38, revenue: 49400000 },
      { id: 3, name: 'MacBook Pro M2', sales: 25, revenue: 87500000 },
    ]);
  }, []);

  // Cập nhật thống kê
  useEffect(() => {
    if (productsData?.data?.result?.data && usersData?.data) {
      setStats({
        totalProducts: productsData.data.result.data.length || 0,
        totalUsers: usersData.data.length || 0,
        totalOrders: 156,
        totalRevenue: 31500000
      });
    }
  }, [productsData, usersData]);

  // Sử dụng any thay vì ChartOptions
  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Doanh thu theo tháng',
      },
    },
  };

  if (productsLoading || usersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Biểu đồ đơn giản nhất để kiểm tra
  return (
    <div className="chart-container" style={{ height: '300px', width: '100%' }}>
      <Line 
        data={revenueData}
        options={options}
      />
    </div>
  );
};

export default Dashboard;



