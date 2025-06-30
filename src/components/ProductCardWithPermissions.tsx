import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface Product {
  id: string;
  name: string;
  price: number;
  img?: string;
  description?: string;
  categoryName?: string;
  brandName?: string;
}

interface ProductCardWithPermissionsProps {
  product: Product;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ProductCardWithPermissions: React.FC<ProductCardWithPermissionsProps> = ({
  product,
  onEdit,
  onDelete
}) => {
  const { isAdmin, hasApiPermission } = usePermissions();

  const handleEdit = () => {
    if (hasApiPermission('/products/edit/:id', 'PUT')) {
      onEdit?.(product.id);
    } else {
      alert('Bạn không có quyền chỉnh sửa sản phẩm');
    }
  };

  const handleDelete = () => {
    if (hasApiPermission('/products/:id', 'DELETE')) {
      if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        onDelete?.(product.id);
      }
    } else {
      alert('Bạn không có quyền xóa sản phẩm');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          src={product.img || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-blue-600">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
        </div>

        {/* Category and Brand */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.categoryName && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {product.categoryName}
            </span>
          )}
          {product.brandName && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {product.brandName}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Public actions */}
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Xem chi tiết
          </button>
          
          <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            🛒
          </button>

          {/* Admin only actions */}
          {isAdmin() && (
            <>
              {hasApiPermission('/products/edit/:id', 'PUT') && (
                <button
                  onClick={handleEdit}
                  className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                  title="Chỉnh sửa sản phẩm"
                >
                  ✏️
                </button>
              )}
              
              {hasApiPermission('/products/:id', 'DELETE') && (
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  title="Xóa sản phẩm"
                >
                  🗑️
                </button>
              )}
            </>
          )}
        </div>

        {/* Admin Info Panel */}
        {isAdmin() && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">🔧 Admin Panel</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>ID: {product.id}</div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  hasApiPermission('/products/edit/:id', 'PUT') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {hasApiPermission('/products/edit/:id', 'PUT') ? '✓ Có quyền sửa' : '✗ Không có quyền sửa'}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  hasApiPermission('/products/:id', 'DELETE') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {hasApiPermission('/products/:id', 'DELETE') ? '✓ Có quyền xóa' : '✗ Không có quyền xóa'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCardWithPermissions;
