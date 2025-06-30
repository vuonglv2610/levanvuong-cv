import React from 'react';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    featuredImage?: string;
    publishedAt: string;
    views?: number;
    readTime?: number;
    category?: {
      id: string;
      name: string;
      color?: string;
    };
    author?: {
      id: string;
      name: string;
      avatar?: string;
    };
    tags?: string[];
  };
  variant?: 'default' | 'featured' | 'compact';
  showAuthor?: boolean;
  showCategory?: boolean;
  showStats?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'default',
  showAuthor = true,
  showCategory = true,
  showStats = true
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = () => {
    if (article.readTime) return `${article.readTime} phút đọc`;
    // Estimate read time based on content length (rough calculation)
    const wordsPerMinute = 200;
    const wordCount = article.excerpt.split(' ').length * 10; // Rough estimate
    return `${Math.ceil(wordCount / wordsPerMinute)} phút đọc`;
  };

  if (variant === 'featured') {
    return (
      <Link
        to={`/articles/${article.id}`}
        className="group block bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div className="relative">
          <img
            src={article.featuredImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop'}
            alt={article.title}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {showCategory && article.category && (
            <div className="absolute top-4 left-4">
              <span 
                className="px-3 py-1 text-xs font-medium text-white rounded-full"
                style={{ backgroundColor: article.category.color || '#3B82F6' }}
              >
                {article.category.name}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {article.title}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            {showAuthor && article.author && (
              <div className="flex items-center">
                <img
                  src={article.author.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                  alt={article.author.name}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{article.author.name}</p>
                  <p className="text-xs text-gray-500">{formatDate(article.publishedAt)}</p>
                </div>
              </div>
            )}
            
            {showStats && (
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {article.views?.toLocaleString() || 0}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {getReadTime()}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/articles/${article.id}`}
        className="group flex bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-200"
      >
        <img
          src={article.featuredImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=150&fit=crop'}
          alt={article.title}
          className="w-24 h-20 object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="p-4 flex-1">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatDate(article.publishedAt)}</span>
            {showStats && (
              <span>{article.views?.toLocaleString() || 0} lượt xem</span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group block bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
    >
      <div className="relative">
        <img
          src={article.featuredImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop'}
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {showCategory && article.category && (
          <div className="absolute top-3 left-3">
            <span 
              className="px-2 py-1 text-xs font-medium text-white rounded-md"
              style={{ backgroundColor: article.category.color || '#3B82F6' }}
            >
              {article.category.name}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {article.excerpt}
        </p>
        
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          {showAuthor && article.author && (
            <div className="flex items-center">
              <img
                src={article.author.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face'}
                alt={article.author.name}
                className="w-6 h-6 rounded-full mr-2"
              />
              <span className="text-xs text-gray-500">{article.author.name}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>{formatDate(article.publishedAt)}</span>
            {showStats && (
              <span>{article.views?.toLocaleString() || 0} lượt xem</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
