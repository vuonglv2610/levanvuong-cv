import { get, post, put } from './api';

export interface PaymentData {
  customerId: string;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet' | 'momo' | 'zalopay' | 'vnpay';
  voucherId?: string;
  description?: string;
}

// Interface cho response thực tế từ API
export interface ApiResponse<T> {
  statusCode: number | string;
  message: string;
  result: {
    data?: T;
    token?: {
      payment: {
        id: string;
        orderId: string;
        customerId: string;
        amount: number;
        paymentMethod: string;
        paymentStatus: string;
        transactionId: string;
        paymentDate: string | null;
        description: string;
        voucherId: string | null;
        discountAmount: number;
        finalAmount: number;
        paymentGatewayResponse: any;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
        order: {
          id: string;
          order_date: string;
          status: string;
          total_amount: number;
        };
        customer: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
        };
        voucher: any;
      };
      vnpayUrl?: string;
    };
  };
}

// Interface cho payment response mong đợi
export interface PaymentResponse {
  success: boolean;
  data: {
    payment: {
      id: string;
      orderId: string;
      customerId: string;
      amount: number;
      paymentMethod: string;
      paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
      transactionId: string;
      finalAmount: number;
      discountAmount: number;
    };
    order: {
      id: string;
      customerId: string;
      status: string;
      total_amount: number;
    };
    vnpayUrl?: string; // URL để redirect đến VNPay
  };
  message: string;
}

// Interface cho user data trong response hiện tại
export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  google_id: string;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  accountType: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  data: {
    id: string;
    paymentStatus: string;
    paymentMethod: string;
    amount: number;
    finalAmount: number;
    transactionId: string;
    order: {
      id: string;
      status: string;
    };
  };
  message: string;
}

class PaymentService {
  /**
   * Tạo thanh toán từ giỏ hàng
   */
  async createPaymentFromCart(paymentData: PaymentData): Promise<ApiResponse<any>> {
    try {
      const response = await post('/payments/create-from-cart', paymentData);

      // Log để debug response structure
      console.log('Payment API Response:', JSON.stringify(response, null, 2));
      console.log('Response data:', JSON.stringify(response.data, null, 2));

      // Kiểm tra các cấu trúc response có thể có
      if (response.data) {
        // Trường hợp 1: Response có statusCode
        if (response.data.statusCode === 200) {
          return response.data;
        }
        // Trường hợp 2: Response trực tiếp là data (không có statusCode wrapper)
        else if (response.status === 200) {
          // Wrap response trong format mong đợi
          return {
            statusCode: 200,
            message: 'Success',
            result: {
              data: response.data
            }
          };
        }
        // Trường hợp 3: Response có success flag
        else if (response.data.success === true) {
          return {
            statusCode: 200,
            message: response.data.message || 'Success',
            result: {
              data: response.data.data || response.data
            }
          };
        }
        // Log cấu trúc không mong đợi để debug
        else {
          console.warn('Unexpected response structure:', {
            hasStatusCode: 'statusCode' in response.data,
            statusCode: response.data.statusCode,
            hasSuccess: 'success' in response.data,
            success: response.data.success,
            responseStatus: response.status,
            keys: Object.keys(response.data)
          });

          // Thử trả về response như hiện tại để xem có hoạt động không
          return {
            statusCode: 200,
            message: 'Success',
            result: {
              data: response.data
            }
          };
        }
      } else {
        throw new Error('No data in response from payment API');
      }
    } catch (error: any) {
      console.error('Payment creation error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error config:', error.config);

      // More detailed error logging
      if (error.response) {
        console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }

      // Provide more specific error messages
      let errorMessage = 'Lỗi khi tạo thanh toán';

      if (error.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy API thanh toán. Vui lòng kiểm tra cấu hình server.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi server nội bộ. Vui lòng thử lại sau.';
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Lấy thông tin thanh toán theo ID
   */
  async getPaymentById(paymentId: string): Promise<PaymentStatusResponse> {
    try {
      const response = await get(`/payment/${paymentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin thanh toán');
    }
  }

  /**
   * Xử lý thanh toán (cập nhật trạng thái)
   */
  async processPayment(
    paymentId: string, 
    paymentStatus: string, 
    paymentGatewayResponse?: any
  ): Promise<any> {
    try {
      const response = await put(`/payment/process/${paymentId}`, {
        paymentStatus,
        paymentGatewayResponse
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi khi xử lý thanh toán');
    }
  }

  /**
   * Kiểm tra kết quả thanh toán VNPay
   */
  async checkVNPayResult(queryParams: URLSearchParams): Promise<any> {
    try {
      const response = await get(`/payment/check-vnpay?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi khi kiểm tra kết quả VNPay');
    }
  }

  /**
   * Hoàn tiền
   */
  async refundPayment(paymentId: string, refundAmount: number): Promise<any> {
    try {
      const response = await put(`/payment/refund/${paymentId}`, {
        refundAmount
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi khi hoàn tiền');
    }
  }

  /**
   * Lấy thống kê thanh toán (cho admin)
   */
  async getPaymentStatistics(): Promise<any> {
    try {
      const response = await get('/payment/statistics');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thống kê thanh toán');
    }
  }

  /**
   * Validate payment method
   */
  isValidPaymentMethod(method: string): boolean {
    const validMethods = ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'e_wallet', 'momo', 'zalopay', 'vnpay'];
    return validMethods.includes(method);
  }

  /**
   * Get payment method display name
   */
  getPaymentMethodDisplayName(method: string): string {
    const displayNames: { [key: string]: string } = {
      'cash': 'Thanh toán khi nhận hàng (COD)',
      'credit_card': 'Thẻ tín dụng',
      'debit_card': 'Thẻ ghi nợ',
      'bank_transfer': 'Chuyển khoản ngân hàng',
      'e_wallet': 'Ví điện tử',
      'momo': 'Ví MoMo',
      'zalopay': 'ZaloPay',
      'vnpay': 'VNPay'
    };
    return displayNames[method] || method;
  }

  /**
   * Get payment status display name and color
   */
  getPaymentStatusInfo(status: string): { name: string; color: string; bgColor: string } {
    const statusInfo: { [key: string]: { name: string; color: string; bgColor: string } } = {
      'pending': { name: 'Chờ thanh toán', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      'processing': { name: 'Đang xử lý', color: 'text-blue-600', bgColor: 'bg-blue-100' },
      'completed': { name: 'Đã thanh toán', color: 'text-green-600', bgColor: 'bg-green-100' },
      'failed': { name: 'Thanh toán thất bại', color: 'text-red-600', bgColor: 'bg-red-100' },
      'cancelled': { name: 'Đã hủy', color: 'text-gray-600', bgColor: 'bg-gray-100' },
      'refunded': { name: 'Đã hoàn tiền', color: 'text-purple-600', bgColor: 'bg-purple-100' }
    };
    return statusInfo[status] || { name: status, color: 'text-gray-600', bgColor: 'bg-gray-100' };
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
}

export default new PaymentService();
