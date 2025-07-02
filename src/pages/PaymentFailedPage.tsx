import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface PaymentFailedState {
  error?: string;
  orderId?: string;
  paymentId?: string;
}

const PaymentFailedPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as PaymentFailedState;
  const { error, orderId } = state || {};

  const handleRetryPayment = () => {
    // Quay lại trang checkout để thử lại
    navigate('/checkout');
  };

  const handleReturnToCart = () => {
    navigate('/cart');
  };

  const handleReturnToHome = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    // Có thể mở modal liên hệ hoặc chuyển đến trang liên hệ
    window.open('mailto:support@example.com?subject=Hỗ trợ thanh toán&body=Mã đơn hàng: ' + (orderId || 'N/A'));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Failed Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Failed Message */}
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Thanh toán thất bại!
          </h1>
          
          <p className="text-gray-600 mb-6">
            {error || 'Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ với chúng tôi để được hỗ trợ.'}
          </p>

          {/* Order Details */}
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="text-left">
                <p className="text-sm text-gray-600">Mã đơn hàng</p>
                <p className="font-semibold text-gray-900">#{orderId}</p>
              </div>
            </div>
          )}

          {/* Common Reasons */}
          <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-yellow-900 mb-2">Một số nguyên nhân có thể gây ra lỗi:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Số dư tài khoản không đủ</li>
              <li>• Thông tin thẻ không chính xác</li>
              <li>• Kết nối mạng không ổn định</li>
              <li>• Phiên thanh toán đã hết hạn</li>
              <li>• Ngân hàng từ chối giao dịch</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleRetryPayment}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Thử lại thanh toán
            </button>
            <button
              onClick={handleReturnToCart}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Quay lại giỏ hàng
            </button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleContactSupport}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Liên hệ hỗ trợ
            </button>
            <button
              onClick={handleReturnToHome}
              className="px-6 py-3 text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              Về trang chủ
            </button>
          </div>

          {/* Help Information */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Cần hỗ trợ?</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📞 Hotline: 1900-xxxx (24/7)</p>
              <p>📧 Email: support@example.com</p>
              <p>💬 Chat trực tuyến: Góc dưới bên phải</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
