import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface DetailedReportProps {
  data: any;
  period: string;
}

const DetailedReport: React.FC<DetailedReportProps> = ({ data, period }) => {
  return (
    <div className="p-8 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Báo cáo thống kê chi tiết</h1>
        <p className="text-gray-500">Kỳ báo cáo: {period}</p>
        <p className="text-gray-500">Ngày xuất báo cáo: {new Date().toLocaleDateString('vi-VN')}</p>
      </div>

      {/* Tổng quan */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Tổng quan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Tổng doanh thu</h3>
            <p className="text-xl font-bold">{formatCurrency(data.totalRevenue)}</p>
            <p className={`text-sm ${data.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.revenueGrowth >= 0 ? '+' : ''}{data.revenueGrowth.toFixed(1)}%
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Tổng đơn hàng</h3>
            <p className="text-xl font-bold">{data.totalOrders}</p>
            <p className={`text-sm ${data.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.orderGrowth >= 0 ? '+' : ''}{data.orderGrowth.toFixed(1)}%
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Tổng khách hàng</h3>
            <p className="text-xl font-bold">{data.totalCustomers}</p>
            <p className={`text-sm ${data.customerGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.customerGrowth >= 0 ? '+' : ''}{data.customerGrowth.toFixed(1)}%
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500">Tổng sản phẩm</h3>
            <p className="text-xl font-bold">{data.totalProducts}</p>
          </div>
        </div>
      </div>

      {/* Thêm các phần khác của báo cáo tùy theo nhu cầu */}
      
      <div className="text-center text-gray-500 text-sm mt-8">
        <p>© {new Date().getFullYear()} - Báo cáo được tạo tự động từ hệ thống</p>
      </div>
    </div>
  );
};

export default DetailedReport;
