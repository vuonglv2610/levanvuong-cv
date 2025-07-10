import React, { useState } from 'react';
import { useAuthProvider } from '../contexts/AuthContext';
import { useCommentActions, useProductComments } from '../hooks/useComments';
import useToast from '../hooks/useToast';
import { Comment } from '../services/commentService';

interface ProductCommentsProps {
  productId: string;
}

const ProductComments: React.FC<ProductCommentsProps> = ({ productId }) => {
  const { userInfo, isAuthenticated } = useAuthProvider();
  const toast = useToast();

  const [isWritingComment, setIsWritingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState<number>(5);

  // Sử dụng hooks để lấy comments và actions
  const { data: commentsData, isLoading } = useProductComments(productId);
  const { createComment, updateComment, deleteComment, isCreating, isUpdating, isDeleting } = useCommentActions();

  const comments: Comment[] = (commentsData?.result?.data && Array.isArray(commentsData.result.data)) ? commentsData.result.data : [];

  const handleSubmitComment = () => {
    if (!commentText.trim()) {
      toast.error('Lỗi', 'Vui lòng nhập nội dung đánh giá');
      return;
    }

    if (editingCommentId) {
      // Cập nhật comment
      updateComment({
        commentId: editingCommentId,
        data: { comment: commentText, rating }
      });
      // Reset form sau khi submit
      setEditingCommentId(null);
      setIsWritingComment(false);
      setCommentText('');
      setRating(5);
    } else {
      // Tạo comment mới
      createComment({
        comment: commentText,
        rating,
        productId
      });
      // Reset form sau khi submit
      setIsWritingComment(false);
      setCommentText('');
      setRating(5);
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setCommentText(comment.comment);
    setRating(comment.rating || 5);
    setIsWritingComment(true);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setIsWritingComment(false);
    setCommentText('');
    setRating(5);
  };

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
      deleteComment(commentId);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (star: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`text-xl transition-all duration-200 ${
              star <= rating
                ? 'text-yellow-400 drop-shadow-sm'
                : 'text-gray-300'
            } ${
              interactive
                ? 'hover:text-yellow-400 hover:scale-110 cursor-pointer transform'
                : 'cursor-default'
            }`}
            onClick={() => interactive && onStarClick && onStarClick(star)}
            disabled={!interactive}
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            Đánh giá sản phẩm
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-blue-600">
              <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium">Đang tải đánh giá...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header với gradient */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl p-6 border-b border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          Đánh giá sản phẩm
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {comments.length} đánh giá
          </span>
        </h3>
      </div>

      <div className="p-6">
        {/* Form viết đánh giá */}
        {isAuthenticated && (
          <div className="mb-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 shadow-sm">
            {!isWritingComment ? (
              <button
                onClick={() => setIsWritingComment(true)}
                className="w-full text-left p-4 border-2 border-dashed border-gray-300 rounded-xl bg-white hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-gray-600 group-hover:text-blue-700 font-medium">
                    Viết đánh giá của bạn về sản phẩm này...
                  </span>
                </div>
              </button>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Đánh giá của bạn:
                  </label>
                  <div className="flex items-center gap-2">
                    {renderStars(rating, true, setRating)}
                    <span className="text-sm text-gray-500 ml-2">({rating}/5 sao)</span>
                  </div>
                </div>

                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này... Đánh giá chi tiết sẽ giúp người mua khác có thêm thông tin hữu ích."
                  className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
                  rows={5}
                />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSubmitComment}
                    disabled={isCreating || isUpdating}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    {isCreating || isUpdating ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {editingCommentId ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Danh sách đánh giá */}
        <div className="space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg font-medium">Chưa có đánh giá nào</p>
              <p className="text-gray-400 text-sm mt-1">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {comment.customer?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-800 text-lg">
                          {comment.customer?.name || 'Người dùng'}
                        </h4>
                        {comment.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Đã mua hàng
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center">
                          {renderStars(comment.rating || 0)}
                        </div>
                        <span className="text-sm text-gray-500 font-medium">
                          {comment.rating || 0}/5 sao
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Nút chỉnh sửa/xóa cho chủ sở hữu */}
                  {userInfo?.customerId === comment.customerId && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComment(comment)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Chỉnh sửa đánh giá"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={isDeleting}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                        title="Xóa đánh giá"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div className="ml-16">
                  <p className="text-gray-700 leading-relaxed text-base mb-3 bg-gray-50 p-4 rounded-lg border-l-4 border-blue-200">
                    {comment.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductComments;
