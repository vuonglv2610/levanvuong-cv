import React, { useState } from "react";
import { Link } from "react-router-dom";

interface CardProps {
  className?: string;
  product?: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description: string;
    rating?: number;
    originalPrice?: number;
  };
}

const Card = ({ className = "", product }: CardProps) => {

  const [imageLoaded, setImageLoaded] = useState(false);

  // Default product data for demo
  const defaultProduct = {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 29990000,
    originalPrice: 32990000,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    category: "Smartphone",
    description: "Điện thoại thông minh cao cấp với chip A17 Pro và camera 48MP",
    rating: 4.8
  };

  const productData = product || defaultProduct;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const discountPercentage = productData.originalPrice
    ? Math.round(((productData.originalPrice - productData.price) / productData.originalPrice) * 100)
    : 0;

  return (
    <div className={`group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 ${className}`}>
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <Link to={`/product/${productData.id}`}>
          <div className="aspect-square bg-gray-100 overflow-hidden">
            {!imageLoaded && (
              <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <img
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              src={productData.image}
              alt={productData.name}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                setImageLoaded(true);
              }}
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>
          )}
          <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {productData.category}
          </span>
        </div>



        {/* Quick Actions */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200">
              Thêm vào giỏ
            </button>
            <Link
              to={`/product/${productData.id}`}
              className="bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg border transition-colors duration-200"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${productData.id}`} className="block">
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {productData.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {productData.description}
        </p>

        {/* Rating */}
        {productData.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(productData.rating!) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">({productData.rating})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(productData.price)}
          </span>
          {productData.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(productData.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
