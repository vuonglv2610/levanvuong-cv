import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from 'services/api';

interface ArticleStatsProps {
  className?: string;
}

const ArticleStats: React.FC<ArticleStatsProps> = ({ className = '' }) => {
  // Fetch article statistics
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['/articles/stats'],
    queryFn: () => get('/articles/stats'),
    staleTime: 300000, // 5 minutes
  });

  const stats = statsData?.data?.result?.data || {};

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      label: 'Tổng bài viết',
      value: stats.totalArticles || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Đã xuất bản',
      value: stats.publishedArticles || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Tổng lượt xem',
      value: stats.totalViews || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Bài viết tuần này',
      value: stats.weeklyArticles || 0,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê bài viết</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${item.bgColor} ${item.color} mb-3`}>
              {item.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatNumber(item.value)}
            </div>
            <div className="text-sm text-gray-600">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats */}
      {stats.topCategories && stats.topCategories.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Danh mục phổ biến</h4>
          <div className="space-y-2">
            {stats.topCategories.slice(0, 5).map((category: any, index: number) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: category.color || '#3B82F6' }}
                  ></div>
                  <span className="text-sm text-gray-700">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {category.articleCount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {stats.recentActivity && (
        <div className="mt-6 pt-6 border-t">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Hoạt động gần đây</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Hôm nay: {stats.recentActivity.today || 0} lượt xem</div>
            <div>Hôm qua: {stats.recentActivity.yesterday || 0} lượt xem</div>
            <div>Tuần này: {stats.recentActivity.thisWeek || 0} lượt xem</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleStats;
