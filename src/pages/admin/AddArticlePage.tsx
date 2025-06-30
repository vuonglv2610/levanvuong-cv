import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from "services/api";
import FormComponent from '../../components/Form';

const AddArticlePage = () => {
  const navigate = useNavigate();
  
  // Fetch categories for dropdown
  const { data: categoriesData, isLoading: loadingCategories } = useQuery({ 
    queryKey: ['/article-categories'], 
    queryFn: () => get('/article-categories'),
    staleTime: 60000
  });
  
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
      type: "image" as const,
      placeholder: "URL ảnh đại diện"
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
  ];

  const handleSubmit = async (formData: any) => {
    try {
      const response = await post('/articles', formData);
      
      if (response?.data) {
        navigate('/admin/articles');
        return { success: true, message: 'Thêm bài viết thành công!' };
      }
    } catch (error) {
      console.error('Error adding article:', error);
      return { success: false, message: 'Không thể thêm bài viết. Vui lòng thử lại.' };
    }
  };

  if (loadingCategories) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thêm bài viết mới</h1>
        <p className="text-gray-600">Tạo bài viết mới cho website</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <FormComponent
          title="Thêm bài viết mới"
          fields={formFields}
          onSubmit={handleSubmit}
          backUrl="/admin/articles"
          submitButtonText="Thêm bài viết"
          cancelButtonText="Hủy"
          invalidateQueryKey="/articles"
          redirectAfterSubmit="/admin/articles"
        />
      </div>
    </div>
  );
};

export default AddArticlePage;
