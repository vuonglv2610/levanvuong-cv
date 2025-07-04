import React, { useState, useEffect } from 'react';

export interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangeFilterProps {
  onDateRangeChange: (dateRange: DateRange) => void;
  initialStartDate?: string;
  initialEndDate?: string;
  className?: string;
  showPresets?: boolean;
  showCustomRange?: boolean;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  onDateRangeChange,
  initialStartDate,
  initialEndDate,
  className = '',
  showPresets = true,
  showCustomRange = true
}) => {
  const [startDate, setStartDate] = useState(initialStartDate || '');
  const [endDate, setEndDate] = useState(initialEndDate || '');
  const [selectedPreset, setSelectedPreset] = useState('');

  // Set default date range to last 30 days if no initial dates provided
  useEffect(() => {
    if (!initialStartDate && !initialEndDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 29);
      
      const defaultStartDate = thirtyDaysAgo.toISOString().split('T')[0];
      const defaultEndDate = today.toISOString().split('T')[0];
      
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
      onDateRangeChange({ startDate: defaultStartDate, endDate: defaultEndDate });
    }
  }, [initialStartDate, initialEndDate, onDateRangeChange]);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getDateRange = (preset: string): DateRange => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    switch (preset) {
      case 'today':
        return {
          startDate: formatDate(startOfToday),
          endDate: formatDate(startOfToday)
        };
      
      case 'yesterday':
        const yesterday = new Date(startOfToday);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          startDate: formatDate(yesterday),
          endDate: formatDate(yesterday)
        };
      
      case 'last7days':
        const last7Days = new Date(startOfToday);
        last7Days.setDate(last7Days.getDate() - 6);
        return {
          startDate: formatDate(last7Days),
          endDate: formatDate(startOfToday)
        };
      
      case 'last30days':
        const last30Days = new Date(startOfToday);
        last30Days.setDate(last30Days.getDate() - 29);
        return {
          startDate: formatDate(last30Days),
          endDate: formatDate(startOfToday)
        };
      
      case 'thisMonth':
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return {
          startDate: formatDate(thisMonthStart),
          endDate: formatDate(startOfToday)
        };
      
      case 'lastMonth':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return {
          startDate: formatDate(lastMonthStart),
          endDate: formatDate(lastMonthEnd)
        };
      
      case 'thisYear':
        const thisYearStart = new Date(today.getFullYear(), 0, 1);
        return {
          startDate: formatDate(thisYearStart),
          endDate: formatDate(startOfToday)
        };
      
      case 'lastYear':
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
        return {
          startDate: formatDate(lastYearStart),
          endDate: formatDate(lastYearEnd)
        };
      
      default:
        return { startDate, endDate };
    }
  };

  const handlePresetClick = (preset: string) => {
    setSelectedPreset(preset);
    const dateRange = getDateRange(preset);
    setStartDate(dateRange.startDate);
    setEndDate(dateRange.endDate);
    onDateRangeChange(dateRange);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    setSelectedPreset('');
    if (newStartDate && endDate) {
      onDateRangeChange({ startDate: newStartDate, endDate });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    setSelectedPreset('');
    if (startDate && newEndDate) {
      onDateRangeChange({ startDate, endDate: newEndDate });
    }
  };

  const presets = [
    { key: 'today', label: 'Hôm nay' },
    { key: 'yesterday', label: 'Hôm qua' },
    { key: 'last7days', label: '7 ngày qua' },
    { key: 'last30days', label: '30 ngày qua' },
    { key: 'thisMonth', label: 'Tháng này' },
    { key: 'lastMonth', label: 'Tháng trước' },
    { key: 'thisYear', label: 'Năm này' },
    { key: 'lastYear', label: 'Năm trước' }
  ];

  const getDaysDifference = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1;
    }
    return 0;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Chọn khoảng thời gian</h3>
          {startDate && endDate && (
            <span className="text-xs text-gray-500">
              {getDaysDifference()} ngày
            </span>
          )}
        </div>

        {/* Preset Buttons */}
        {showPresets && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.key}
                onClick={() => handlePresetClick(preset.key)}
                className={`px-3 py-2 text-xs rounded-md border transition-colors duration-200 ${
                  selectedPreset === preset.key
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {/* Custom Date Range */}
        {showCustomRange && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                min={startDate}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>
        )}

        {/* Date Range Display */}
        {startDate && endDate && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
            <div className="text-sm text-blue-700">
              <span className="font-medium">Khoảng thời gian:</span>{' '}
              {new Date(startDate).toLocaleDateString('vi-VN')} - {new Date(endDate).toLocaleDateString('vi-VN')}
            </div>
            <div className="text-xs text-blue-600">
              {getDaysDifference()} ngày
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilter;
