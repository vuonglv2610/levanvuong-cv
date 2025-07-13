import { faAngleRight, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "hooks/useToast";
import { getCookie } from "libs/getCookie";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { get, post } from "services/api";
import ProductComments from "../components/ProductComments";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  
  const { data: productData, isLoading } = useQuery({
    queryKey: [`/products/${id}`],
    queryFn: () => get(`/products/${id}`),
    staleTime: 60000,
    enabled: !!id
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const product = productData?.data?.result?.data || {};

  useEffect(() => {
    if (product) {
      console.log('Product data:', product);
    }
  }, [product]);

  const handleAddToCart = async () => {
    const userId = getCookie("userId");

    if (!userId) {
      toast.info("Thông báo", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      navigate("/login");
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
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm h-[50px]">
            <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              Trang chủ
            </Link>
            <FontAwesomeIcon icon={faAngleRight} className="text-gray-400" />
            <Link to="/product" className="text-blue-600 hover:text-blue-800 transition-colors">
              Sản phẩm
            </Link>
            <FontAwesomeIcon icon={faAngleRight} className="text-gray-400" />
            <span className="text-gray-600 font-medium truncate">
              {product.name || "Chi tiết sản phẩm"}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Product Image */}
            <div className="lg:w-1/2 p-8">
              <div className="relative bg-gray-50 rounded-2xl overflow-hidden group">
                <img
                  src={product.img || "https://via.placeholder.com/600x400?text=No+Image"}
                  alt={product.name || "Product image"}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=No+Image';
                  }}
                />

                {/* Badges */}
                {product.quantity === 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                    Hết hàng
                  </div>
                )}
                {product.isNew && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                    Mới
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 p-8">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>

                  {/* Category & Brand */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.categoryName && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        📱 {product.categoryName}
                      </span>
                    )}
                    {product.brandName && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        🏷️ {product.brandName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                  <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                    {typeof product.price === 'number'
                      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)
                      : product.price || "Liên hệ"}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-500 line-through">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.originalPrice)}
                      </span>
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                        Tiết kiệm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 font-medium">Tình trạng:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    product.quantity > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.quantity > 0 ? `Còn ${product.quantity} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Mô tả sản phẩm</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description || "Chưa có mô tả cho sản phẩm này."}
                    </p>
                  </div>
                </div>

                {/* Product Details */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin chi tiết</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Mã sản phẩm:</span>
                      <span className="font-medium">{product.sku || "N/A"}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Thương hiệu:</span>
                      <span className="font-medium">{product.brandName || "N/A"}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Danh mục:</span>
                      <span className="font-medium">{product.categoryName || "N/A"}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Bảo hành:</span>
                      <span className="font-medium">12 tháng</span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="space-y-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0}
                    className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 ${
                      product.quantity === 0
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCartPlus} className="text-xl" />
                    {product.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                  </button>

                  {/* Additional Actions */}
                  {/* <div className="grid grid-cols-2 gap-4">
                    <button className="py-3 px-6 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors">
                      💝 Yêu thích
                    </button>
                    <button className="py-3 px-6 border-2 border-green-600 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-colors">
                      📞 Liên hệ
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component đánh giá sản phẩm */}
        <div className="mt-12">
          {id && <ProductComments productId={id} />}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;


