/**
 * Format số thành định dạng tiền tệ VND
 */
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('vi-VN') + '₫';
};

/**
 * Format ngày tháng theo định dạng Việt Nam
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN');
};

/**
 * Format phần trăm
 */
export const formatPercentage = (value: number): string => {
  return (value >= 0 ? '+' : '') + value.toFixed(1) + '%';
};