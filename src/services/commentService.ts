import { get, post, put, remove } from './api';

// Comment interfaces
export interface Comment {
  id: string;
  comment: string;
  rating?: number;
  customerId: string;
  productId: string;
  isVerifiedPurchase?: boolean;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  product?: {
    id: string;
    name: string;
    img?: string;
  };
}

export interface CreateCommentData {
  comment: string;
  rating?: number;
  productId: string;
}

export interface UpdateCommentData {
  comment?: string;
  rating?: number;
}

export interface CommentResponse {
  statusCode: number;
  message: string;
  result: {
    data: Comment | Comment[];
  };
}

class CommentService {
  /**
   * Lấy tất cả comments
   */
  async getAllComments(): Promise<CommentResponse> {
    try {
      const response = await get('/comments');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách comments');
    }
  }

  /**
   * Lấy comments theo sản phẩm
   */
  async getCommentsByProduct(productId: string): Promise<CommentResponse> {
    try {
      const response = await get(`/comments/product/${productId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy comments của sản phẩm');
    }
  }

  /**
   * Lấy comments theo khách hàng
   */
  async getCommentsByCustomer(customerId: string): Promise<CommentResponse> {
    try {
      const response = await get(`/comments/customer/${customerId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy comments của khách hàng');
    }
  }

  /**
   * Lấy một comment cụ thể
   */
  async getCommentById(commentId: string): Promise<CommentResponse> {
    try {
      const response = await get(`/comments/${commentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin comment');
    }
  }

  /**
   * Tạo comment mới
   */
  async createComment(commentData: CreateCommentData): Promise<CommentResponse> {
    try {
      const response = await post('/comments', commentData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Lỗi khi tạo comment';
      
      // Xử lý các lỗi đặc biệt
      if (error.response?.status === 403) {
        throw new Error('Bạn chỉ có thể đánh giá sản phẩm đã mua');
      }
      if (error.response?.status === 401) {
        throw new Error('Bạn cần đăng nhập để đánh giá sản phẩm');
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Cập nhật comment
   */
  async updateComment(commentId: string, commentData: UpdateCommentData): Promise<CommentResponse> {
    try {
      const response = await put(`/comments/${commentId}`, commentData);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Lỗi khi cập nhật comment';
      
      if (error.response?.status === 403) {
        throw new Error('Bạn không có quyền chỉnh sửa comment này');
      }
      if (error.response?.status === 404) {
        throw new Error('Comment không tồn tại');
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Xóa comment
   */
  async deleteComment(commentId: string): Promise<CommentResponse> {
    try {
      const response = await remove(`/comments/${commentId}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Lỗi khi xóa comment';
      
      if (error.response?.status === 403) {
        throw new Error('Bạn không có quyền xóa comment này');
      }
      if (error.response?.status === 404) {
        throw new Error('Comment không tồn tại');
      }
      
      throw new Error(errorMessage);
    }
  }
}

export const commentService = new CommentService();
export default commentService;
