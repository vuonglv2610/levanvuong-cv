import React, { useEffect, useState } from 'react';

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
  const [tempStartDate, setTempStartDate] = useState(initialStartDate || '');
  const [tempEndDate, setTempEndDate] = useState(initialEndDate || '');
  const [selectedPreset, setSelectedPreset] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

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
      setSelectedPreset('last30days');
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

  const handlePresetClick = async (preset: string) => {
    setIsApplying(true);
    try {
      setSelectedPreset(preset);
      const dateRange = getDateRange(preset);
      setStartDate(dateRange.startDate);
      setEndDate(dateRange.endDate);
      setTempStartDate(dateRange.startDate);
      setTempEndDate(dateRange.endDate);
      await onDateRangeChange(dateRange);
      setIsOpen(false);
    } finally {
      setIsApplying(false);
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setTempStartDate(newStartDate);
    setSelectedPreset('');
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setTempEndDate(newEndDate);
    setSelectedPreset('');
  };

  const handleApplyCustomRange = async () => {
    if (tempStartDate && tempEndDate) {
      setIsApplying(true);
      try {
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        await onDateRangeChange({ startDate: tempStartDate, endDate: tempEndDate });
        setIsOpen(false);
      } finally {
        setIsApplying(false);
      }
    }
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
  };

  const presets = [
    // { key: 'today', label: 'Hôm nay' },
    // { key: 'yesterday', label: 'Hôm qua' },
    // { key: 'last7days', label: '7 ngày qua' },
    { key: 'last30days', label: '30 ngày qua' },
    // { key: 'thisMonth', label: 'Tháng này' },
    // { key: 'lastMonth', label: 'Tháng trước' },
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

  const getPresetLabel = () => {
    const preset = presets.find(p => p.key === selectedPreset);
    return preset ? preset.label : 'Tùy chỉnh';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full max-w-xs md:max-w-none md:w-64 px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center min-w-0">
          <svg className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-700 truncate">
            {getPresetLabel()}
          </span>
        </div>
        <div className="flex items-center flex-shrink-0 ml-2">
          {startDate && endDate && (
            <span className="text-xs text-gray-500 mr-2 hidden sm:inline">
              {getDaysDifference()} ngày
            </span>
          )}
          <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 left-0 right-0 md:left-auto md:right-0 md:w-96 bg-white rounded-xl shadow-lg border border-gray-200 p-4 animate-fadeIn">
          <div className="flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-sm font-semibold text-gray-800">Chọn khoảng thời gian</h3>
              {startDate && endDate && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  {getDaysDifference()} ngày
                </span>
              )}
            </div>

            {/* Preset Buttons */}
            {showPresets && (
              <div className="grid grid-cols-2 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.key}
                    onClick={() => handlePresetClick(preset.key)}
                    disabled={isApplying}
                    className={`px-3 py-2 text-xs rounded-md border transition-all duration-200 flex items-center justify-center ${
                      selectedPreset === preset.key
                        ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                        : isApplying
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {isApplying && selectedPreset === preset.key && (
                      <svg className="animate-spin -ml-1 mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {/* Custom Date Range */}
            {showCustomRange && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Từ ngày
                    </label>
                    <input
                      type="date"
                      value={tempStartDate}
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
                      value={tempEndDate}
                      onChange={handleEndDateChange}
                      min={tempStartDate}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Action Buttons for Custom Range */}
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyCustomRange}
                    disabled={!tempStartDate || !tempEndDate || isApplying}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center ${
                      !tempStartDate || !tempEndDate || isApplying
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isApplying && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isApplying ? 'Đang áp dụng...' : 'Áp dụng'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isApplying}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isApplying
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Date Range Display */}
            {startDate && endDate && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-blue-50 rounded-md gap-2">
                <div className="text-sm text-blue-700">
                  <span className="font-medium">Khoảng thời gian:</span>{' '}
                  <span className="block sm:inline">
                    {new Date(startDate).toLocaleDateString('vi-VN')} - {new Date(endDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="text-xs text-blue-600 whitespace-nowrap">
                  {getDaysDifference()} ngày
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;








