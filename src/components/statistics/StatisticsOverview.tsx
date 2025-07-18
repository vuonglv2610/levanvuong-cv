import DateRangeFilter from 'components/common/DateRangeFilter';
import { useAllStatistics } from 'hooks/useStatisticsWithDateRange';
import React from 'react';
import {
  extractCategoriesData,
  extractDashboardData,
  extractOrdersData,
  extractPaymentMethodsData,
  extractTopProductsData
} from 'utils/apiResponseHelper';
import CategoryStats from './CategoryStats';
import OrdersChart from './OrdersChart';
import PaymentMethodsChart from './PaymentMethodsChart';
import RevenueChart from './RevenueChart';
import TopProductsTable from './TopProductsTable';

const StatisticsOverview: React.FC = () => {
  const { 
    dateRange, 
    setDateRange, 
    isLoading, 
    refetchAll, 
    data: statisticsData 
  } = useAllStatistics();

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  const handleRefreshAll = () => {
    refetchAll();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Thống kê chi tiết 📊</h1>
            <p className="text-blue-100 text-lg">Phân tích dữ liệu kinh doanh và hiệu suất bán hàng</p>
          </div>
          <div className="hidden md:block">
            <button
              onClick={handleRefreshAll}
              disabled={isLoading}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors duration-200 disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span className="text-sm font-medium">Làm mới</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Filter */}
      <DateRangeFilter
        onDateRangeChange={setDateRange}
        initialStartDate={dateRange.startDate}
        initialEndDate={dateRange.endDate}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu thống kê...</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Tổng doanh thu</p>
              <p className="text-2xl font-bold text-slate-800">
                {(() => {
                  // Xử lý cấu trúc response thực tế
                  const dashboardData = statisticsData.dashboard?.data?.result?.data;
                  
                  // Ưu tiên dữ liệu period nếu có
                  if (dashboardData?.period?.revenue) {
                    return formatCurrency(dashboardData.period.revenue);
                  }
                  
                  // Fallback về dữ liệu revenue hoặc tính tổng từ revenue API
                  const revenueData = statisticsData.revenue?.data?.result?.data;
                  let totalRevenue = 0;
                  
                  if (revenueData && Array.isArray(revenueData)) {
                    totalRevenue = revenueData.reduce((sum, item) => sum + (item.total_revenue || 0), 0);
                  } else {
                    totalRevenue = dashboardData?.revenue?.year || dashboardData?.revenue?.month || 0;
                  }

                  return formatCurrency(totalRevenue);
                })()}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-slate-800">
                {(() => {
                  // Xử lý cấu trúc response thực tế
                  const dashboardData = statisticsData.dashboard?.data?.result?.data;
                  const ordersData = statisticsData.orders?.data?.result?.data;
                  const revenueData = statisticsData.revenue?.data?.result?.data;

                  // Tính tổng orders từ revenue API hoặc lấy từ dashboard
                  let totalOrders = 0;
                  if (revenueData && Array.isArray(revenueData)) {
                    totalOrders = revenueData.reduce((sum, item) => sum + (item.total_transactions || 0), 0);
                  } else {
                    totalOrders = ordersData?.totalOrders || dashboardData?.orders?.total || 0;
                  }

                  return totalOrders.toLocaleString();
                })()}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Giá trị TB/đơn</p>
              <p className="text-2xl font-bold text-slate-800">
                {(() => {
                  // Tính giá trị trung bình từ dữ liệu có sẵn
                  const dashboardData = statisticsData.dashboard?.data?.result?.data;
                  const revenueData = statisticsData.revenue?.data?.result?.data;

                  let totalRevenue = 0;
                  let totalOrders = 0;

                  if (revenueData && Array.isArray(revenueData)) {
                    totalRevenue = revenueData.reduce((sum, item) => sum + (item.total_revenue || 0), 0);
                    totalOrders = revenueData.reduce((sum, item) => sum + (item.total_transactions || 0), 0);
                  } else {
                    totalRevenue = dashboardData?.revenue?.year || dashboardData?.revenue?.month || 0;
                    totalOrders = dashboardData?.orders?.total || 0;
                  }

                  const avgValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
                  return formatCurrency(avgValue);
                })()}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Sản phẩm bán chạy</p>
              <p className="text-2xl font-bold text-slate-800">
                {(() => {
                  // Lấy số lượng sản phẩm từ dashboard data hoặc top products
                  const dashboardData = extractDashboardData(statisticsData.dashboard);
                  const topProductsData = extractTopProductsData(statisticsData.topProducts);

                  return dashboardData?.totalProducts || topProductsData?.length || 0;
                })()}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-xl">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      {(() => {
        const revenueData = statisticsData.revenue?.data?.result?.data || [];
        // Chuyển đổi format dữ liệu để phù hợp với RevenueChart component
        const chartData = Array.isArray(revenueData) ? revenueData.map(item => ({
          period: item.period,
          revenue: item.total_revenue,
          orderCount: item.total_transactions
        })) : [];

        return chartData.length > 0 && (
          <RevenueChart
            data={chartData}
            title="Biểu đồ doanh thu theo thời gian"
            height={500}
          />
        );
      })()}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Orders Chart */}
        {(() => {
          const ordersData = extractOrdersData(statisticsData.orders);
          return ordersData.length > 0 && (
            <OrdersChart
              data={ordersData}
              title="Phân bố đơn hàng theo trạng thái"
              height={400}
            />
          );
        })()}

        {/* Payment Methods Chart */}
        {(() => {
          const paymentData = extractPaymentMethodsData(statisticsData.paymentMethods);
          return paymentData.length > 0 && (
            <PaymentMethodsChart
              data={paymentData}
              title="Thống kê phương thức thanh toán"
              height={400}
            />
          );
        })()}
      </div>

      {/* Category Statistics */}
      {(() => {
        const categoriesData = extractCategoriesData(statisticsData.categories);
        return categoriesData.length > 0 && (
          <CategoryStats
            data={categoriesData}
            title="Thống kê hiệu suất theo danh mục"
            height={400}
            showChart={true}
          />
        );
      })()}

      {/* Top Products Table */}
      {(() => {
        const productsData = extractTopProductsData(statisticsData.topProducts);
        return productsData.length > 0 && (
          <TopProductsTable
            data={productsData}
            title="Bảng xếp hạng sản phẩm bán chạy"
            limit={10}
          />
        );
      })()}
    </div>
  );
};

export default StatisticsOverview;


