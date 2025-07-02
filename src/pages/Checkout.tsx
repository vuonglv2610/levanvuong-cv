import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import useToast from 'hooks/useToast';
import { getCookie } from 'libs/getCookie';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { get } from 'services/api';
import { PaymentData } from 'services/paymentService';

function Checkout() {
  const navigate = useNavigate();
  const userId = getCookie('userId');
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [discount, setDiscount] = useState(0);
  const toast = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    paymentMethod: 'cod',
    notes: ''
  });

  // Fetch cart items
  const { data, isLoading } = useQuery({
    queryKey: ['/shoppingcart/customer', userId],
    queryFn: () => get(`/shoppingcart/customer/${userId}`),
    enabled: !!userId
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!userId) {
      toast.error('Lỗi', 'Vui lòng đăng nhập để tiếp tục thanh toán');
      navigate('/login');
    }
  }, [userId, navigate]);

  // Get selected items from localStorage
  useEffect(() => {
    const items = localStorage.getItem('checkoutItems');
    if (items) {
      setSelectedItems(JSON.parse(items));
    } else {
      navigate('/cart');
      toast.error('Lỗi', 'Vui lòng chọn sản phẩm để thanh toán');
    }
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      const price = parseFloat(item.product?.price || '0');
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  }, [selectedItems]);

  // Calculate discount amount
  const discountAmount = useMemo(() => {
    return (subtotal * discount) / 100;
  }, [subtotal, discount]);

  // Calculate final total
  const finalTotal = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast.error('Lỗi', 'Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    // Process payment
    try {
      setIsProcessing(true);

      // Map frontend payment method to backend format
      const getBackendPaymentMethod = (method: string) => {
        switch (method) {
          case 'cod': return 'cash';
          case 'banking': return 'vnpay'; // Sử dụng VNPay cho chuyển khoản
          case 'momo': return 'momo';
          default: return 'cash';
        }
      };

      const paymentData: PaymentData = {
        customerId: userId!,
        paymentMethod: getBackendPaymentMethod(formData.paymentMethod) as any,
        description: `Thanh toán đơn hàng - ${formData.notes || 'Không có ghi chú'}`
      };

      // Prepare order info for payment processing page
      const orderInfo = {
        items: selectedItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name
        })),
        shippingInfo: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          ward: formData.ward
        },
        notes: formData.notes,
        subtotal: subtotal,
        discount: discountAmount,
        total: finalTotal
      };

      // Clear checkout items from localStorage
      localStorage.removeItem('checkoutItems');

      // Navigate to payment processing page
      navigate('/payment-processing', {
        state: {
          paymentData,
          orderInfo
        }
      });

    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Lỗi', 'Không thể xử lý thanh toán. Vui lòng thử lại sau.');
    } finally {
      setIsProcessing(false);
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
    <div className='container py-[40px] min-h-[calc(100vh-175px)]'>
      <div className="subtitle text-left mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
        <FontAwesomeIcon icon={faAngleRight} className="mx-2" />
        <Link to="/cart" className="hover:text-primary transition-colors">Giỏ hàng</Link>
        <FontAwesomeIcon icon={faAngleRight} className="mx-2" />
        <span className="font-medium">Thanh toán</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Shipping and Payment Form */}
        <div className="md:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-medium mb-6">Thông tin giao hàng</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                  <input
                    type="text"
                    id="ward"
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Phương thức thanh toán</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-primary mr-2"
                    />
                    <label htmlFor="cod" className="text-gray-700">Thanh toán khi nhận hàng (COD)</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="banking"
                      name="paymentMethod"
                      value="banking"
                      checked={formData.paymentMethod === 'banking'}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-primary mr-2"
                    />
                    <label htmlFor="banking" className="text-gray-700">Thanh toán qua VNPay</label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="momo"
                      name="paymentMethod"
                      value="momo"
                      checked={formData.paymentMethod === 'momo'}
                      onChange={handleInputChange}
                      className="w-4 h-4 accent-primary mr-2"
                    />
                    <label htmlFor="momo" className="text-gray-700">Ví MoMo</label>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đơn hàng</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay địa điểm giao hàng chi tiết hơn."
                ></textarea>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-medium mb-4">Đơn hàng của bạn</h2>
            
            <div className="border-b pb-4 mb-4">
              <h3 className="font-medium mb-3">Sản phẩm</h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div className="flex items-start">
                      <div className="w-12 h-12 flex-shrink-0 mr-2">
                        <img
                          src={item.product?.img || 'https://via.placeholder.com/48'}
                          alt={item.product?.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {formatCurrency(parseFloat(item.product?.price || '0') * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <div className="text-gray-600">Tạm tính</div>
                <div>{formatCurrency(subtotal)}</div>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <div>Giảm giá ({discount}%)</div>
                  <div>- {formatCurrency(discountAmount)}</div>
                </div>
              )}
              
              <div className="pt-3 border-t flex justify-between font-medium text-lg">
                <div>Tổng cộng</div>
                <div className="text-primary">{formatCurrency(finalTotal)}</div>
              </div>
              
              <div className="text-xs text-gray-500 text-right">
                (Đã bao gồm VAT nếu có)
              </div>
            </div>
            
            <button 
              type="submit"
              onClick={handleSubmit}
              disabled={isProcessing || selectedItems.length === 0}
              className="btn-primary w-full py-3 rounded-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
            
            <Link to="/cart" className="block text-center mt-3 text-primary hover:underline">
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;