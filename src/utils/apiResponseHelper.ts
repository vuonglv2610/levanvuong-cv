// Helper functions để xử lý các cấu trúc response API khác nhau

export interface ApiResponse {
  statusCode?: number;
  message?: string;
  result?: {
    data?: any;
  };
  data?: any;
  success?: boolean;
}

/**
 * Trích xuất dữ liệu từ response API với nhiều cấu trúc khác nhau
 */
export const extractApiData = (response: any): any => {
  if (!response) return null;

  // Cấu trúc 1: { statusCode, message, result: { data } } - Dashboard API
  if (response.data?.statusCode === 200 && response.data?.result?.data) {
    return response.data.result.data;
  }

  // Cấu trúc 2: { success, message, data } - Top Products API
  if (response.data?.success === true && response.data?.data) {
    return response.data.data;
  }

  // Cấu trúc 3: { data: { success, data } }
  if (response.data?.success && response.data?.data) {
    return response.data.data;
  }

  // Cấu trúc 4: { data: { result: { data } } }
  if (response.data?.result?.data) {
    return response.data.result.data;
  }

  // Cấu trúc 5: { data: [...] } - array trực tiếp
  if (response.data && Array.isArray(response.data)) {
    return response.data;
  }

  // Cấu trúc 6: { data: {...} } - object trực tiếp
  if (response.data && typeof response.data === 'object') {
    return response.data;
  }

  return null;
};

/**
 * Kiểm tra xem response có thành công không
 */
export const isSuccessResponse = (response: any): boolean => {
  if (!response) return false;

  // Kiểm tra statusCode
  if (response.data?.statusCode === 200) return true;
  
  // Kiểm tra success flag
  if (response.data?.success === true) return true;
  
  // Kiểm tra có data không
  if (response.data && (response.data.result || response.data.data)) return true;

  return false;
};

/**
 * Lấy dữ liệu dashboard từ response
 */
export const extractDashboardData = (response: any) => {
  const data = extractApiData(response);
  if (!data) return null;

  return {
    totalRevenue: data.revenue?.year || data.revenue?.month || data.totalRevenue || 0,
    totalOrders: data.orders?.total || data.totalOrders || 0,
    totalCustomers: data.customers?.total || data.totalCustomers || 0,
    totalProducts: data.products?.total || data.totalProducts || 0,
    revenueGrowth: data.revenueGrowth || 0,
    orderGrowth: data.orderGrowth || 0,
    customerGrowth: data.customerGrowth || 0,
    topSellingProduct: data.topSellingProduct || { name: '', soldQuantity: 0 }
  };
};

/**
 * Lấy dữ liệu revenue từ response
 */
export const extractRevenueData = (response: any) => {
  const data = extractApiData(response);
  if (!data) return [];

  // Nếu data là array (cấu trúc mới)
  if (Array.isArray(data)) {
    return data.map(item => ({
      period: item.period,
      revenue: item.total_revenue || item.revenue || 0,
      orderCount: item.total_transactions || item.orderCount || 0
    }));
  }

  // Nếu data có revenueByPeriod (cấu trúc cũ)
  if (data.revenueByPeriod && Array.isArray(data.revenueByPeriod)) {
    return data.revenueByPeriod.map((item: any) => ({
      period: item.period,
      revenue: item.revenue || 0,
      orderCount: item.orderCount || 0
    }));
  }

  return [];
};

/**
 * Lấy dữ liệu top products từ response
 */
export const extractTopProductsData = (response: any) => {
  const data = extractApiData(response);
  if (!data) return [];

  if (Array.isArray(data)) {
    return data.map((item, index) => ({
      productId: item.id || item.productId,
      name: item.name || 'Unknown Product',
      sku: item.sku || 'N/A',
      price: item.price || 0,
      img: item.img || '',
      brandName: item.brand_name || item.brandName || 'Unknown Brand',
      categoryName: item.category_name || item.categoryName || 'Unknown Category',
      soldQuantity: item.sold_quantity || item.soldQuantity || 0,
      revenue: item.total_revenue || item.revenue || 0,
      rank: index + 1 // Tự động tạo rank dựa trên thứ tự
    }));
  }

  return [];
};

