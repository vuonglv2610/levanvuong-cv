import useToast from 'hooks/useToast';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import paymentService, { PaymentData } from '../services/paymentService';

interface PaymentProcessingState {
  paymentData: PaymentData;
  orderInfo: {
    items: any[];
    subtotal: number;
    discount: number;
    total: number;
    shippingInfo: any;
    notes: string;
  };
}

const PaymentProcessingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  const state = location.state as PaymentProcessingState;

  useEffect(() => {
    if (!state || !state.paymentData) {
      toast.error('Lỗi thanh toán', 'Thông tin thanh toán không hợp lệ');
      navigate('/cart');
      return;
    }

    processPayment();
  }, []);

  const processPayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Gọi API tạo thanh toán
      const response = await paymentService.createPaymentFromCart(state.paymentData);

      console.log('response vnpay', response);

      // Kiểm tra response structure mới
      if (response.statusCode === "Tạo thanh toán thành công" || response.statusCode === 200) {
        console.log('Payment response data:', response.result);

        // Kiểm tra cấu trúc response mới với token
        const paymentToken = response.result?.token;

        if (paymentToken) {
          // Response mới có cấu trúc với token
          const paymentData = paymentToken.payment;
          const vnpayUrl = paymentToken.vnpayUrl;

          // Xử lý theo phương thức thanh toán
          switch (state.paymentData.paymentMethod) {
            case 'vnpay':
              if (vnpayUrl) {
                // Chuyển hướng đến VNPay
                toast.success('Thành công', 'Đang chuyển hướng đến VNPay...');
                setTimeout(() => {
                  window.location.href = vnpayUrl;
                }, 1500);
              } else {
                toast.error('Lỗi VNPay', 'Không nhận được URL thanh toán VNPay');
                setIsProcessing(false);
              }
              break;

            case 'momo':
              // TODO: Implement MoMo integration
              toast.info('Thông báo', 'Tính năng thanh toán MoMo đang được phát triển');
              handleCashPayment(paymentData);
              break;

            case 'zalopay':
              // TODO: Implement ZaloPay integration
              toast.info('Thông báo', 'Tính năng thanh toán ZaloPay đang được phát triển');
              handleCashPayment(paymentData);
              break;

            case 'cash':
            case 'bank_transfer':
            default:
              // Thanh toán COD hoặc chuyển khoản - chuyển thẳng đến trang thành công
              handleCashPayment(paymentData);
              break;
          }
        } else {
          // Fallback cho cấu trúc cũ (nếu có)
          const userData = response.result.data;
          handleCashPayment({ user: userData });
        }
      } else {
        throw new Error(response.message || 'Lỗi khi tạo thanh toán');
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      setError(error.message || 'Có lỗi xảy ra khi xử lý thanh toán');
      setIsProcessing(false);
    }
  };

  const handleCashPayment = (paymentData: any) => {
    // Đối với thanh toán COD hoặc chuyển khoản, chuyển thẳng đến trang thành công
    setTimeout(() => {
      // Tạm thời sử dụng dữ liệu mock vì API chưa trả về đúng cấu trúc
      navigate('/order-success', {
        state: {
          orderId: 'temp-order-' + Date.now(), // Tạm thời
          paymentId: 'temp-payment-' + Date.now(), // Tạm thời
          total: 0, // Tạm thời - cần lấy từ cart
          paymentMethod: state.paymentData.paymentMethod,
          paymentStatus: 'pending', // Tạm thời
          userData: paymentData.user // Thêm user data từ response
        }
      });
    }, 2000); // Delay 2 giây để hiển thị loading
  };

  const handleRetry = () => {
    processPayment();
  };

  const handleGoBack = () => {
    navigate('/checkout');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Lỗi thanh toán
            </h1>
            
            <p className="text-gray-600 mb-6">
              {error}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Thử lại
              </button>
              <button
                onClick={handleGoBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Loading Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Đang xử lý thanh toán
          </h1>
          
          <p className="text-gray-600 mb-6">
            Vui lòng đợi trong giây lát. Chúng tôi đang xử lý thanh toán của bạn...
          </p>

          {paymentInfo && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">#{paymentInfo.order.id.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium">
                    {paymentService.getPaymentMethodDisplayName(state.paymentData.paymentMethod)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-medium text-blue-600">
                    {paymentService.formatCurrency(paymentInfo.payment.finalAmount)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500">
            {state.paymentData.paymentMethod === 'vnpay' && (
              <p>Bạn sẽ được chuyển hướng đến trang thanh toán VNPay...</p>
            )}
            {(state.paymentData.paymentMethod === 'cash' || state.paymentData.paymentMethod === 'bank_transfer') && (
              <p>Đang hoàn tất đơn hàng...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessingPage;
