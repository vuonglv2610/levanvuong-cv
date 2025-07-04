import React, { useState } from 'react';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangePickerProps {
  onDateRangeChange: (dateRange: DateRange) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeChange,
  initialStartDate,
  initialEndDate
}) => {
  const [startDate, setStartDate] = useState(initialStartDate || '');
  const [endDate, setEndDate] = useState(initialEndDate || '');
  const [selectedPreset, setSelectedPreset] = useState('');

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
        return {
          startDate: startDate,
          endDate: endDate
        };
    }
  };

  const handlePresetClick = (preset: string) => {
    setSelectedPreset(preset);
    const dateRange = getDateRange(preset);
    setStartDate(dateRange.startDate);
    setEndDate(dateRange.endDate);
    onDateRangeChange(dateRange);
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      setSelectedPreset('');
      onDateRangeChange({ startDate, endDate });
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (newStartDate && endDate) {
      setSelectedPreset('');
      onDateRangeChange({ startDate: newStartDate, endDate });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (startDate && newEndDate) {
      setSelectedPreset('');
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

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Chọn khoảng thời gian</h3>
        <div className="text-sm text-slate-500">
          {startDate && endDate && (
            <span>
              {new Date(startDate).toLocaleDateString('vi-VN')} - {new Date(endDate).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {presets.map((preset) => (
          <button
            key={preset.key}
            onClick={() => handlePresetClick(preset.key)}
            className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
              selectedPreset === preset.key
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Date Range */}
      <div className="border-t border-slate-200 pt-6">
        <h4 className="text-sm font-medium text-slate-700 mb-3">Hoặc chọn khoảng thời gian tùy chỉnh:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
        </div>
        
        {startDate && endDate && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleCustomDateChange}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              Áp dụng
            </button>
          </div>
        )}
      </div>

      {/* Quick Info */}
      {startDate && endDate && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">
            <strong>Khoảng thời gian đã chọn:</strong> {' '}
            {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} ngày
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
