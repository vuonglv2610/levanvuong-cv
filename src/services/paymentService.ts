import { get, post, put } from './api';

export interface PaymentData {
  customerId: string;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'e_wallet' | 'momo' | 'zalopay' | 'vnpay';
  voucherId?: string;
  description?: string;
  returnUrl?: string; // URL để VNPay redirect về sau khi thanh toán
  cancelUrl?: string; // URL để VNPay redirect về khi hủy thanh toán
}

// Interface cho response thực tế từ API
export interface ApiResponse<T> {
  statusCode: number | string;
  message: string;
  result: {
    data?: T & {
      vnpayUrl?: string; // Thêm vnpayUrl vào data level
      payment?: {
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
    };
    token?: {
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
      vnpayUrl?: string;
    };
  };
  vnpayUrl?: string; // Thêm vnpayUrl vào root level
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
  statusCode: number;
  message: string;
  result: {
    data: {
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
  };
}

class PaymentService {
  /**
   * Tạo thanh toán từ giỏ hàng
   */
  async createPaymentFromCart(paymentData: PaymentData): Promise<ApiResponse<any>> {
    try {
      const response = await post('/payments/create-from-cart', paymentData);

      // Xử lý response
      if (response.data) {
        if (response.data.statusCode === 200 || response.data.statusCode === 201) {
          return response.data;
        } else if (response.status === 200) {
          return {
            statusCode: 200,
            message: 'Success',
            result: {
              data: response.data
            }
          };
        } else if (response.data.success === true) {
          return {
            statusCode: 200,
            message: response.data.message || 'Success',
            result: {
              data: response.data.data || response.data
            }
          };
        } else {
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
      let errorMessage = 'Lỗi khi tạo thanh toán';

      if (error.response?.status === 401) {
        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bạn không có quyền thực hiện thao tác này.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Không tìm thấy API thanh toán. Vui lòng kiểm tra cấu hình server.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Lỗi server nội bộ. Vui lòng thử lại sau.';
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
      const response = await get(`/payments/${paymentId}`);
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

const paymentService = new PaymentService();
export default paymentService;
