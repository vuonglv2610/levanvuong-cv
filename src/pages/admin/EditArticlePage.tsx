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
  

  
  const article = articleData?.data?.result?.data || {};



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
      name: "img",
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
    }
  ];

  // Prepare initial data
  const initialData = {
    title: article.title || '',
    content: article.content || '',
    img: article.img || '',
    status: article.status || 'draft'
  };

  const handleSubmit = async (formData: any) => {
    try {
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

  if (loadingArticle) {
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
