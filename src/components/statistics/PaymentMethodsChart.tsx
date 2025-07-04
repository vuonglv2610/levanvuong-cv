import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentMethod {
  method: string;
  count: number;
  amount: number;
  percentage: number;
}

interface PaymentMethodsChartProps {
  data: PaymentMethod[];
  title?: string;
  height?: number;
}

const PaymentMethodsChart: React.FC<PaymentMethodsChartProps> = ({ 
  data, 
  title = "Thống kê phương thức thanh toán", 
  height = 400 
}) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  const methodLabels: { [key: string]: string } = {
    'vnpay': 'VNPay',
    'cash': 'Tiền mặt',
    'bank_transfer': 'Chuyển khoản',
    'credit_card': 'Thẻ tín dụng',
    'debit_card': 'Thẻ ghi nợ',
    'momo': 'MoMo',
    'zalopay': 'ZaloPay'
  };

  const methodColors: { [key: string]: string } = {
    'vnpay': '#1E40AF',
    'cash': '#059669',
    'bank_transfer': '#7C3AED',
    'credit_card': '#DC2626',
    'debit_card': '#EA580C',
    'momo': '#BE185D',
    'zalopay': '#0891B2'
  };

  const chartData = {
    labels: data.map(item => methodLabels[item.method] || item.method),
    datasets: [
      {
        data: data.map(item => item.amount),
        backgroundColor: data.map(item => methodColors[item.method] || '#6B7280'),
        borderColor: '#fff',
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 15,
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
            return [
              `${context.label}: ${formatCurrency(item.amount)}`,
              `Số giao dịch: ${item.count}`,
              `Tỷ lệ: ${item.percentage.toFixed(1)}%`
            ];
          }
        }
      }
    },
  };

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const totalTransactions = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">
            Tổng: {formatCurrency(totalAmount)} • {totalTransactions.toLocaleString()} giao dịch
          </p>
        </div>
      </div>
      
      <div style={{ height: `${height}px` }}>
        <Pie data={chartData} options={options} />
      </div>

      {/* Payment Methods Summary */}
      <div className="mt-6 space-y-3">
        {data.map((item, index) => (
          <div key={item.method} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: methodColors[item.method] || '#6B7280' }}
              ></div>
              <div>
                <div className="font-medium text-slate-800">
                  {methodLabels[item.method] || item.method}
                </div>
                <div className="text-sm text-slate-500">
                  {item.count} giao dịch
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-800">
                {formatCurrency(item.amount)}
              </div>
              <div className="text-sm text-slate-500">
                {item.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalTransactions.toLocaleString()}
            </div>
            <div className="text-sm text-blue-700">Tổng giao dịch</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalAmount)}
            </div>
            <div className="text-sm text-green-700">Tổng giá trị</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(Math.round(totalAmount / totalTransactions))}
            </div>
            <div className="text-sm text-purple-700">Giá trị TB/giao dịch</div>
          </div>
        </div>
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
          </div>
          <p className="text-slate-500 text-lg">Chưa có dữ liệu thanh toán</p>
          <p className="text-slate-400 text-sm mt-2">Dữ liệu sẽ được cập nhật khi có giao dịch mới</p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsChart;
