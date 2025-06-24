import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, put } from "services/api";
import FormComponent from '../../components/Form';

const EditProductPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    
    const { data: dataProduct, isLoading: loadingProduct } = useQuery({ 
        queryKey: [`/products/${params?.id}`], 
        queryFn: () => get(`/products/${params?.id}`),
        staleTime: 60000
    });
    
    const { data: dataCate, isLoading: loadingCategories } = useQuery({
        queryKey: ['/categories'],
        queryFn: () => get('/categories'),
        staleTime: 60000
    });

    const { data: dataBrands, isLoading: loadingBrands } = useQuery({
        queryKey: ['/brands'],
        queryFn: () => get('/brands'),
        staleTime: 60000
    });

    const productData = dataProduct?.data?.result?.data || {};
    const categories = dataCate?.data?.result?.data || [];
    const brands = dataBrands?.data?.result?.data || [];

    const categoryOptions = categories.map((cat: any) => ({
        value: cat.id,
        label: cat.name
    }));

    const brandOptions = brands.map((brand: any) => ({
        value: brand.id,
        label: brand.name
    }));
    
    const formFields = [
        {
            name: "sku",
            label: "Mã sản phẩm (SKU)",
            type: "text" as const,
            required: true,
            placeholder: "VD: SP001",
            validation: {
                required: "Vui lòng nhập mã sản phẩm"
            }
        },
        {
            name: "name",
            label: "Tên sản phẩm",
            type: "text" as const,
            required: true,
            placeholder: "Nhập tên sản phẩm",
            validation: {
                required: "Vui lòng nhập tên sản phẩm"
            }
        },
        {
            name: "price",
            label: "Giá",
            type: "number" as const,
            required: true,
            placeholder: "Nhập giá sản phẩm",
            validation: {
                required: "Vui lòng nhập giá sản phẩm",
                min: { value: 0, message: "Giá không được âm" }
            }
        },
        {
            name: "category",
            label: "Danh mục",
            type: "select" as const,
            required: true,
            options: categoryOptions,
            validation: {
                required: "Vui lòng chọn danh mục"
            }
        },
        {
            name: "brand",
            label: "Thương hiệu",
            type: "select" as const,
            required: true,
            options: brandOptions,
            validation: {
                required: "Vui lòng chọn thương hiệu"
            }
        },
        {
            name: "img",
            label: "Hình ảnh",
            type: "image" as const
        },
        {
            name: "description",
            label: "Mô tả",
            type: "textarea" as const,
            rows: 4,
            placeholder: "Nhập mô tả sản phẩm"
        }
    ];
    
    const handleSubmit = async (data: any) => {
        const dataUpdate = {
            sku: data.sku,
            name: data.name,
            price: Number(data.price),
            img: data.img || null,
            description: data.description,
            categoryId: data.category,
            brandId: data.brand
        };

        return await put(`/products/edit/${params?.id}`, dataUpdate);
    };
    
    if (loadingProduct || loadingCategories || loadingBrands) {
        return (
            <div className="flex justify-center items-center p-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    
    return (
        <FormComponent
            title="Chỉnh sửa sản phẩm"
            fields={formFields}
            initialValues={{
                sku: productData.sku || "",
                name: productData.name || "",
                price: productData.price || 0,
                description: productData.description || "",
                category: productData.categoryId || "",
                brand: productData.brandId || "",
                img: productData.img || ""
            }}
            onSubmit={handleSubmit}
            backUrl="/admin/product"
            submitButtonText="Cập nhật sản phẩm"
            invalidateQueryKey="/products"
            redirectAfterSubmit="/admin/product"
            transformBeforeSubmit={(data) => ({
                ...data,
                price: Number(data.price)
            })}
        />
    );
};

export default EditProductPage