/**
 * Lấy dữ liệu categories từ response
 */
export const extractCategoriesData = (response: any) => {
  const data = extractApiData(response);
  if (!data) return [];

  if (Array.isArray(data)) {
    // Tính tổng để tính percentage
    const totalRevenue = data.reduce((sum, item) => sum + (item.total_revenue || 0), 0);
    const totalSoldQuantity = data.reduce((sum, item) => sum + parseInt(item.sold_quantity || '0'), 0);

    return data.map(item => {
      const revenue = item.total_revenue || 0;
      const soldQuantity = parseInt(item.sold_quantity || '0');

      return {
        categoryId: item.id,
        name: item.category_name || item.name || 'Unknown Category',
        productCount: item.total_products || item.productCount || 0,
        soldQuantity: soldQuantity,
        revenue: revenue,
        // Tính percentage dựa trên revenue hoặc sold quantity
        percentage: totalRevenue > 0 ? (revenue / totalRevenue * 100) :
                   totalSoldQuantity > 0 ? (soldQuantity / totalSoldQuantity * 100) : 0
      };
    }).filter(item => item.revenue > 0 || item.soldQuantity > 0); // Chỉ lấy categories có dữ liệu
  }

  return [];
};

/**
 * Lấy dữ liệu orders từ response
 */
export const extractOrdersData = (response: any) => {
  const data = extractApiData(response);
  if (!data) return [];

  // Nếu có ordersByStatus
  if (data.ordersByStatus && Array.isArray(data.ordersByStatus)) {
    return data.ordersByStatus.map((item: any) => ({
      status: item.status,
      count: item.count || 0,
      percentage: item.percentage || 0,
      totalAmount: item.total_amount || item.totalAmount || 0
    }));
  }

  // Nếu data là array trực tiếp (cấu trúc thực tế)
  if (Array.isArray(data)) {
    // Tính tổng để tính percentage
    const totalCount = data.reduce((sum, item) => sum + (item.count || 0), 0);

    return data.map(item => ({
      status: item.status,
      count: item.count || 0,
      totalAmount: item.total_amount || item.totalAmount || 0,
      percentage: totalCount > 0 ? (item.count / totalCount * 100) : 0
    }));
  }

  return [];
};

/**
 * Lấy dữ liệu payment methods từ response
 */
export const extractPaymentMethodsData = (response: any) => {
  const data = extractApiData(response);
  if (!data) return [];

  if (Array.isArray(data)) {
    // Tính tổng để tính percentage
    const totalAmount = data.reduce((sum, item) => sum + (item.total_amount || 0), 0);
    const totalCount = data.reduce((sum, item) => sum + (item.count || 0), 0);

    return data.map(item => {
      const amount = item.total_amount || item.amount || 0;
      const count = item.count || item.transaction_count || 0;

      // Tạo tên hiển thị cho payment method
      const methodLabels: { [key: string]: string } = {
        'vnpay': 'VNPay',
        'momo': 'MoMo',
        'zalopay': 'ZaloPay',
        'cash': 'Tiền mặt',
        'bank_transfer': 'Chuyển khoản',
        'credit_card': 'Thẻ tín dụng',
        'debit_card': 'Thẻ ghi nợ'
      };

      return {
        method: item.paymentMethod || item.payment_method || item.method,
        methodLabel: methodLabels[item.paymentMethod] || methodLabels[item.payment_method] || item.paymentMethod || 'Unknown',
        count: count,
        amount: amount,
        percentage: totalAmount > 0 ? (amount / totalAmount * 100) :
                   totalCount > 0 ? (count / totalCount * 100) : 0
      };
    });
  }

  return [];
};
