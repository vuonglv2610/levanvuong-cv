import { useQuery, useQueryClient } from "@tanstack/react-query";
import Pagination from "components/Pagination";
import useToast from "hooks/useToast";
import { getCookie } from "libs/getCookie";
import React, { useState } from "react";
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

const ProductsPage = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Hiển thị 12 sản phẩm mỗi trang

  // Fetch products from API
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['/products'],
    queryFn: () => get('/products'),
    staleTime: 60000,
  });

  const allProducts: Product[] = productsData?.data?.result?.data || [];

  // Tính toán phân trang
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tất cả sản phẩm</h1>
            <p className="text-gray-600">Khám phá bộ sưu tập sản phẩm đa dạng của chúng tôi</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-gray-700 font-medium">
                Tìm thấy {allProducts.length} sản phẩm
              </span>
            </div>

            <div className="text-sm text-gray-500">
              Trang {currentPage} / {totalPages}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentProducts.map((product: Product, index: number) => (
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
                      <span>{product.categoryName || product.category_name || 'Danh mục'}</span>
                      {(product.brandName || product.brand_name) && (
                        <>
                          <span className="mx-1">•</span>
                          <span>{product.brandName || product.brand_name}</span>
                        </>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
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
                    <div className="mb-3 text-sm">
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
                      className={`w-full mt-auto py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
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

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={allProducts.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có sản phẩm nào</h3>
              <p className="text-gray-500">Hiện tại chưa có sản phẩm nào để hiển thị.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
