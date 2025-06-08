import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, put } from "services/api";
import FormComponent from '../../components/Form';

const EditCategoryPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    
    const { data: dataCategory, isLoading } = useQuery({ 
        queryKey: [`/categories/${params?.id}`], 
        queryFn: () => get(`/categories/${params?.id}`),
        staleTime: 60000
    });
    
    const categoryData = dataCategory?.data?.result?.data || {};
    
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
        const dataUpdate = {
            name: data.name,
            description: data.description,
        };
        
        return await put(`/categories/edit/${params?.id}`, dataUpdate);
    };
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    return (
        <FormComponent
            title="Chỉnh sửa danh mục"
            fields={formFields}
            initialValues={{
                name: categoryData.name || "",
                description: categoryData.description || ""
            }}
            onSubmit={handleSubmit}
            backUrl="/admin/category"
            submitButtonText="Cập nhật danh mục"
            invalidateQueryKey="/categories"
            redirectAfterSubmit="/admin/category"
        />
    );
};

export default EditCategoryPage;


