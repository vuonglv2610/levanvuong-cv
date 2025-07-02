import { useQuery } from '@tanstack/react-query';
import PaymentStatusTracker from 'components/PaymentStatusTracker';
import { getCookie } from 'libs/getCookie';
import React, { useState } from 'react';
import { get } from 'services/api';

interface OrderItem {
  id: string;
  productName: string;
  productSku: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  customerId: string;
  order_date: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  // Optional fields for compatibility with existing UI
  orderNumber?: string;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentId?: string;
  shippingAddress?: string;
  items?: OrderItem[];
  subtotal?: number;
  shippingFee?: number;
  tax?: number;
  notes?: string;
}

const OrdersPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ordersPerPage, setOrdersPerPage] = useState<number>(10);
  const userId = getCookie('userId');

  // Fetch user's orders from API
  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ['/orders/customer', userId],
    queryFn: () => get(`/orders/customer/${userId}`),
    enabled: !!userId,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Extract orders from API response or use empty array
  const orders: Order[] = ordersData?.data?.result?.token || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-indigo-100 text-indigo-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'confirmed': return 'Đã xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán';
      case 'paid': return 'Đã thanh toán';
      case 'failed': return 'Thanh toán thất bại';
      case 'refunded': return 'Đã hoàn tiền';
      default: return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Pagination handlers
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setSelectedOrder(null); // Close any expanded order when changing page
      // Scroll to top of orders list
      window.scrollTo({
        top: document.getElementById('orders-list')?.offsetTop || 0,
        behavior: 'smooth'
      });
    }
  };

  const handleOrdersPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrdersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination
  const pageNumbers = (() => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  })();

  // Reset to first page when status filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không thể tải đơn hàng</h2>
            <p className="text-gray-600 mb-4">Đã xảy ra lỗi khi tải danh sách đơn hàng của bạn.</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!userId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-blue-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vui lòng đăng nhập</h2>
            <p className="text-gray-600 mb-4">Bạn cần đăng nhập để xem đơn hàng của mình.</p>
            <a
              href="/login"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn hàng của tôi</h1>
          <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap border-b">
            {[
              { key: 'all', label: 'Tất cả', count: orders.length },
              { key: 'pending', label: 'Chờ xử lý', count: orders.filter(o => o.status === 'pending').length },
              { key: 'confirmed', label: 'Đã xác nhận', count: orders.filter(o => o.status === 'confirmed').length },
              { key: 'processing', label: 'Đang xử lý', count: orders.filter(o => o.status === 'processing').length },
              { key: 'shipped', label: 'Đang giao', count: orders.filter(o => o.status === 'shipped').length },
              { key: 'delivered', label: 'Đã giao', count: orders.filter(o => o.status === 'delivered').length },
              { key: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedStatus(tab.key)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  selectedStatus === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div id="orders-list" className="space-y-4">
          {currentOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng nào</h3>
              <p className="text-gray-500 mb-6">Bạn chưa có đơn hàng nào trong danh mục này</p>
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tiếp tục mua sắm
              </a>
            </div>
          ) : (
            currentOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Đơn hàng #{order.orderNumber || order.id.slice(0, 8)}</h3>
                        <p className="text-sm text-gray-600">
                          Đặt ngày {new Date(order.order_date).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                        {order.paymentStatus && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {getPaymentStatusText(order.paymentStatus)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(order.total_amount)}
                      </span>
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {selectedOrder?.id === order.id ? 'Thu gọn' : 'Xem chi tiết'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Info Preview */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Khách hàng: <span className="font-medium text-gray-900">{order.customer.name}</span></p>
                      <p className="text-sm text-gray-600">Email: <span className="font-medium text-gray-900">{order.customer.email}</span></p>
                      {order.customer.phone && (
                        <p className="text-sm text-gray-600">Điện thoại: <span className="font-medium text-gray-900">{order.customer.phone}</span></p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Tổng tiền</p>
                      <p className="text-lg font-bold text-blue-600">{formatPrice(order.total_amount)}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                {selectedOrder?.id === order.id && (
                  <div className="border-t bg-gray-50 p-6">
                    {/* Payment Status Tracker */}
                    {order.paymentId && (
                      <div className="mb-6">
                        <PaymentStatusTracker
                          paymentId={order.paymentId}
                          orderId={order.id}
                          onStatusChange={(status) => {
                            // Có thể cập nhật UI khi payment status thay đổi
                            console.log('Payment status changed:', status);
                          }}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Thông tin khách hàng</h4>
                        <p className="text-gray-600">Tên: {order.customer.name}</p>
                        <p className="text-gray-600">Email: {order.customer.email}</p>
                        {order.customer.phone && (
                          <p className="text-gray-600">Điện thoại: {order.customer.phone}</p>
                        )}

                        {order.shippingAddress && (
                          <>
                            <h4 className="font-medium text-gray-900 mb-3 mt-4">Địa chỉ giao hàng</h4>
                            <p className="text-gray-600">{order.shippingAddress}</p>
                          </>
                        )}

                        {order.paymentMethod && (
                          <>
                            <h4 className="font-medium text-gray-900 mb-3 mt-4">Phương thức thanh toán</h4>
                            <p className="text-gray-600">{order.paymentMethod}</p>
                          </>
                        )}

                        {order.notes && (
                          <>
                            <h4 className="font-medium text-gray-900 mb-3 mt-4">Ghi chú</h4>
                            <p className="text-gray-600">{order.notes}</p>
                          </>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Thông tin đơn hàng</h4>
                        <div className="bg-white rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mã đơn hàng:</span>
                            <span className="text-gray-900 font-mono">{order.id.slice(0, 8)}...</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ngày đặt:</span>
                            <span className="text-gray-900">{new Date(order.order_date).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Trạng thái:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-semibold">
                              <span className="text-gray-900">Tổng cộng:</span>
                              <span className="text-blue-600">{formatPrice(order.total_amount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {order.status === 'delivered' && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Mua lại
                        </button>
                      )}
                      {order.status === 'pending' && (
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                          Hủy đơn hàng
                        </button>
                      )}
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Liên hệ hỗ trợ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination - Always show when there are orders */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 bg-white rounded-lg shadow-sm border p-6">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="orders-per-page" className="text-sm text-gray-700">
                Hiển thị:
              </label>
              <select
                id="orders-per-page"
                value={ordersPerPage}
                onChange={handleOrdersPerPageChange}
                className="p-2 text-sm text-gray-900 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={5}>5 đơn hàng</option>
                <option value={10}>10 đơn hàng</option>
                <option value={20}>20 đơn hàng</option>
                <option value={50}>50 đơn hàng</option>
              </select>
              <span className="text-sm text-gray-600 ml-4">
                Hiển thị {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} trong tổng số {filteredOrders.length} đơn hàng
              </span>
            </div>

            {/* Pagination controls - Only show when more than 1 page */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === number
                        ? 'text-white bg-blue-600 border border-blue-600'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                </button>
              </div>
            )}

            {/* Show page info when only 1 page */}
            {totalPages === 1 && (
              <div className="text-sm text-gray-600">
                Trang 1 / 1 - Tất cả {filteredOrders.length} đơn hàng
              </div>
            )}
          </div>
        )}

        {/* Show pagination info when no orders match filter */}
        {filteredOrders.length === 0 && orders.length > 0 && (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">
              Không tìm thấy đơn hàng nào với trạng thái "{getStatusText(selectedStatus)}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
