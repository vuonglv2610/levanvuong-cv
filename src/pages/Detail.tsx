import { faAngleRight, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { get } from "services/api";

const DetailPage = () => {
  const { id } = useParams();
  
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

  const handleAddToCart = () => {
    // Add to cart logic here
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-left mb-8">
        <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
        <FontAwesomeIcon icon={faAngleRight} className="mx-2" />
        <Link to="/product" className="hover:text-primary transition-colors">Sản phẩm</Link>
        <FontAwesomeIcon icon={faAngleRight} className="mx-2" />
        <span className="font-medium">{product.name || "Chi tiết sản phẩm"}</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.img || "https://via.placeholder.com/600x400?text=No+Image"}
              alt={product.name || "Product image"}
              className="w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=No+Image';
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          
          {product.categoryId && (
            <div className="mb-4">
              <span className="text-sm font-medium text-primary px-3 py-1 bg-blue-50 rounded-full">
                {product.category?.name || "Danh mục"}
              </span>
            </div>
          )}
          
          <div className="text-2xl font-bold text-gray-900 mb-6">
            {typeof product.price === 'number' 
              ? product.price.toLocaleString('vi-VN') + '₫' 
              : product.price || "Liên hệ"}
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Mô tả sản phẩm:</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || "Chưa có mô tả cho sản phẩm này."}
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Thông tin thêm:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-gray-600">SKU:</div>
              <div>{product.sku || "N/A"}</div>
              
              <div className="text-gray-600">Số lượng trong kho:</div>
              <div>{product.quantity !== undefined ? product.quantity : "N/A"}</div>
            </div>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
