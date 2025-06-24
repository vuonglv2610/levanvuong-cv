import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, put } from "services/api";
import FormComponent from '../../components/Form';

const EditBrandPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    
    const { data: dataBrand, isLoading } = useQuery({ 
        queryKey: [`/brands/${params?.id}`], 
        queryFn: () => get(`/brands/${params?.id}`),
        staleTime: 60000
    });
    
    const brandData = dataBrand?.data?.result?.data || {};
    
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
        const dataUpdate = {
            name: data.name,
            description: data.description,
            logo: data.logo || brandData.logo
        };
        
        return await put(`/brands/edit/${params?.id}`, dataUpdate);
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
            title="Chỉnh sửa thương hiệu"
            fields={formFields}
            initialValues={{
                name: brandData.name || "",
                description: brandData.description || "",
                logo: brandData.logo || ""
            }}
            onSubmit={handleSubmit}
            backUrl="/admin/brand"
            submitButtonText="Cập nhật thương hiệu"
            invalidateQueryKey="/brands"
            redirectAfterSubmit="/admin/brand"
        />
    );
};

export default EditBrandPage;