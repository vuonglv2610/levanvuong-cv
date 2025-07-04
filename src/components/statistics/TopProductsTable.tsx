import React from 'react';

interface TopProduct {
  productId: string;
  name: string;
  sku: string;
  soldQuantity: number;
  revenue: number;
  rank: number;
}

interface TopProductsTableProps {
  data: TopProduct[];
  title?: string;
  limit?: number;
}

const TopProductsTable: React.FC<TopProductsTableProps> = ({ 
  data, 
  title = "Top sản phẩm bán chạy", 
  limit = 10 
}) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  const displayData = data.slice(0, limit);

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">
            Hiển thị {displayData.length} sản phẩm hàng đầu
          </p>
        </div>
        <div className="text-sm text-slate-500">
          Cập nhật: {new Date().toLocaleDateString('vi-VN')}
        </div>
      </div>

      {displayData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Xếp hạng</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Sản phẩm</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Đã bán</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Doanh thu</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-700">Hiệu suất</th>
              </tr>
            </thead>
            <tbody>
              {displayData.map((product, index) => (
                <tr 
                  key={product.productId} 
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200"
                >
                  <td className="py-4 px-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankBadgeColor(product.rank)}`}>
                      #{product.rank}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-slate-800 mb-1">{product.name}</div>
                      <div className="text-sm text-slate-500">SKU: {product.sku}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="font-semibold text-slate-800">{product.soldQuantity}</div>
                    <div className="text-sm text-slate-500">đơn vị</div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="font-semibold text-slate-800">{formatCurrency(product.revenue)}</div>
                    <div className="text-sm text-slate-500">
                      {formatCurrency(Math.round(product.revenue / product.soldQuantity))}/đơn vị
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full" 
                          style={{
                            width: `${Math.min((product.soldQuantity / Math.max(...displayData.map(p => p.soldQuantity))) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-600">
                        {Math.round((product.soldQuantity / Math.max(...displayData.map(p => p.soldQuantity))) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <p className="text-slate-500 text-lg">Chưa có dữ liệu sản phẩm</p>
          <p className="text-slate-400 text-sm mt-2">Dữ liệu sẽ được cập nhật khi có đơn hàng mới</p>
        </div>
      )}

      {/* Summary Stats */}
      {displayData.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {displayData.reduce((sum, product) => sum + product.soldQuantity, 0)}
              </div>
              <div className="text-sm text-blue-700">Tổng số lượng bán</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(displayData.reduce((sum, product) => sum + product.revenue, 0))}
              </div>
              <div className="text-sm text-green-700">Tổng doanh thu</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(Math.round(displayData.reduce((sum, product) => sum + product.revenue, 0) / displayData.reduce((sum, product) => sum + product.soldQuantity, 0)))}
              </div>
              <div className="text-sm text-purple-700">Giá trung bình</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopProductsTable;
