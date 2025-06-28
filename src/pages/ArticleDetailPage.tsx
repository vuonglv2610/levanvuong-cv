import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { get, post } from 'services/api';

const ArticleDetailPage = () => {
  const { id } = useParams();

  // Fetch article data
  const { data: articleData, isLoading, error } = useQuery({
    queryKey: [`/articles/${id}`],
    queryFn: () => get(`/articles/${id}`),
    staleTime: 60000,
    enabled: !!id
  });

  // Fetch related articles
  const { data: relatedData } = useQuery({
    queryKey: [`/articles/related/${id}`],
    queryFn: () => get(`/articles/related/${id}?limit=4`),
    staleTime: 60000,
    enabled: !!id
  });

  const article = articleData?.data?.result?.data || {};
  const relatedArticles = relatedData?.data?.result?.data || [];

  // Increment view count
  useEffect(() => {
    if (article.id) {
      post(`/articles/${article.id}/view`, {}).catch(console.error);
    }
  }, [article.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content: string) => {
    // Simple formatting - in real app, you might use a rich text editor output
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article.id) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài viết</h2>
            <p className="text-gray-600 mb-4">Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.</p>
            <Link 
              to="/articles"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại danh sách bài viết
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/articles" className="hover:text-blue-600 transition-colors">Bài viết</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{article.title}</span>
        </nav>

        {/* Article Content */}
        <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Featured Image */}
          {article.featuredImage && (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <div className="p-6 md:p-8">
            {/* Category */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {article.category?.name || 'Chưa phân loại'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 border-t border-b border-gray-200 mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <img
                  src={article.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face'}
                  alt={article.author?.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-medium text-gray-900">{article.author?.name || 'Admin'}</div>
                  <div className="text-sm text-gray-600">{formatDate(article.publishedAt)}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {article.views?.toLocaleString() || 0} lượt xem
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {formatContent(article.content || '')}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((relatedArticle: any) => (
                <Link
                  key={relatedArticle.id}
                  to={`/articles/${relatedArticle.id}`}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex">
                    <img
                      src={relatedArticle.featuredImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=150&fit=crop'}
                      alt={relatedArticle.title}
                      className="w-32 h-24 object-cover flex-shrink-0"
                    />
                    <div className="p-4 flex-1">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                      <div className="text-xs text-gray-500 mt-2">
                        {formatDate(relatedArticle.publishedAt)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Articles */}
        <div className="mt-8 text-center">
          <Link
            to="/articles"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách bài viết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
