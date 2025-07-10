import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import commentService, { CreateCommentData, UpdateCommentData } from '../services/commentService';
import useToast from './useToast';

// Hook để lấy comments theo sản phẩm
export const useProductComments = (productId: string) => {
  return useQuery({
    queryKey: [`/comments/product/${productId}`],
    queryFn: () => commentService.getCommentsByProduct(productId),
    staleTime: 30000,
    enabled: !!productId,
  });
};

// Hook để lấy comments theo khách hàng
export const useCustomerComments = (customerId: string) => {
  return useQuery({
    queryKey: [`/comments/customer/${customerId}`],
    queryFn: () => commentService.getCommentsByCustomer(customerId),
    staleTime: 30000,
    enabled: !!customerId,
  });
};

// Hook để lấy tất cả comments (admin)
export const useAllComments = () => {
  return useQuery({
    queryKey: ['/comments'],
    queryFn: () => commentService.getAllComments(),
    staleTime: 30000,
  });
};

// Hook để lấy một comment cụ thể
export const useComment = (commentId: string) => {
  return useQuery({
    queryKey: [`/comments/${commentId}`],
    queryFn: () => commentService.getCommentById(commentId),
    staleTime: 30000,
    enabled: !!commentId,
  });
};

// Hook để tạo comment mới
export const useCreateComment = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) => commentService.createComment(data),
    onSuccess: (response, variables) => {
      toast.success('Thành công', 'Đánh giá của bạn đã được gửi!');
      
      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: [`/comments/product/${variables.productId}`] });
      queryClient.invalidateQueries({ queryKey: ['/comments'] });
    },
    onError: (error: Error) => {
      toast.error('Lỗi', error.message);
    },
  });
};

// Hook để cập nhật comment
export const useUpdateComment = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, data }: { commentId: string; data: UpdateCommentData }) =>
      commentService.updateComment(commentId, data),
    onSuccess: (response, variables) => {
      toast.success('Thành công', 'Đánh giá đã được cập nhật!');
      
      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: [`/comments/${variables.commentId}`] });
      queryClient.invalidateQueries({ queryKey: ['/comments'] });
      
      // Invalidate product comments nếu có thông tin sản phẩm
      if (response.result?.data && typeof response.result.data === 'object' && 'productId' in response.result.data) {
        queryClient.invalidateQueries({
          queryKey: [`/comments/product/${(response.result.data as any).productId}`]
        });
      }
    },
    onError: (error: Error) => {
      toast.error('Lỗi', error.message);
    },
  });
};

// Hook để xóa comment
export const useDeleteComment = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: (response, commentId) => {
      toast.success('Thành công', 'Đánh giá đã được xóa!');
      
      // Invalidate các queries liên quan
      queryClient.invalidateQueries({ queryKey: [`/comments/${commentId}`] });
      queryClient.invalidateQueries({ queryKey: ['/comments'] });
      
      // Invalidate tất cả product comments vì không biết comment thuộc sản phẩm nào
      queryClient.invalidateQueries({ 
        predicate: (query) => {
          return query.queryKey[0] === '/comments/product';
        }
      });
    },
    onError: (error: Error) => {
      toast.error('Lỗi', error.message);
    },
  });
};

// Hook tổng hợp để quản lý comments
export const useCommentActions = () => {
  const createComment = useCreateComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  return {
    createComment: createComment.mutate,
    updateComment: updateComment.mutate,
    deleteComment: deleteComment.mutate,
    isCreating: createComment.isPending,
    isUpdating: updateComment.isPending,
    isDeleting: deleteComment.isPending,
    isLoading: createComment.isPending || updateComment.isPending || deleteComment.isPending,
  };
};
