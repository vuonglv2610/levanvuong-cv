import { faAngleRight, faCartPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useToast from "hooks/useToast";
import { getCookie } from "libs/getCookie";
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { get, post } from "services/api";

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

  // Dữ liệu giả về bình luận sản phẩm
  const productReviews = [
    {
      id: 1,
      userName: "Nguyễn Văn A",
      rating: 5,
      comment: "Sản phẩm rất tốt, đúng như mô tả. Tôi rất hài lòng với chất lượng.",
      createdAt: "2023-10-15T08:30:00Z"
    },
    {
      id: 2,
      userName: "Trần Thị B",
      rating: 4,
      comment: "Sản phẩm đẹp, giao hàng nhanh. Chỉ tiếc là màu sắc hơi khác so với hình ảnh.",
      createdAt: "2023-10-18T14:20:00Z"
    },
    {
      id: 3,
      userName: "Lê Văn C",
      rating: 5,
      comment: "Tuyệt vời! Sẽ mua lại lần sau.",
      createdAt: "2023-11-05T09:45:00Z"
    },
    {
      id: 4,
      userName: "Phạm Thị D",
      rating: 3,
      comment: "Sản phẩm tạm ổn, nhưng giá hơi cao so với chất lượng.",
      createdAt: "2023-11-10T16:30:00Z"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 !my-[20px]">
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
              <div className={`font-medium ${
                product.quantity === 0 ? 'text-red-500' :
                product.quantity < 10 ? 'text-orange-500' :
                'text-green-600'
              }`}>
                {product.quantity !== undefined ?
                  (product.quantity === 0 ? 'Hết hàng' :
                   product.quantity < 10 ? `${product.quantity} sản phẩm` :
                   `${product.quantity} sản phẩm`) :
                  "N/A"}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
            className={`w-full py-3 px-6 rounded-md transition-colors font-medium flex items-center justify-center ${
              product.quantity === 0
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-blue-700'
            }`}
          >
            <FontAwesomeIcon icon={faCartPlus} className="mr-2" />
            {product.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
          </button>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>
        
        {/* Hiển thị số lượng đánh giá và điểm trung bình */}
        <div className="flex items-center mb-6">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesomeIcon 
                key={star}
                icon={star <= 4.2 ? faStar : faStar} 
                className={star <= 4.2 ? "text-yellow-400" : "text-gray-300"} 
              />
            ))}
          </div>
          <span className="ml-2 text-gray-600">4.2/5 ({productReviews.length} đánh giá)</span>
        </div>
        
        {/* Danh sách bình luận */}
        <div className="space-y-6">
          {productReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-6">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold">
                  {review.userName.charAt(0)}
                </div>
                <div className="ml-3">
                  <h4 className="font-medium">{review.userName}</h4>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesomeIcon 
                        key={star}
                        icon={star <= review.rating ? faStar : faStar} 
                        className={star <= review.rating ? "text-yellow-400 text-sm" : "text-gray-300 text-sm"} 
                      />
                    ))}
                    <span className="ml-2 text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 ml-13">{review.comment}</p>
            </div>
          ))}
        </div>
        
        {/* Form thêm bình luận */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Thêm đánh giá của bạn</h3>
          <div className="flex items-center mb-4">
            <span className="mr-2">Đánh giá:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon 
                  key={star}
                  icon={faStar} 
                  className="text-gray-300 cursor-pointer hover:text-yellow-400"
                />
              ))}
            </div>
          </div>
          <textarea 
            className="w-full border border-gray-300 rounded-md p-3 mb-4" 
            rows={4} 
            placeholder="Nhập đánh giá của bạn về sản phẩm này..."
          ></textarea>
          <button className="bg-primary text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors">
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;


