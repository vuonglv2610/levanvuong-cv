import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface OrderStatus {
  status: string;
  count: number;
  percentage: number;
}

interface OrdersChartProps {
  data: OrderStatus[];
  title?: string;
  height?: number;
}

const OrdersChart: React.FC<OrdersChartProps> = ({ 
  data, 
  title = "Thống kê đơn hàng theo trạng thái", 
  height = 400 
}) => {
  const statusLabels: { [key: string]: string } = {
    'pending': 'Chờ xử lý',
    'confirmed': 'Đã xác nhận',
    'processing': 'Đang xử lý',
    'shipped': 'Đã gửi hàng',
    'delivered': 'Đã giao hàng',
    'cancelled': 'Đã hủy',
    'returned': 'Đã trả hàng'
  };

  const statusColors: { [key: string]: string } = {
    'pending': '#FFA500',
    'confirmed': '#4169E1',
    'processing': '#32CD32',
    'shipped': '#FF6347',
    'delivered': '#228B22',
    'cancelled': '#DC143C',
    'returned': '#8B4513'
  };

  const chartData = {
    labels: data.map(item => statusLabels[item.status] || item.status),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: data.map(item => statusColors[item.status] || '#6B7280'),
        borderColor: '#fff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 10,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          }
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            const item = data[context.dataIndex];
            return `${context.label}: ${item.count} đơn (${item.percentage.toFixed(1)}%)`;
          }
        }
      }
    },
    cutout: '50%',
  };

  const totalOrders = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">Tổng số đơn hàng: {totalOrders.toLocaleString()}</p>
        </div>
      </div>
      
      <div style={{ height: `${height}px` }}>
        <Doughnut data={chartData} options={options} />
      </div>

      {/* Statistics Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={item.status} className="text-center p-3 bg-slate-50 rounded-lg">
            <div 
              className="w-4 h-4 rounded-full mx-auto mb-2"
              style={{ backgroundColor: statusColors[item.status] || '#6B7280' }}
            ></div>
            <div className="text-sm font-medium text-slate-700">
              {statusLabels[item.status] || item.status}
            </div>
            <div className="text-lg font-bold text-slate-800">{item.count}</div>
            <div className="text-xs text-slate-500">{item.percentage.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersChart;
