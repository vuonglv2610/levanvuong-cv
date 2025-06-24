import React from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from 'services/api';
import FormComponent from '../../components/Form';

const AddBrandPage = () => {
  const navigate = useNavigate();

  const formFields = [
    {
      name: "name",
      label: "Tên thương hiệu",
      type: "text" as const,
      required: true,
      placeholder: "Nhập tên thương hiệu",
      validation: {
        required: "Vui lòng nhập tên thương hiệu"
      }
    },
    {
      name: "description",
      label: "Mô tả",
      type: "textarea" as const,
      rows: 4,
      placeholder: "Nhập mô tả thương hiệu"
    },
    {
      name: "logo",
      label: "Logo",
      type: "image" as const
    }
  ];

  const handleSubmit = async (data: any) => {
    const dataAddNew = {
      name: data.name,
      description: data.description || null,
      logo: data.logo || null
    };
    return await post('/brands', dataAddNew);
  };

  return (
    <FormComponent
      title="Thêm thương hiệu mới"
      fields={formFields}
      onSubmit={handleSubmit}
      backUrl="/admin/brand"
      submitButtonText="Thêm thương hiệu"
      invalidateQueryKey="/brands"
      redirectAfterSubmit="/admin/brand"
    />
  );
};

export default AddBrandPage;


