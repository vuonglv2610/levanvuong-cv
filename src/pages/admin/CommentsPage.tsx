import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import useToast from '../../hooks/useToast';
import commentService, { Comment } from '../../services/commentService';

const CommentsPage = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedComments, setSelectedComments] = useState<string[]>([]);

  // Lấy danh sách tất cả comments
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['/comments'],
    queryFn: () => commentService.getAllComments(),
    staleTime: 30000,
  });

  const comments: Comment[] = (commentsData?.result?.data && Array.isArray(commentsData.result.data)) ? commentsData.result.data : [];

  // Mutation để xóa comment
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: () => {
      toast.success('Thành công', 'Comment đã được xóa!');
      queryClient.invalidateQueries({ queryKey: ['/comments'] });
    },
    onError: (error: Error) => {
      toast.error('Lỗi', error.message);
    },
  });

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa comment này?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const handleBulkDelete = () => {
    if (selectedComments.length === 0) {
      toast.error('Lỗi', 'Vui lòng chọn ít nhất một comment để xóa');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedComments.length} comment(s)?`)) {
      selectedComments.forEach(commentId => {
        deleteCommentMutation.mutate(commentId);
      });
      setSelectedComments([]);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const columns = [
    {
      key: 'select',
      title: (
        <input
          type="checkbox"
          checked={selectedComments.length === comments.length && comments.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedComments(comments.map(c => c.id));
            } else {
              setSelectedComments([]);
            }
          }}
        />
      ),
      render: (comment: Comment) => (
        <input
          type="checkbox"
          checked={selectedComments.includes(comment.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedComments([...selectedComments, comment.id]);
            } else {
              setSelectedComments(selectedComments.filter(id => id !== comment.id));
            }
          }}
        />
      ),
    },
    {
      key: 'customer',
      title: 'Khách hàng',
      render: (comment: Comment) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {comment.customer?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="font-medium">{comment.customer?.name || 'Người dùng'}</div>
            <div className="text-sm text-gray-500">{comment.customer?.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'product',
      title: 'Sản phẩm',
      render: (comment: Comment) => (
        <div className="flex items-center gap-2">
          {comment.product?.img && (
            <img
              src={comment.product.img}
              alt={comment.product.name}
              className="w-10 h-10 object-cover rounded"
            />
          )}
          <div>
            <div className="font-medium">{comment.product?.name || 'Sản phẩm'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      title: 'Đánh giá',
      render: (comment: Comment) => (
        <div className="flex items-center gap-2">
          {renderStars(comment.rating || 0)}
          <span className="text-sm text-gray-600">({comment.rating || 0}/5)</span>
        </div>
      ),
    },
    {
      key: 'comment',
      title: 'Nội dung',
      render: (comment: Comment) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-700 line-clamp-3">{comment.comment}</p>
        </div>
      ),
    },
    {
      key: 'isVerifiedPurchase',
      title: 'Đã mua',
      render: (comment: Comment) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            comment.isVerifiedPurchase
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {comment.isVerifiedPurchase ? 'Đã mua' : 'Chưa mua'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      render: (comment: Comment) => (
        <div className="text-sm text-gray-600">
          {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'Thao tác',
      render: (comment: Comment) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleDeleteComment(comment.id)}
            disabled={deleteCommentMutation.isPending}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Xóa
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quản lý Comments</h1>
        <div className="text-center py-8">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Comments</h1>
        
        {selectedComments.length > 0 && (
          <div className="flex gap-2">
            <span className="text-sm text-gray-600">
              Đã chọn {selectedComments.length} comment(s)
            </span>
            <button
              onClick={handleBulkDelete}
              disabled={deleteCommentMutation.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Xóa đã chọn
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Tổng cộng: {comments.length} comment(s)
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4 whitespace-nowrap">
                      {column.render ? column.render(comment) : (comment as any)[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Chưa có comment nào
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
