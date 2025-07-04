import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryData {
  categoryId: string;
  name: string;
  productCount: number;
  soldQuantity: number;
  revenue: number;
  percentage: number;
}

interface CategoryStatsProps {
  data: CategoryData[];
  title?: string;
  height?: number;
  showChart?: boolean;
}

const CategoryStats: React.FC<CategoryStatsProps> = ({ 
  data, 
  title = "Thống kê theo danh mục", 
  height = 400,
  showChart = true 
}) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: data.map(item => item.revenue),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Số lượng bán',
        data: data.map(item => item.soldQuantity * 100000), // Scale for visibility
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
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
            if (context.datasetIndex === 0) {
              return `Doanh thu: ${formatCurrency(context.parsed.y)}`;
            } else {
              return `Số lượng: ${(context.parsed.y / 100000).toFixed(0)}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Danh mục',
          font: {
            weight: 'bold' as const
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Doanh thu (VNĐ)',
          font: {
            weight: 'bold' as const
          }
        },
        ticks: {
          callback: function(value: any) {
            return (value / 1000000).toFixed(1) + 'M';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Số lượng bán',
          font: {
            weight: 'bold' as const
          }
        },
        ticks: {
          callback: function(value: any) {
            return (value / 100000).toFixed(0);
          }
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">
            Phân tích hiệu suất theo {data.length} danh mục
          </p>
        </div>
      </div>

      {showChart && data.length > 0 && (
        <div style={{ height: `${height}px` }} className="mb-6">
          <Bar data={chartData} options={options} />
        </div>
      )}

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((category, index) => (
          <div key={category.categoryId} className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors duration-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-800 truncate">{category.name}</h4>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {category.percentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Sản phẩm:</span>
                <span className="font-medium text-slate-800">{category.productCount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Đã bán:</span>
                <span className="font-medium text-slate-800">{category.soldQuantity}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Doanh thu:</span>
                <span className="font-medium text-slate-800">{formatCurrency(category.revenue)}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${category.percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
          <p className="text-slate-500 text-lg">Chưa có dữ liệu danh mục</p>
          <p className="text-slate-400 text-sm mt-2">Dữ liệu sẽ được cập nhật khi có giao dịch mới</p>
        </div>
      )}
    </div>
  );
};

export default CategoryStats;
