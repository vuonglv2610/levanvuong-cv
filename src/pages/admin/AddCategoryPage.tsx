import React from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from "services/api";
import FormComponent from '../../components/Form';

const AddCategoryPage = () => {
  const navigate = useNavigate();
  
  const formFields = [
    {
      name: "name",
      label: "Tên danh mục",
      type: "text" as const,
      required: true,
      placeholder: "Nhập tên danh mục",
      validation: {
        required: "Vui lòng nhập tên danh mục"
      }
    },
    {
      name: "description",
      label: "Mô tả",
      type: "textarea" as const,
      rows: 4,
      placeholder: "Nhập mô tả danh mục"
    }
  ];
  
  const handleSubmit = async (data: any) => {
    const dataAddNew = {
      name: data.name,
      description: data.description,
    };
    
    return await post('/categories', dataAddNew);
  };
  
  return (
    <FormComponent
      title="Thêm danh mục mới"
      fields={formFields}
      onSubmit={handleSubmit}
      backUrl="/admin/category"
      submitButtonText="Thêm danh mục"
      invalidateQueryKey="/categories"
      redirectAfterSubmit="/admin/category"
    />
  );
};

export default AddCategoryPage;
