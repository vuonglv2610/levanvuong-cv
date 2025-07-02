import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import paymentService from '../services/paymentService';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order data from navigation state
  const { orderId, paymentId, total, paymentMethod, paymentStatus, fromCallback } = location.state || {};

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Đặt hàng thành công!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
          </p>

          {/* Order Details */}
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Mã đơn hàng</p>
                  <p className="font-semibold text-gray-900">#{orderId.slice(-8)}</p>
                </div>
                {paymentId && (
                  <div>
                    <p className="text-sm text-gray-600">Mã thanh toán</p>
                    <p className="font-semibold text-gray-900">#{paymentId.slice(-8)}</p>
                  </div>
                )}
                {total && (
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="font-semibold text-blue-600">{formatPrice(total)}</p>
                  </div>
                )}
                {paymentMethod && (
                  <div>
                    <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                    <p className="font-semibold text-gray-900">
                      {paymentService.getPaymentMethodDisplayName(paymentMethod)}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Status */}
              {paymentStatus && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Trạng thái thanh toán</p>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      paymentService.getPaymentStatusInfo(paymentStatus).color
                    } ${paymentService.getPaymentStatusInfo(paymentStatus).bgColor}`}>
                      {paymentService.getPaymentStatusInfo(paymentStatus).name}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Information */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-blue-900 mb-2">Thông tin quan trọng:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              {fromCallback ? (
                <>
                  <li>• Thanh toán đã được xác nhận thành công</li>
                  <li>• Chúng tôi sẽ gửi email xác nhận trong vòng 15 phút</li>
                  <li>• Đơn hàng sẽ được xử lý ngay lập tức</li>
                </>
              ) : (
                <>
                  <li>• Chúng tôi sẽ gửi email xác nhận đơn hàng trong vòng 15 phút</li>
                  <li>• Đơn hàng sẽ được xử lý trong 1-2 ngày làm việc</li>
                  {paymentMethod === 'cash' && (
                    <li>• Vui lòng chuẩn bị tiền mặt khi nhận hàng</li>
                  )}
                </>
              )}
              <li>• Bạn có thể theo dõi trạng thái đơn hàng trong mục "Đơn hàng của tôi"</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/orders')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Xem đơn hàng của tôi
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Tiếp tục mua sắm
            </button>
          </div>

          {/* Contact Support */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Cần hỗ trợ? Liên hệ với chúng tôi
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <a href="tel:1900-1234" className="text-blue-600 hover:text-blue-700">
                📞 1900-1234
              </a>
              <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700">
                ✉️ support@example.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
