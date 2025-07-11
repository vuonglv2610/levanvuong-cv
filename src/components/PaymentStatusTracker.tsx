import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import useToast from '../hooks/useToast';
import paymentService from '../services/paymentService';

interface PaymentStatusTrackerProps {
  paymentId: string;
  orderId: string;
  onStatusChange?: (status: string) => void;
  showRefreshButton?: boolean;
}

const PaymentStatusTracker: React.FC<PaymentStatusTrackerProps> = ({
  paymentId,
  orderId,
  onStatusChange,
  showRefreshButton = true
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const toast = useToast();

  // Query để lấy thông tin thanh toán
  const { data: paymentData, isLoading, error, refetch } = useQuery({
    queryKey: ['payments', paymentId],
    queryFn: () => paymentService.getPaymentById(paymentId),
    enabled: !!paymentId,
    refetchInterval: (query) => {
      // Tự động refresh nếu payment đang pending hoặc processing
      const status = query.state.data?.result?.data?.paymentStatus;
      return (status === 'pending' || status === 'processing') ? 30000 : false; // 30 giây
    },
    retry: 3
  });

  // Callback khi status thay đổi
  useEffect(() => {
    if (paymentData?.result?.data?.paymentStatus && onStatusChange) {
      onStatusChange(paymentData.result.data.paymentStatus);
    }
  }, [paymentData?.result?.data?.paymentStatus, onStatusChange]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success('Thành công', 'Đã cập nhật trạng thái thanh toán');
    } catch (error) {
      toast.error('Lỗi', 'Không thể cập nhật trạng thái thanh toán');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !paymentData?.result?.data) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Trạng thái thanh toán</h3>
            <p className="text-red-600">Không thể tải thông tin thanh toán</p>
          </div>
          {showRefreshButton && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {isRefreshing ? 'Đang tải...' : 'Thử lại'}
            </button>
          )}
        </div>
      </div>
    );
  }

  const payment = paymentData.result.data;
  const statusInfo = paymentService.getPaymentStatusInfo(payment.paymentStatus);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Thông tin thanh toán</h3>
        {showRefreshButton && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:bg-gray-50 transition-colors"
          >
            {isRefreshing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-600 mr-2"></div>
                Đang tải...
              </div>
            ) : (
              '🔄 Làm mới'
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment ID */}
        <div>
          <p className="text-sm text-gray-600">Mã thanh toán</p>
          <p className="font-medium text-gray-900">#{payment.id.slice(-8)}</p>
        </div>

        {/* Payment Method */}
        <div>
          <p className="text-sm text-gray-600">Phương thức</p>
          <p className="font-medium text-gray-900">
            {paymentService.getPaymentMethodDisplayName(payment.paymentMethod)}
          </p>
        </div>

        {/* Amount */}
        <div>
          <p className="text-sm text-gray-600">Số tiền</p>
          <p className="font-medium text-blue-600">
            {paymentService.formatCurrency(payment.finalAmount)}
          </p>
        </div>

        {/* Transaction ID */}
        {payment.transactionId && (
          <div>
            <p className="text-sm text-gray-600">Mã giao dịch</p>
            <p className="font-medium text-gray-900 text-sm">{payment.transactionId}</p>
          </div>
        )}

        {/* Payment Date */}
        {payment.paymentDate && (
          <div>
            <p className="text-sm text-gray-600">Ngày thanh toán</p>
            <p className="font-medium text-gray-900 text-sm">
              {new Date(payment.paymentDate).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}

        {/* Discount Amount */}
        {payment.discountAmount > 0 && (
          <div>
            <p className="text-sm text-gray-600">Giảm giá</p>
            <p className="font-medium text-green-600">
              -{paymentService.formatCurrency(payment.discountAmount)}
            </p>
          </div>
        )}
      </div>

      {/* Payment Status */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Trạng thái thanh toán</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color} ${statusInfo.bgColor}`}>
              {getStatusIcon(payment.paymentStatus)}
              <span className="ml-2">{statusInfo.name}</span>
            </span>
          </div>
          
          {/* Auto refresh indicator */}
          {(payment.paymentStatus === 'pending' || payment.paymentStatus === 'processing') && (
            <div className="text-xs text-gray-500 flex items-center">
              <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Tự động cập nhật mỗi 30s
            </div>
          )}
        </div>

        {/* Status specific messages */}
        <div className="mt-3">
          {payment.paymentStatus === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                💡 Thanh toán đang chờ xử lý. Vui lòng hoàn tất thanh toán nếu chưa thực hiện.
              </p>
            </div>
          )}
          
          {payment.paymentStatus === 'processing' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                ⏳ Thanh toán đang được xử lý. Vui lòng đợi trong giây lát.
              </p>
            </div>
          )}
          
          {payment.paymentStatus === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                ✅ Thanh toán đã hoàn tất thành công. Đơn hàng sẽ được xử lý ngay lập tức.
              </p>
            </div>
          )}
          
          {payment.paymentStatus === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                ❌ Thanh toán thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ.
              </p>
            </div>
          )}
          
          {payment.paymentStatus === 'cancelled' && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-800">
                🚫 Thanh toán đã bị hủy.
              </p>
            </div>
          )}
          
          {payment.paymentStatus === 'refunded' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-sm text-purple-800">
                💰 Thanh toán đã được hoàn tiền.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function để lấy icon theo status
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return '⏳';
    case 'processing': return '🔄';
    case 'completed': return '✅';
    case 'failed': return '❌';
    case 'cancelled': return '🚫';
    case 'refunded': return '💰';
    default: return '❓';
  }
};

export default PaymentStatusTracker;
