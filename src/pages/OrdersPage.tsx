import { useQuery } from '@tanstack/react-query';
import PaymentStatusTracker from 'components/PaymentStatusTracker';
import useToast from 'hooks/useToast';
import { getCookie } from 'libs/getCookie';
import React, { useState } from 'react';
import { get, put } from 'services/api';

interface OrderDetail {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  serial_numbers: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    img: string;
  };
}

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionId: string;
  finalAmount: number;
  discountAmount: number;
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
  orderDetails: OrderDetail[];
  payment: Payment | null;
  // Optional fields for compatibility with existing UI
  orderNumber?: string;
  paymentId?: string;
  shippingAddress?: string;
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
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const userId = getCookie('userId');
  const toast = useToast();

  // Function to cancel an order
  const cancelOrder = async (orderId: string) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;
    
    try {
      setCancellingOrderId(orderId);
      const response = await put(`/orders/${orderId}`, { status: 'cancelled' });
      toast.success('Thành công', 'Đơn hàng đã được hủy thành công');
      
      // Refetch orders to update the UI
      refetch();
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      const errorMessage = error.response?.data?.message || 'Không thể hủy đơn hàng';
      toast.error('Lỗi', errorMessage);
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Fetch user's orders from API
  const { data: ordersData, isLoading, error, refetch } = useQuery({
    // queryKey: ['/orders/customer', userId],
    // queryFn: () => get(`/orders/customer/${userId}`),
    queryKey: ['/orders/with-details', userId],
    queryFn: () => get(`/orders/with-details?customerId=${userId}`),
    enabled: !!userId,
    staleTime: 30000, // Cache for 30 seconds
  });

  // Extract orders from API response or use empty array
  const orders: Order[] = ordersData?.data?.result?.data || [];

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Đơn hàng của tôi
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Theo dõi và quản lý các đơn hàng của bạn một cách dễ dàng
            </p>
            <div className="flex items-center justify-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📦</span>
                <span>{orders.length} đơn hàng</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span>{orders.filter(o => o.status === 'delivered').length} đã giao</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚚</span>
                <span>{orders.filter(o => ['processing', 'shipped'].includes(o.status)).length} đang xử lý</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-white/20 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-gray-900">Lọc theo trạng thái</h2>
          </div>
          <div className="flex flex-wrap">
            {[
              { key: 'all', label: 'Tất cả', count: orders.length, icon: '📋', color: 'blue' },
              { key: 'pending', label: 'Chờ xử lý', count: orders.filter(o => o.status === 'pending').length, icon: '⏳', color: 'yellow' },
              { key: 'confirmed', label: 'Đã xác nhận', count: orders.filter(o => o.status === 'confirmed').length, icon: '✅', color: 'green' },
              { key: 'processing', label: 'Đang xử lý', count: orders.filter(o => o.status === 'processing').length, icon: '⚙️', color: 'blue' },
              { key: 'shipped', label: 'Đang giao', count: orders.filter(o => o.status === 'shipped').length, icon: '🚚', color: 'indigo' },
              { key: 'delivered', label: 'Đã giao', count: orders.filter(o => o.status === 'delivered').length, icon: '🎉', color: 'green' },
              { key: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length, icon: '❌', color: 'red' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedStatus(tab.key)}
                className={`flex-1 min-w-0 px-4 py-4 text-sm font-medium border-b-4 transition-all duration-300 hover:bg-gray-50 ${
                  selectedStatus === tab.key
                    ? `border-${tab.color}-500 bg-${tab.color}-50 text-${tab.color}-700`
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedStatus === tab.key
                      ? `bg-${tab.color}-100 text-${tab.color}-800`
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div id="orders-list" className="space-y-6">
          {currentOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {selectedStatus === 'all' ? 'Chưa có đơn hàng nào' : `Không có đơn hàng ${getStatusText(selectedStatus).toLowerCase()}`}
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                {selectedStatus === 'all'
                  ? 'Hãy khám phá các sản phẩm tuyệt vời và tạo đơn hàng đầu tiên của bạn!'
                  : 'Thử chọn trạng thái khác hoặc tạo đơn hàng mới'
                }
              </p>
              <div className="space-y-4">
                <a
                  href="/product"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                >
                  🛍️ Khám phá sản phẩm
                </a>

                <div className="flex flex-wrap justify-center gap-6 mt-8 text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚚</span>
                    <span>Giao hàng nhanh</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🛡️</span>
                    <span>Bảo hành chính hãng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💳</span>
                    <span>Thanh toán an toàn</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            currentOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Order Header */}
                <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          📦
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Đơn hàng #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2z" />
                            </svg>
                            Đặt ngày {new Date(order.order_date).toLocaleDateString('vi-VN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-sm ${getStatusColor(order.status)}`}>
                          <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                          {getStatusText(order.status)}
                        </span>
                        {order.payment?.paymentStatus && (
                          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-sm ${getPaymentStatusColor(order.payment.paymentStatus)}`}>
                            <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                            {getPaymentStatusText(order.payment.paymentStatus)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Tổng tiền</p>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {formatPrice(order.total_amount)}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                      >
                        {selectedOrder?.id === order.id ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            Thu gọn
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            Xem chi tiết
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Info Preview */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Thông tin khách hàng
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span className="text-gray-600">Tên:</span>
                          <span className="font-medium text-gray-900">{order.customer.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-gray-900">{order.customer.email}</span>
                        </div>
                        {order.customer.phone && (
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span className="text-gray-600">Điện thoại:</span>
                            <span className="font-medium text-gray-900">{order.customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                      <h4 className="font-bold text-gray-900 mb-2 text-center">Tổng đơn hàng</h4>
                      <div className="text-center">
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {formatPrice(order.total_amount)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {order.orderDetails.length} sản phẩm
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details (Expandable) */}
                {selectedOrder?.id === order.id && (
                  <div className="border-t bg-gradient-to-br from-gray-50 to-blue-50 p-6">
                    {/* Payment Status Tracker */}
                    {order.payment?.id && (
                      <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Trạng thái thanh toán
                        </h4>
                        <PaymentStatusTracker
                          paymentId={order.payment.id}
                          orderId={order.id}
                          onStatusChange={(status) => {
                            console.log('Payment status changed:', status);
                          }}
                        />
                      </div>
                    )}

                    {/* Chi tiết sản phẩm */}
                    <div className="mb-8">
                      <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        Sản phẩm đã đặt ({order.orderDetails.length} sản phẩm)
                      </h4>
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {order.orderDetails.map((detail, index) => (
                          <div key={detail.id} className={`p-6 flex items-center gap-6 hover:bg-gray-50 transition-colors ${index !== order.orderDetails.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                              {detail.product.img ? (
                                <img
                                  src={detail.product.img}
                                  alt={detail.product.name}
                                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>

                            <div className="flex-1 space-y-2">
                              <h5 className="font-bold text-gray-900 text-lg">{detail.product.name}</h5>
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  SKU: {detail.product.sku}
                                </span>
                                {detail.serial_numbers && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Serial: {detail.serial_numbers}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>Đơn giá: <span className="font-medium text-gray-900">{formatPrice(detail.unit_price)}</span></span>
                                <span>×</span>
                                <span>Số lượng: <span className="font-medium text-gray-900">{detail.quantity}</span></span>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-600 mb-1">Thành tiền</p>
                              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {formatPrice(detail.total_price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Thông tin khách hàng</h4>
                        <div className="bg-white rounded-lg p-4 space-y-2">
                          <p className="text-gray-600">Tên: <span className="font-medium text-gray-900">{order.customer.name}</span></p>
                          <p className="text-gray-600">Email: <span className="font-medium text-gray-900">{order.customer.email}</span></p>
                          {order.customer.phone && (
                            <p className="text-gray-600">Điện thoại: <span className="font-medium text-gray-900">{order.customer.phone}</span></p>
                          )}
                        </div>

                        {order.shippingAddress && (
                          <>
                            <h4 className="font-medium text-gray-900 mb-3 mt-4">Địa chỉ giao hàng</h4>
                            <div className="bg-white rounded-lg p-4">
                              <p className="text-gray-600">{order.shippingAddress}</p>
                            </div>
                          </>
                        )}

                        {order.payment && (
                          <>
                            <h4 className="font-medium text-gray-900 mb-3 mt-4">Thông tin thanh toán</h4>
                            <div className="bg-white rounded-lg p-4 space-y-2">
                              <p className="text-gray-600">Phương thức: <span className="font-medium text-gray-900 capitalize">{order.payment.paymentMethod}</span></p>
                              <p className="text-gray-600">Trạng thái:
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment.paymentStatus)}`}>
                                  {getPaymentStatusText(order.payment.paymentStatus)}
                                </span>
                              </p>
                              {order.payment.transactionId && (
                                <p className="text-gray-600">Mã giao dịch: <span className="font-mono text-sm text-gray-900">{order.payment.transactionId}</span></p>
                              )}
                              {order.payment.discountAmount > 0 && (
                                <p className="text-gray-600">Giảm giá: <span className="font-medium text-green-600">-{formatPrice(order.payment.discountAmount)}</span></p>
                              )}
                            </div>
                          </>
                        )}

                        {order.notes && (
                          <>
                            <h4 className="font-medium text-gray-900 mb-3 mt-4">Ghi chú</h4>
                            <div className="bg-white rounded-lg p-4">
                              <p className="text-gray-600">{order.notes}</p>
                            </div>
                          </>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Thông tin đơn hàng</h4>
                        <div className="bg-white rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Mã đơn hàng:</span>
                            <span className="text-gray-900 font-mono text-sm">{order.id.slice(0, 8)}...</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Ngày đặt:</span>
                            <span className="text-gray-900">{new Date(order.order_date).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Trạng thái:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Số lượng sản phẩm:</span>
                            <span className="text-gray-900">{order.orderDetails.reduce((total, detail) => total + detail.quantity, 0)} sản phẩm</span>
                          </div>
                          {order.payment && (
                            <>
                              <div className="border-t pt-3 space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Tạm tính:</span>
                                  <span className="text-gray-900">{formatPrice(order.payment.amount)}</span>
                                </div>
                                {order.payment.discountAmount > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Giảm giá:</span>
                                    <span className="text-green-600">-{formatPrice(order.payment.discountAmount)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                  <span className="text-gray-900">Tổng cộng:</span>
                                  <span className="text-blue-600">{formatPrice(order.payment.finalAmount)}</span>
                                </div>
                              </div>
                            </>
                          )}
                          {!order.payment && (
                            <div className="border-t pt-2">
                              <div className="flex justify-between font-semibold">
                                <span className="text-gray-900">Tổng cộng:</span>
                                <span className="text-blue-600">{formatPrice(order.total_amount)}</span>
                              </div>
                            </div>
                          )}
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
                        <button 
                          onClick={() => cancelOrder(order.id)}
                          disabled={cancellingOrderId === order.id}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
                        >
                          {cancellingOrderId === order.id ? 'Đang hủy...' : 'Hủy đơn hàng'}
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
          <div className="bg-white rounded-2xl shadow-xl border border-white/20 p-6 mt-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              {/* Items per page selector */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-3">
                  <label htmlFor="orders-per-page" className="text-sm font-medium text-gray-700">
                    📄 Hiển thị:
                  </label>
                  <select
                    id="orders-per-page"
                    value={ordersPerPage}
                    onChange={handleOrdersPerPageChange}
                    className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value={5}>5 đơn hàng</option>
                    <option value={10}>10 đơn hàng</option>
                    <option value={20}>20 đơn hàng</option>
                    <option value={50}>50 đơn hàng</option>
                  </select>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">
                    📊 Hiển thị <span className="text-blue-600 font-bold">{indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)}</span> trong tổng số <span className="text-purple-600 font-bold">{filteredOrders.length}</span> đơn hàng
                  </span>
                </div>
              </div>

              {/* Pagination controls - Only show when more than 1 page */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Trước
                  </button>

                  <div className="flex items-center gap-1">
                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-10 h-10 text-sm font-bold rounded-xl transition-all duration-300 ${
                          currentPage === number
                            ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-110'
                            : 'text-gray-600 bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Sau
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Show page info when only 1 page */}
              {totalPages === 1 && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 px-4 py-2 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">
                    📄 Trang <span className="text-green-600 font-bold">1</span> / <span className="text-blue-600 font-bold">1</span> - Tất cả <span className="text-purple-600 font-bold">{filteredOrders.length}</span> đơn hàng
                  </span>
                </div>
              )}
            </div>
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


