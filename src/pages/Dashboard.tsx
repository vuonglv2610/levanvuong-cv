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
import { Bar, Doughnut, Line } from 'react-chartjs-2';
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

  // Dữ liệu cho các biểu đồ
  const [revenueData, setRevenueData] = useState<any>({
    labels: [],
    datasets: []
  });

  const [salesData, setSalesData] = useState<any>({
    labels: [],
    datasets: []
  });

  const [categoryData, setCategoryData] = useState<any>({
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
    // Dữ liệu doanh thu theo tháng
    const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const revenueByMonth = [1500000, 2200000, 1800000, 2400000, 2100000, 2700000, 3100000, 2900000, 3300000, 3500000, 3200000, 3800000];

    setRevenueData({
      labels: months,
      datasets: [
        {
          label: 'Doanh thu (VNĐ)',
          data: revenueByMonth,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ]
    });

    // Dữ liệu bán hàng theo tuần
    const weeks = ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'];
    const salesByWeek = [45, 52, 38, 61];

    setSalesData({
      labels: weeks,
      datasets: [
        {
          label: 'Đơn hàng',
          data: salesByWeek,
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(168, 85, 247, 0.8)',
          ],
          borderColor: [
            'rgb(34, 197, 94)',
            'rgb(59, 130, 246)',
            'rgb(249, 115, 22)',
            'rgb(168, 85, 247)',
          ],
          borderWidth: 2,
        }
      ]
    });

    // Dữ liệu phân bố theo danh mục
    setCategoryData({
      labels: ['Điện thoại', 'Laptop', 'Tablet', 'Phụ kiện', 'Khác'],
      datasets: [
        {
          data: [35, 25, 15, 20, 5],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    });

    // Giả lập dữ liệu top sản phẩm
    setTopProducts([
      { id: 1, name: 'iPhone 15 Pro Max', sales: 142, revenue: 213000000 },
      { id: 2, name: 'Samsung Galaxy S24 Ultra', sales: 98, revenue: 147000000 },
      { id: 3, name: 'MacBook Pro M3', sales: 67, revenue: 201000000 },
      { id: 4, name: 'iPad Pro 12.9"', sales: 54, revenue: 135000000 },
      { id: 5, name: 'AirPods Pro 2', sales: 89, revenue: 44500000 },
    ]);
  }, []);

  // Cập nhật thống kê
  useEffect(() => {
    if (productsData?.data?.result?.data && usersData?.data) {
      setStats({
        totalProducts: productsData.data.result.data.length || 0,
        totalUsers: usersData.data.length || 0,
        totalOrders: 1247,
        totalRevenue: 2847500000
      });
    }
  }, [productsData, usersData]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  // Chart options
  const lineOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Doanh thu theo tháng',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return (value / 1000000).toFixed(1) + 'M';
          }
        }
      }
    }
  };

  const barOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Đơn hàng theo tuần',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  const doughnutOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Phân bố sản phẩm theo danh mục',
        font: {
          size: 16,
          weight: 'bold'
        }
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

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại! 👋</h1>
            <p className="text-blue-100 text-lg">Đây là tổng quan về hoạt động kinh doanh của bạn hôm nay</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-sm text-blue-100">Hôm nay</div>
              <div className="text-2xl font-bold">{new Date().toLocaleDateString('vi-VN')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-600 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                </svg>
                +12%
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Tổng sản phẩm</h3>
            <p className="text-3xl font-bold text-slate-800 mb-2">{stats.totalProducts}</p>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">75% mục tiêu tháng</p>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
              </svg>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-600 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                </svg>
                +8%
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Tổng người dùng</h3>
            <p className="text-3xl font-bold text-slate-800 mb-2">{stats.totalUsers}</p>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">60% người dùng hoạt động</p>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-600 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                </svg>
                +15%
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Tổng đơn hàng</h3>
            <p className="text-3xl font-bold text-slate-800 mb-2">{stats.totalOrders}</p>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{width: '85%'}}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">85% đơn hàng hoàn thành</p>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-600 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                </svg>
                +22%
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Tổng doanh thu</h3>
            <p className="text-3xl font-bold text-slate-800 mb-2">{formatCurrency(stats.totalRevenue)}</p>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '90%'}}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">90% mục tiêu doanh thu</p>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Doanh thu theo tháng</h3>
              <p className="text-sm text-slate-500">Biểu đồ doanh thu 12 tháng gần nhất</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-xs text-slate-600">Doanh thu</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <Line data={revenueData} options={lineOptions} />
          </div>
        </div>

        {/* Sales Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Đơn hàng theo tháng</h3>
              <p className="text-sm text-slate-500">Thống kê số lượng đơn hàng</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-slate-600">Đơn hàng</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <Bar data={salesData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Phân bố danh mục</h3>
              <p className="text-sm text-slate-500">Tỷ lệ sản phẩm theo danh mục</p>
            </div>
          </div>
          <div className="h-80">
            <Doughnut data={categoryData} options={doughnutOptions} />
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Sản phẩm bán chạy</h3>
              <p className="text-sm text-slate-500">Top 5 sản phẩm có doanh số cao nhất</p>
            </div>
            <div className="text-sm text-slate-500">
              Cập nhật: {new Date().toLocaleDateString('vi-VN')}
            </div>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                    index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                    'bg-gradient-to-r from-blue-400 to-blue-500'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{product.name}</div>
                    <div className="text-sm text-slate-500">{product.sales} đã bán</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">{formatCurrency(product.revenue)}</div>
                  <div className="text-sm text-green-600 font-medium">
                    +{Math.floor(Math.random() * 20 + 5)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Thao tác nhanh</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => {
              // Demo notification
              const notification = {
                id: Math.random().toString(36).substr(2, 9),
                type: 'success' as const,
                title: 'Thành công!',
                message: 'Sản phẩm đã được thêm thành công',
                timestamp: new Date(),
                duration: 5000
              };
              console.log('Demo notification:', notification);
            }}
            className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 group"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">Thêm sản phẩm</span>
          </button>

          <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200 group">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">Xem đơn hàng</span>
          </button>

          <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200 group">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">Quản lý user</span>
          </button>

          <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors duration-200 group">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">Báo cáo</span>
          </button>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default Dashboard;



