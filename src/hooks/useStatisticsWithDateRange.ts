import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { DateRange } from '../components/common/DateRangeFilter';
import { get } from '../services/api';

interface UseStatisticsWithDateRangeProps {
  endpoint: string;
  additionalParams?: Record<string, any>;
  enabled?: boolean;
  staleTime?: number;
}

export const useStatisticsWithDateRange = ({
  endpoint,
  additionalParams = {},
  enabled = true,
  staleTime = 60000
}: UseStatisticsWithDateRangeProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });

  // Set default date range to last 30 days
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 29);
    
    setDateRange({
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });
  }, []);

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    
    // Add date range
    if (dateRange.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange.endDate) params.append('endDate', dateRange.endDate);
    
    // Add additional params
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    return params.toString();
  };

  const queryKey = [endpoint, dateRange, additionalParams];
  const queryFn = async () => {
    const queryString = buildQueryParams();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    console.log('Fetching URL:', url);
    const result = await get(url);
    console.log(`API Response for ${endpoint}:`, result);

    // Kiểm tra cấu trúc response và log chi tiết
    if (result?.data?.statusCode === 200) {
      console.log(`✅ Success response for ${endpoint}:`, result.data.result);
    } else {
      console.log(`❌ Unexpected response structure for ${endpoint}:`, result);
    }

    return result;
  };

  const query = useQuery({
    queryKey,
    queryFn,
    enabled: enabled && !!dateRange.startDate && !!dateRange.endDate,
    staleTime,
  });

  return {
    ...query,
    dateRange,
    setDateRange,
    buildQueryParams
  };
};

// Specific hooks for different statistics endpoints
export const useDashboardStatistics = () => {
  return useStatisticsWithDateRange({
    endpoint: '/statistics/dashboard'
  });
};

export const useRevenueStatistics = (groupBy: string = 'month') => {
  return useStatisticsWithDateRange({
    endpoint: '/statistics/revenue',
    additionalParams: { groupBy }
  });
};

export const useOrderStatistics = () => {
  return useStatisticsWithDateRange({
    endpoint: '/statistics/orders'
  });
};

export const useTopProductsStatistics = (limit: number = 10) => {
  return useStatisticsWithDateRange({
    endpoint: '/statistics/products/top',
    additionalParams: { limit }
  });
};

export const useCategoryStatistics = () => {
  return useStatisticsWithDateRange({
    endpoint: '/statistics/categories'
  });
};

export const useBrandStatistics = () => {
  return useStatisticsWithDateRange({
    endpoint: '/statistics/brands'
  });
};

export const usePaymentMethodStatistics = () => {
  return useStatisticsWithDateRange({
    endpoint: '/statistics/payment-methods'
  });
};

export const useCustomerStatistics = () => {
  return useStatisticsWithDateRange({
    endpoint: '/statistics/customers'
  });
};

export const useProductStatistics = () => {
  return useStatisticsWithDateRange({
    endpoint: '/statistics/products'
  });
};

// Hook for multiple statistics at once
export const useAllStatistics = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: ''
  });

  // Set default date range to last 30 days
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 29);
    
    setDateRange({
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });
  }, []);

  const buildQueryParams = (additionalParams: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    
    if (dateRange.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange.endDate) params.append('endDate', dateRange.endDate);
    
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    return params.toString();
  };

  const enabled = !!dateRange.startDate && !!dateRange.endDate;

  // Dashboard overview
  const dashboard = useQuery({
    queryKey: ['/statistics/dashboard', dateRange],
    queryFn: () => get(`/statistics/dashboard?${buildQueryParams()}`),
    enabled,
    staleTime: 60000,
  });

  // Revenue data
  const revenue = useQuery({
    queryKey: ['/statistics/revenue', dateRange],
    queryFn: () => get(`/statistics/revenue?${buildQueryParams({ groupBy: 'month' })}`),
    enabled,
    staleTime: 60000,
  });

  // Orders data
  const orders = useQuery({
    queryKey: ['/statistics/orders', dateRange],
    queryFn: () => get(`/statistics/orders?${buildQueryParams()}`),
    enabled,
    staleTime: 60000,
  });

  // Top products
  const topProducts = useQuery({
    queryKey: ['/statistics/products/top', dateRange],
    queryFn: () => get(`/statistics/products/top?${buildQueryParams({ limit: 10 })}`),
    enabled,
    staleTime: 60000,
  });

  // Categories
  const categories = useQuery({
    queryKey: ['/statistics/categories', dateRange],
    queryFn: () => get(`/statistics/categories?${buildQueryParams()}`),
    enabled,
    staleTime: 60000,
  });

  // Payment methods
  const paymentMethods = useQuery({
    queryKey: ['/statistics/payment-methods', dateRange],
    queryFn: () => get(`/statistics/payment-methods?${buildQueryParams()}`),
    enabled,
    staleTime: 60000,
  });

  const isLoading = dashboard.isLoading || revenue.isLoading || orders.isLoading || 
                   topProducts.isLoading || categories.isLoading || paymentMethods.isLoading;

  const refetchAll = () => {
    dashboard.refetch();
    revenue.refetch();
    orders.refetch();
    topProducts.refetch();
    categories.refetch();
    paymentMethods.refetch();
  };

  return {
    dateRange,
    setDateRange,
    isLoading,
    refetchAll,
    data: {
      dashboard: dashboard.data,
      revenue: revenue.data,
      orders: orders.data,
      topProducts: topProducts.data,
      categories: categories.data,
      paymentMethods: paymentMethods.data,
    },
    queries: {
      dashboard,
      revenue,
      orders,
      topProducts,
      categories,
      paymentMethods,
    }
  };
};
