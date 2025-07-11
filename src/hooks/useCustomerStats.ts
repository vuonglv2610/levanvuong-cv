import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getCustomerStatisticsSummary } from 'services/api';

// Type definitions for customer statistics based on actual API response
interface OrderSummary {
  totalOrders: number;
  completedOrders: number;
  processingOrders: number;
  totalSpent: number;
}

interface OrdersByStatus {
  total: number;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface MonthlyStats {
  month: string;
  order_count: number;
  total_spent: number;
}

interface RecentOrder {
  id: string;
  order_date: string;
  status: string;
  total_amount: number;
}

interface PaymentStatus {
  count: number;
  amount: number;
}

interface CustomerStatsData {
  orders: {
    summary: OrderSummary;
    ordersByStatus: OrdersByStatus;
    monthlyStats: MonthlyStats[];
    recentOrders: RecentOrder[];
  };
  payments: {
    pending: PaymentStatus;
    paid: PaymentStatus;
    failed: PaymentStatus;
    refunded: PaymentStatus;
  };
  customerId: string;
}

export const useCustomerStats = (isCustomer: boolean, customerId?: string) => {
  const result = useQuery({
    queryKey: ['customer-statistics-summary', customerId],
    queryFn: getCustomerStatisticsSummary,
    enabled: isCustomer && !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    select: (data: any) => {
      // Transform API response to expected format
      return data?.data?.result?.data || null;
    }
  });

  // Handle success/error logging (only log once when data changes)
  React.useEffect(() => {
    if (result.data && !result.isLoading && !result.error) {
      console.log('✅ Customer statistics loaded:', result.data);
    }
  }, [result.data, result.isLoading, result.error]);

  React.useEffect(() => {
    if (result.error) {
      console.error('❌ Failed to fetch customer statistics:', result.error);
    }
  }, [result.error]);

  return {
    ...result,
    // Provide typed data access
    stats: result.data as CustomerStatsData | null
  };
};
