import useToast from 'hooks/useToast';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { get } from 'services/api';

const PaymentResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processVNPayResult = async () => {
      try {
        // Lấy query parameters từ VNPay
        const searchParams = new URLSearchParams(location.search);
        
        // Kiểm tra xem có parameters từ VNPay không
        if (!searchParams.get('vnp_TxnRef')) {
          setError('Không tìm thấy thông tin thanh toán');
          setIsProcessing(false);
          return;
        }

        // Gọi API để xác minh kết quả thanh toán
        const response = await get(`/payments/check-payment${location.search}`);
        
        if (response.data) {
          setPaymentResult(response.data);
          
          // Kiểm tra kết quả thanh toán
          const responseCode = searchParams.get('vnp_ResponseCode');
          
          if (responseCode === '00') {
            toast.success('Thanh toán thành công!', 'Đơn hàng của bạn đã được xử lý thành công.');
          } else {
            toast.error('Thanh toán thất bại', 'Có lỗi xảy ra trong quá trình thanh toán.');
          }
        }
      } catch (error: any) {
        console.error('Error processing VNPay result:', error);
        setError('Có lỗi xảy ra khi xử lý kết quả thanh toán');
        toast.error('Lỗi', 'Có lỗi xảy ra khi xử lý kết quả thanh toán');
      } finally {
        setIsProcessing(false);
      }
    };

    processVNPayResult();
  }, [location.search, toast]);

  const handleGoToOrders = () => {
    navigate('/orders');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Đang xử lý kết quả thanh toán
            </h1>
            <p className="text-gray-600">
              Vui lòng đợi trong giây lát...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGoHome}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Về trang chủ
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Lấy response code để hiển thị kết quả
  const searchParams = new URLSearchParams(location.search);
  const responseCode = searchParams.get('vnp_ResponseCode');
  const isSuccess = responseCode === '00';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Success/Error Icon */}
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
            isSuccess ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isSuccess ? (
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
            isSuccess ? 'text-green-600' : 'text-red-600'
          }`}>
            {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {isSuccess 
              ? 'Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xử lý thành công.'
              : 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.'
            }
          </p>

          {/* Payment Details */}
          {paymentResult && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-medium">{searchParams.get('vnp_TxnRef')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(Number(searchParams.get('vnp_Amount')) / 100)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-medium">
                    {new Date().toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSuccess ? (
              <>
                <button
                  onClick={handleGoToOrders}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Xem đơn hàng
                </button>
                <button
                  onClick={handleGoHome}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Tiếp tục mua sắm
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Thử lại
                </button>
                <button
                  onClick={handleGoHome}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Về trang chủ
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
