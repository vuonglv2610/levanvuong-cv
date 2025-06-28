import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, put } from "services/api";
import FormComponent from '../../components/Form';

const EditArticlePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  
  // Fetch article data
  const { data: articleData, isLoading: loadingArticle } = useQuery({ 
    queryKey: [`/articles/${params?.id}`], 
    queryFn: () => get(`/articles/${params?.id}`),
    staleTime: 60000
  });
  
  // Fetch categories for dropdown
  const { data: categoriesData, isLoading: loadingCategories } = useQuery({ 
    queryKey: ['/article-categories'], 
    queryFn: () => get('/article-categories'),
    staleTime: 60000
  });
  
  const article = articleData?.data?.result?.data || {};
  const categories = categoriesData?.data?.result?.data || [];
  
  const categoryOptions = categories.length > 0 
    ? categories.map((category: any) => ({
        value: category.id,
        label: category.name
      }))
    : [
        { value: "tech", label: "Công nghệ" },
        { value: "news", label: "Tin tức" },
        { value: "review", label: "Đánh giá" },
        { value: "tutorial", label: "Hướng dẫn" }
      ];

  const formFields = [
    {
      name: "title",
      label: "Tiêu đề bài viết",
      type: "text" as const,
      required: true,
      placeholder: "Nhập tiêu đề bài viết"
    },
    {
      name: "excerpt",
      label: "Mô tả ngắn",
      type: "textarea" as const,
      required: true,
      placeholder: "Nhập mô tả ngắn cho bài viết",
      rows: 3
    },
    {
      name: "content",
      label: "Nội dung bài viết",
      type: "textarea" as const,
      required: true,
      placeholder: "Nhập nội dung chi tiết bài viết",
      rows: 15
    },
    {
      name: "featuredImage",
      label: "Ảnh đại diện",
      type: "text" as const,
      placeholder: "URL ảnh đại diện"
    },
    {
      name: "categoryId",
      label: "Danh mục",
      type: "select" as const,
      required: true,
      options: categoryOptions
    },
    {
      name: "tags",
      label: "Tags",
      type: "text" as const,
      placeholder: "Nhập các tag, cách nhau bởi dấu phẩy"
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "select" as const,
      required: true,
      options: [
        { value: "draft", label: "Bản nháp" },
        { value: "published", label: "Xuất bản" },
        { value: "archived", label: "Lưu trữ" }
      ]
    },
    {
      name: "publishedAt",
      label: "Ngày xuất bản",
      type: "text" as const,
      placeholder: "YYYY-MM-DD HH:MM (để trống nếu xuất bản ngay)"
    }
  ];

  // Prepare initial data
  const initialData = {
    ...article,
    tags: Array.isArray(article.tags) ? article.tags.join(', ') : article.tags || '',
    publishedAt: article.publishedAt ? new Date(article.publishedAt).toISOString().slice(0, 16) : '',
    categoryId: article.categoryId || article.category?.id
  };

  const handleSubmit = async (formData: any) => {
    try {
      // Process tags
      if (formData.tags) {
        formData.tags = formData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      }
      
      // Set publishedAt to current time if status is published and no date is set
      if (formData.status === 'published' && !formData.publishedAt) {
        formData.publishedAt = new Date().toISOString();
      }
      
      const response = await put(`/articles/${params?.id}`, formData);
      
      if (response?.data) {
        navigate('/admin/articles');
        return { success: true, message: 'Cập nhật bài viết thành công!' };
      }
    } catch (error) {
      console.error('Error updating article:', error);
      return { success: false, message: 'Không thể cập nhật bài viết. Vui lòng thử lại.' };
    }
  };

  if (loadingArticle || loadingCategories) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!article.id) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài viết</h2>
        <p className="text-gray-600 mb-4">Bài viết bạn đang tìm không tồn tại.</p>
        <button 
          onClick={() => navigate('/admin/articles')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
        <p className="text-gray-600">Cập nhật thông tin bài viết: {article.title}</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <FormComponent
          title="Chỉnh sửa bài viết"
          fields={formFields}
          initialValues={initialData}
          onSubmit={handleSubmit}
          backUrl="/admin/articles"
          submitButtonText="Cập nhật bài viết"
          cancelButtonText="Hủy"
          invalidateQueryKey="/articles"
          redirectAfterSubmit="/admin/articles"
        />
      </div>
    </div>
  );
};

export default EditArticlePage;
