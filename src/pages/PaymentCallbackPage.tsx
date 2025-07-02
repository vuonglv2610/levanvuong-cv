import useToast from 'hooks/useToast';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import paymentService from '../services/paymentService';

const PaymentCallbackPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    handlePaymentCallback();
  }, []);

  const handlePaymentCallback = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Lấy query parameters từ URL
      const urlParams = new URLSearchParams(location.search);
      
      // Kiểm tra loại payment gateway
      const vnpResponseCode = urlParams.get('vnp_ResponseCode');
      const vnpTxnRef = urlParams.get('vnp_TxnRef');
      
      if (vnpResponseCode !== null) {
        // Xử lý callback từ VNPay
        await handleVNPayCallback(urlParams);
      } else {
        // Xử lý callback từ gateway khác (MoMo, ZaloPay, etc.)
        throw new Error('Không xác định được loại payment gateway');
      }

    } catch (error: any) {
      console.error('Payment callback error:', error);
      setError(error.message || 'Có lỗi xảy ra khi xử lý kết quả thanh toán');
      setIsProcessing(false);
    }
  };

  const handleVNPayCallback = async (urlParams: URLSearchParams) => {
    try {
      // Gọi API kiểm tra kết quả VNPay
      const response = await paymentService.checkVNPayResult(urlParams);
      
      if (response.success) {
        setPaymentResult({
          success: true,
          message: response.message || 'Thanh toán thành công',
          data: response.data
        });

        // Hiển thị thông báo thành công
        toast.success('Thành công', 'Thanh toán thành công!');

        // Chuyển hướng đến trang thành công sau 3 giây
        setTimeout(() => {
          navigate('/order-success', {
            state: {
              orderId: response.data?.orderId,
              paymentId: response.data?.paymentId,
              total: response.data?.amount,
              paymentMethod: 'vnpay',
              paymentStatus: 'completed',
              fromCallback: true
            }
          });
        }, 3000);

      } else {
        // Thanh toán thất bại
        setPaymentResult({
          success: false,
          message: response.message || 'Thanh toán thất bại',
          data: response.data
        });

        toast.error('Lỗi', 'Thanh toán thất bại!');

        // Chuyển hướng đến trang thất bại sau 3 giây
        setTimeout(() => {
          navigate('/payment-failed', {
            state: {
              error: response.message,
              orderId: response.data?.orderId
            }
          });
        }, 3000);
      }

    } catch (error: any) {
      throw new Error(error.message || 'Lỗi khi kiểm tra kết quả VNPay');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReturnToHome = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders');
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
              Lỗi xử lý thanh toán
            </h1>
            
            <p className="text-gray-600 mb-6">
              {error}
            </p>

            <button
              onClick={handleReturnToHome}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            {/* Loading Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Đang xử lý kết quả thanh toán
            </h1>
            
            <p className="text-gray-600 mb-6">
              Vui lòng đợi trong giây lát. Chúng tôi đang xác nhận kết quả thanh toán của bạn...
            </p>

            <div className="text-sm text-gray-500">
              <p>Không đóng trang này cho đến khi hoàn tất</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị kết quả thanh toán
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Success/Failure Icon */}
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            paymentResult?.success ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {paymentResult?.success ? (
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <h1 className={`text-2xl font-bold mb-4 ${
            paymentResult?.success ? 'text-green-600' : 'text-red-600'
          }`}>
            {paymentResult?.success ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {paymentResult?.message}
          </p>

          {paymentResult?.success ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Bạn sẽ được chuyển hướng đến trang xác nhận đơn hàng...
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleViewOrders}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Xem đơn hàng
                </button>
                <button
                  onClick={handleReturnToHome}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Bạn có thể thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.
              </p>
              <button
                onClick={handleReturnToHome}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Về trang chủ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallbackPage;
