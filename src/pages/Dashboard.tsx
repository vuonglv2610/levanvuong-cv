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
import DateRangeFilter, { DateRange } from 'components/common/DateRangeFilter';
import ExportButton from 'components/common/ExportButton';
import { useAllStatistics } from 'hooks/useStatisticsWithDateRange';
import React, { useEffect, useRef, useState } from "react";
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  extractCategoriesData,
  extractDashboardData,
  extractOrdersData,
  extractPaymentMethodsData,
  extractRevenueData,
  extractTopProductsData
} from 'utils/apiResponseHelper';

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
  productId: string;
  name: string;
  sku: string;
  soldQuantity: number;
  revenue: number;
  rank: number;
}

// Interface cho Dashboard Stats
interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
  topSellingProduct: {
    name: string;
    soldQuantity: number;
  };
}



const Dashboard = () => {
  // Thêm ref cho dashboard container
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // Use the new hook for all statistics with date range
  const {
    dateRange,
    setDateRange,
    isLoading,
    data: statisticsData
  } = useAllStatistics();

  // State với kiểu dữ liệu rõ ràng
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    customerGrowth: 0,
    topSellingProduct: {
      name: '',
      soldQuantity: 0
    }
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

  const [ordersData, setOrdersData] = useState<any>({
    labels: [],
    datasets: []
  });

  const [paymentMethodsData, setPaymentMethodsData] = useState<any>({
    labels: [],
    datasets: []
  });

  const [topProducts, setTopProducts] = useState<Product[]>([]);

  // Handle date range change
  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
  };

  // Cập nhật dashboard stats từ API
  useEffect(() => {
    console.log('Dashboard data full:', statisticsData.dashboard);

    const dashboardData = extractDashboardData(statisticsData.dashboard);
    if (dashboardData) {
      console.log('Extracted dashboard data:', dashboardData);
      setStats(dashboardData);
    }
  }, [statisticsData.dashboard]);

  // Cập nhật revenue chart từ API
  useEffect(() => {
    console.log('Revenue data full:', statisticsData.revenue);

    // Xử lý cấu trúc response thực tế
    const revenueData = extractRevenueData(statisticsData.revenue);

    if (revenueData && revenueData.length > 0) {
      console.log('Extracted revenue data:', revenueData);
      console.log('Raw revenue item:', revenueData[0]); // Log chi tiết item đầu tiên
      
      const periods = revenueData.map((item: any) => {
        // Convert period format from "2025-07" to "T7"
        if (item.period && item.period.includes('-')) {
          const month = item.period.split('-')[1];
          return `T${parseInt(month)}`;
        }
        return item.period || 'N/A';
      });
      
      // Đảm bảo lấy đúng giá trị revenue từ cấu trúc API
      const revenues = revenueData.map((item: any) => {
        console.log('Revenue item:', item);
        // Kiểm tra tất cả các trường có thể chứa revenue
        return item.revenue || item.total_revenue || 0;
      });
      
      const orderCounts = revenueData.map((item: any) => 
        item.orderCount || item.total_transactions || 0
      );

      console.log('Processed data:', { periods, revenues, orderCounts });

      setRevenueData({
        labels: periods,
        datasets: [
          {
            label: 'Doanh thu (VNĐ)',
            data: revenues,
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
          }
        ]
      });

      setSalesData({
        labels: periods,
        datasets: [
          {
            label: 'Đơn hàng',
            data: orderCounts,
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(249, 115, 22, 0.8)',
              'rgba(168, 85, 247, 0.8)',
              'rgba(236, 72, 153, 0.8)',
              'rgba(139, 69, 19, 0.8)',
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(59, 130, 246)',
              'rgb(249, 115, 22)',
              'rgb(168, 85, 247)',
              'rgb(236, 72, 153)',
              'rgb(139, 69, 19)',
            ],
            borderWidth: 2,
          }
        ]
      });
    }
  }, [statisticsData.revenue]);

  // Cập nhật top products từ API
  useEffect(() => {
    console.log('Top products data full:', statisticsData.topProducts);

    const productsData = extractTopProductsData(statisticsData.topProducts);
    if (productsData && productsData.length > 0) {
      console.log('Extracted products data:', productsData);
      setTopProducts(productsData);
    }
  }, [statisticsData.topProducts]);

  // Cập nhật category chart từ API
  useEffect(() => {
    console.log('Categories data full:', statisticsData.categories);

    const categoriesData = extractCategoriesData(statisticsData.categories);
    if (categoriesData && categoriesData.length > 0) {
      console.log('Extracted categories data:', categoriesData);
      const labels = categoriesData.map((cat: any) => cat.name);
      const data = categoriesData.map((cat: any) => cat.revenue); // Sử dụng revenue thay vì percentage
      const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
      ];

      setCategoryData({
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      });
    } else {
      // Nếu không có dữ liệu, hiển thị thông báo
      console.log('No category data available');
      setCategoryData({
        labels: ['Không có dữ liệu'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#E5E7EB'],
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      });
    }
  }, [statisticsData.categories]);

  // Cập nhật orders chart từ API
  useEffect(() => {
    console.log('Orders data full:', statisticsData.orders);

    const ordersApiData = extractOrdersData(statisticsData.orders);
    if (ordersApiData && ordersApiData.length > 0) {
      console.log('Extracted orders data:', ordersApiData);

      // Tạo labels với tên trạng thái tiếng Việt
      const statusLabels: { [key: string]: string } = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'confirmed': 'Đã xác nhận',
        'shipped': 'Đã gửi hàng',
        'delivered': 'Đã giao hàng',
        'cancelled': 'Đã hủy'
      };

      const labels = ordersApiData.map((order: any) => statusLabels[order.status] || order.status);
      const data = ordersApiData.map((order: any) => order.count);
      const colors = [
        '#FFA726', // pending - orange
        '#42A5F5', // processing - blue
        '#66BB6A', // confirmed - green
        '#AB47BC', // shipped - purple
        '#26C6DA', // delivered - cyan
        '#EF5350'  // cancelled - red
      ];

      setOrdersData({
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      });
    } else {
      // Nếu không có dữ liệu
      console.log('No orders data available');
      setOrdersData({
        labels: ['Không có dữ liệu'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#E5E7EB'],
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      });
    }
  }, [statisticsData.orders]);

  // Cập nhật payment methods chart từ API
  useEffect(() => {
    console.log('Payment methods data full:', statisticsData.paymentMethods);

    const paymentApiData = extractPaymentMethodsData(statisticsData.paymentMethods);
    if (paymentApiData && paymentApiData.length > 0) {
      console.log('Extracted payment methods data:', paymentApiData);

      const labels = paymentApiData.map((payment: any) => payment.methodLabel);
      const data = paymentApiData.map((payment: any) => payment.amount);
      const colors = [
        '#FF6B6B', // VNPay - red
        '#4ECDC4', // MoMo - teal
        '#45B7D1', // ZaloPay - blue
        '#96CEB4', // Cash - green
        '#FFEAA7', // Bank transfer - yellow
        '#DDA0DD', // Credit card - plum
        '#98D8C8'  // Debit card - mint
      ];

      setPaymentMethodsData({
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors.slice(0, labels.length),
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      });
    } else {
      // Nếu không có dữ liệu
      console.log('No payment methods data available');
      setPaymentMethodsData({
        labels: ['Không có dữ liệu'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#E5E7EB'],
            borderWidth: 2,
            borderColor: '#fff'
          }
        ]
      });
    }
  }, [statisticsData.paymentMethods]);

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
        text: 'Đơn hàng theo tháng',
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Đang tải dữ liệu thống kê...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500">Tổng quan về hoạt động kinh doanh</p>
        </div>
        
        <div className="flex items-center gap-4">
          <DateRangeFilter 
            onDateRangeChange={setDateRange}
            initialStartDate={dateRange.startDate}
            initialEndDate={dateRange.endDate}
          />
          
          <ExportButton 
            data={stats} 
            filename="dashboard-report" 
            title="Báo cáo thống kê doanh thu"
            dashboardRef={dashboardRef}
            dateRange={dateRange}
          />
        </div>
      </div>
      
      {/* Wrap dashboard content with ref */}
      <div ref={dashboardRef}>
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
              {/* <div className="text-right">
                <div className="text-sm text-green-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                  </svg>
                  +12%
                </div>
              </div> */}
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Tổng sản phẩm</h3>
              <p className="text-3xl font-bold text-slate-800 mb-2">{stats.totalProducts}</p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Tăng trưởng: +{stats.revenueGrowth.toFixed(1)}%</p>
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
              {/* <div className="text-right">
                <div className="text-sm text-green-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                  </svg>
                  +8%
                </div>
              </div> */}
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Tổng khách hàng</h3>
              <p className="text-3xl font-bold text-slate-800 mb-2">{stats.totalCustomers}</p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: `${Math.min(stats.customerGrowth * 5, 100)}%`}}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Tăng trưởng: +{stats.customerGrowth.toFixed(1)}%</p>
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
              {/* <div className="text-right">
                <div className="text-sm text-green-600 font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
                  </svg>
                  +15%
                </div>
              </div> */}
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Tổng đơn hàng</h3>
              <p className="text-3xl font-bold text-slate-800 mb-2">{stats.totalOrders}</p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{width: `${Math.min(stats.orderGrowth * 5, 100)}%`}}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Tăng trưởng: +{stats.orderGrowth.toFixed(1)}%</p>
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
                <div className={`text-sm font-medium flex items-center ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d={stats.revenueGrowth >= 0 
                        ? "M7 11l5-5m0 0l5 5m-5-5v12" // arrow up
                        : "M7 13l5 5m0 0l5-5m-5 5V6"   // arrow down
                      }
                    />
                  </svg>
                  {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}%
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-1">Tổng doanh thu</h3>
              <p className="text-3xl font-bold text-slate-800 mb-2">{formatCurrency(stats.totalRevenue)}</p>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: `${Math.min(stats.revenueGrowth * 4, 100)}%`}}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">Tăng trưởng: +{stats.revenueGrowth.toFixed(1)}%</p>
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

          {/* Orders Status Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Trạng thái đơn hàng</h3>
                <p className="text-sm text-slate-500">Phân bố đơn hàng theo trạng thái</p>
              </div>
            </div>
            <div className="h-80">
              <Doughnut data={ordersData} options={doughnutOptions} />
            </div>
          </div>

          {/* Payment Methods Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Phương thức thanh toán</h3>
                <p className="text-sm text-slate-500">Phân bố theo phương thức thanh toán</p>
              </div>
            </div>
            <div className="h-80">
              <Doughnut data={paymentMethodsData} options={doughnutOptions} />
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
              {topProducts.length > 0 ? topProducts.map((product, index) => (
                <div key={product.productId} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                      index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                      index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                      'bg-gradient-to-r from-blue-400 to-blue-500'
                    }`}>
                      #{product.rank}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">{product.name}</div>
                      <div className="text-sm text-slate-500">SKU: {product.sku} • {product.soldQuantity} đã bán</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800">{formatCurrency(product.revenue)}</div>
                    <div className="text-sm text-blue-600 font-medium">
                      Rank #{product.rank}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Chưa có dữ liệu sản phẩm bán chạy</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;









