import { useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "hooks/useToast";
import { getCookie } from "libs/getCookie";
import React from "react";
import { Link } from "react-router-dom";
import { get, post } from "services/api";

// Product interface definition
interface Product {
  id: string;
  name: string;
  price: number;
  img?: string;
  description?: string;
  quantity: number;
  sku?: string;
  categoryId?: string;
  brandId?: string;
  brand_name?: string;
  category_name?: string;
  categoryName?: string;
  brandName?: string;
  isNew?: boolean;
  discount?: number;
  originalPrice?: number;
  oldPrice?: number;
  rating?: number;
}

const ProductsList = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  // Fetch products from API
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['/products'],
    queryFn: () => get('/products'),
    staleTime: 60000,
  });

  const products: Product[] = productsData?.data?.result?.data || [];

  // Limit to 6 products for homepage
  const displayProducts: Product[] = products.slice(0, 6);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const userId = getCookie("userId");

    if (!userId) {
      toast.info("Thông báo", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      window.location.href = "/login";
      return;
    }

    // Kiểm tra số lượng trong kho
    if (product.quantity === 0) {
      toast.error("Lỗi", "Sản phẩm đã hết hàng");
      return;
    }

    try {
      await post(`/shoppingcart`, {
        product_id: product.id,
        customer_id: userId,
        quantity: 1
      });

      // Invalidate cart cache để cập nhật số lượng trong Header
      queryClient.invalidateQueries({ queryKey: ['/shoppingcart/customer', userId] });

      toast.success("Thành công", `Đã thêm ${product.name} vào giỏ hàng!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Main Content */}
      <div className="container mx-auto px-4">


        {/* Products Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product: Product, index: number) => (
              <div key={product.id || index} className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 flex flex-col h-full">
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-square w-full bg-gray-50 overflow-hidden">
                      <img
                        src={product.img || 'https://via.placeholder.com/300x300?text=No+Image'}
                        alt={product.name || 'Product image'}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
                        }}
                      />
                    </div>
                  </Link>

                  {/* Badges */}
                  {product.isNew && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                      Mới
                    </div>
                  )}
                  {product.discount && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                      -{product.discount}%
                    </div>
                  )}

                  {/* Out of Stock Badge */}
                  {product.quantity === 0 && (
                    <div className="absolute bottom-3 left-3 bg-gray-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                      Hết hàng
                    </div>
                  )}

                  {/* Quick Add Button - Hiện khi hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.quantity === 0}
                      className={`px-4 py-2 rounded-lg font-medium shadow-lg transition-colors transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 ${
                        product.quantity === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-white text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      {product.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name || 'Tên sản phẩm'}
                    </h3>
                  </Link>

                  <div className="text-sm text-gray-500 mb-3">
                    <span>{product.categoryName || 'Danh mục'}</span>
                    {product.brandName && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{product.brandName}</span>
                      </>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-lg font-bold text-gray-900">
                        {typeof product.price === 'number'
                          ? product.price.toLocaleString('vi-VN') + '₫'
                          : product.price || 'Liên hệ'}
                      </p>
                      {product.oldPrice && (
                        <p className="text-sm text-gray-400 line-through">
                          {typeof product.oldPrice === 'number'
                            ? product.oldPrice.toLocaleString('vi-VN') + '₫'
                            : product.oldPrice}
                        </p>
                      )}
                    </div>

                    {/* Rating Stars (placeholder) */}
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                    </div>
                  </div>

                  {/* Stock Information */}
                  <div className="mt-2 text-sm">
                    <span className={`${product.quantity === 0 ? 'text-red-500' : product.quantity < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                      {product.quantity === 0 ? 'Hết hàng' :
                       product.quantity < 10 ? `Còn ${product.quantity} sản phẩm` :
                       'Còn hàng'}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={product.quantity === 0}
                    className={`w-full mt-4 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                      product.quantity === 0
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    {product.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có sản phẩm nào để hiển thị</p>
          </div>
        )}

        {/* View All Products Button */}
        {displayProducts.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Xem tất cả sản phẩm
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        )}


      </div>
    </div>
  );
};

export default ProductsList;
