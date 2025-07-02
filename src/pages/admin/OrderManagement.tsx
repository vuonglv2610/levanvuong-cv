import { useQuery } from '@tanstack/react-query';
import { useToast } from 'hooks/useToast';
import React, { useEffect, useMemo, useState } from 'react';
import { get, put } from 'services/api';
import paymentService from 'services/paymentService';

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
  paymentStatus: string;
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
  // Optional fields for compatibility
  orderNumber?: string;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress?: string;
  subtotal?: number;
  shippingFee?: number;
  tax?: number;
  notes?: string;
}

const OrderManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ordersPerPage, setOrdersPerPage] = useState<number>(10);
  const toast = useToast();

  // Fetch all orders from API
  const { data: ordersData, isLoading, error, refetch } = useQuery({
    // queryKey: ['/orders'],
    // queryFn: () => get('/orders'),
    queryKey: ['/orders/with-details'],
    queryFn: () => get('/orders/with-details'),
    staleTime: 30000, // Cache for 30 seconds
  });

  // Extract orders from API response or use empty array
  const orders: Order[] = useMemo(() => {
    const extractedOrders = ordersData?.data?.result?.data || [];
    console.log('Orders data from API:', extractedOrders);
    console.log('First order payment info:', extractedOrders[0]?.payment);
    return extractedOrders;
  }, [ordersData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  // Sử dụng helper functions từ paymentService
  const getPaymentStatusColor = (status: string) => {
    const statusInfo = paymentService.getPaymentStatusInfo(status);
    return `${statusInfo.bgColor} ${statusInfo.color}`;
  };

  const getPaymentStatusText = (status: string) => {
    return paymentService.getPaymentStatusInfo(status).name;
  };

  const getPaymentMethodText = (method: string) => {
    return paymentService.getPaymentMethodDisplayName(method);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };



  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
      const matchesSearch =
        (order.orderNumber || order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [orders, selectedStatus, searchTerm]);

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
      setShowOrderModal(false); // Close modal when changing page
      // Scroll to top of orders table
      window.scrollTo({
        top: document.getElementById('orders-table')?.offsetTop || 0,
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

  // Reset to first page when status filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchTerm]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      console.log(`Attempting to update order ${orderId} to status: ${newStatus}`);
      console.log('Payload:', { status: newStatus });

      // Try the most common pattern first: /orders/edit/:id
      let response;
      try {
        response = await put(`/orders/edit/${orderId}`, { status: newStatus });
        console.log('Success with PUT /orders/edit/:id');
      } catch (editError: any) {
        console.log('PUT /orders/edit/:id failed, trying PUT /orders/:id');
        response = await put(`/orders/${orderId}`, { status: newStatus });
        console.log('Success with PUT /orders/:id');
      }
      console.log('Update response:', response);

      // Refetch orders to get updated data
      refetch();
      console.log(`Order ${orderId} status updated to ${newStatus} successfully`);

      // Show success toast
      toast.success('Cập nhật thành công', `Đã cập nhật trạng thái đơn hàng thành "${getStatusText(newStatus)}"`);
    } catch (error: any) {
      console.error('Failed to update order status:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);

      // Show error toast
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định';
      const statusCode = error.response?.status || 'N/A';
      toast.error('Cập nhật thất bại', `Lỗi ${statusCode}: ${errorMessage}`);
    }
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: orders.length },
    { value: 'pending', label: 'Chờ xác nhận', count: orders.filter(o => o.status === 'pending').length },
    { value: 'confirmed', label: 'Đã xác nhận', count: orders.filter(o => o.status === 'confirmed').length },
    { value: 'processing', label: 'Đang xử lý', count: orders.filter(o => o.status === 'processing').length },
    { value: 'shipped', label: 'Đang giao', count: orders.filter(o => o.status === 'shipped').length },
    { value: 'delivered', label: 'Đã giao', count: orders.filter(o => o.status === 'delivered').length },
    { value: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-20">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không thể tải đơn hàng</h2>
          <p className="text-gray-600 mb-4">Đã xảy ra lỗi khi tải danh sách đơn hàng.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Theo dõi và quản lý tất cả đơn hàng</p>
        </div>
        
        {/* Search */}
        <div className="flex gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng, khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex flex-wrap border-b">
          {statusOptions.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                selectedStatus === status.value
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {status.label} ({status.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thanh toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody id="orders-table" className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{order.orderNumber || order.id.slice(0, 8)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.orderDetails?.length || 0} sản phẩm
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(order.order_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.payment ? (
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment.paymentStatus)}`}>
                          {getPaymentStatusText(order.payment.paymentStatus)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {getPaymentMethodText(order.payment.paymentMethod)}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Chưa thanh toán</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Xem chi tiết
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="shipped">Đang giao</option>
                      <option value="delivered">Đã giao</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
            <p className="text-gray-500">Không có đơn hàng nào phù hợp với bộ lọc hiện tại</p>
          </div>
        )}

        {/* Pagination - Always show when there are orders */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 bg-white rounded-lg shadow-sm border p-6">
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
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Chi tiết đơn hàng #{selectedOrder.orderNumber || selectedOrder.id.slice(0, 8)}
                </h2>
                <p className="text-sm text-gray-600">
                  Đặt ngày {formatDateTime(selectedOrder.order_date)}
                </p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin khách hàng</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Tên:</span> {selectedOrder.customer.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                    <p><span className="font-medium">Điện thoại:</span> {selectedOrder.customer.phone || 'Chưa có thông tin'}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Địa chỉ giao hàng</h3>
                  <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Order Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Trạng thái đơn hàng</h4>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Trạng thái thanh toán</h4>
                  {selectedOrder.payment ? (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedOrder.payment.paymentStatus)}`}>
                      {getPaymentStatusText(selectedOrder.payment.paymentStatus)}
                    </span>
                  ) : (
                    <span className="text-gray-500">Chưa có thông tin</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Phương thức thanh toán</h4>
                  <p className="text-gray-700">
                    {selectedOrder.payment ? getPaymentMethodText(selectedOrder.payment.paymentMethod) : 'Chưa có thông tin'}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Chi tiết đơn hàng</h3>
                {selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Sản phẩm</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">SKU</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Đơn giá</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Số lượng</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.orderDetails.map((item: OrderDetail) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">
                              <div className="flex items-center">
                                <img
                                  src={item.product.img && item.product.img.trim() !== ''
                                    ? item.product.img
                                    : 'https://via.placeholder.com/48x48?text=No+Image'}
                                  alt={item.product.name}
                                  className="w-12 h-12 object-cover rounded-lg mr-3"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48?text=No+Image';
                                  }}
                                />
                                <div>
                                  <span className="font-medium text-gray-900">{item.product.name}</span>
                                  {item.serial_numbers && (
                                    <div className="text-xs text-gray-500">
                                      Serial: {(() => {
                                        try {
                                          return JSON.parse(item.serial_numbers).join(', ');
                                        } catch {
                                          return item.serial_numbers;
                                        }
                                      })()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.product.sku}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatPrice(item.unit_price)}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatPrice(item.total_price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-500">Chi tiết sản phẩm chưa có sẵn</p>
                    <p className="text-sm text-gray-400 mt-1">Vui lòng liên hệ để biết thêm thông tin</p>
                  </div>
                )}
              </div>

              {/* Payment Information */}
              {selectedOrder.payment && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Thông tin thanh toán</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Mã giao dịch:</span>
                        <span className="font-mono text-sm">{selectedOrder.payment.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phương thức:</span>
                        <span>
                          {getPaymentMethodText(selectedOrder.payment.paymentMethod)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trạng thái:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.payment.paymentStatus)}`}>
                          {getPaymentStatusText(selectedOrder.payment.paymentStatus)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Số tiền gốc:</span>
                        <span>{formatPrice(selectedOrder.payment.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Giảm giá:</span>
                        <span className="text-green-600">-{formatPrice(selectedOrder.payment.discountAmount)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Số tiền thanh toán:</span>
                        <span className="text-blue-600">{formatPrice(selectedOrder.payment.finalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tổng kết đơn hàng</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mã đơn hàng:</span>
                    <span className="font-mono">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ngày tạo:</span>
                    <span>{formatDateTime(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cập nhật lần cuối:</span>
                    <span>{formatDateTime(selectedOrder.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số lượng sản phẩm:</span>
                    <span>{selectedOrder.orderDetails?.reduce((total, item) => total + item.quantity, 0) || 0} sản phẩm</span>
                  </div>
                  {selectedOrder.subtotal && (
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                  )}
                  {selectedOrder.shippingFee && (
                    <div className="flex justify-between">
                      <span>Phí vận chuyển:</span>
                      <span>{formatPrice(selectedOrder.shippingFee)}</span>
                    </div>
                  )}
                  {selectedOrder.tax && (
                    <div className="flex justify-between">
                      <span>Thuế:</span>
                      <span>{formatPrice(selectedOrder.tax)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{formatPrice(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Ghi chú</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                In đơn hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
