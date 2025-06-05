import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get, put } from "services/api";

const EditProductPage = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [imgPre, setImgPre] = useState<any>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
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
    
    const currentData = dataProduct?.data?.result?.data || {};
    const currentCate = dataCate?.data?.result?.data || [];

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    // Set form default values when data is loaded
    useEffect(() => {
        if (currentData && Object.keys(currentData).length > 0) {
            reset({
                sku: currentData.sku,
                name: currentData.name,
                price: currentData.price,
                quantity: currentData.quantity,
                description: currentData.description,
                category: currentData.categoryId
            });
            
            if (currentData.img) {
                setImgPre(currentData.img);
            }
        }
    }, [currentData, reset]);

    const onSubmit = async (data: any) => {
        try {
            setIsSubmitting(true);
            let dataUpdate = {
                sku: data.sku,
                name: data.name,
                price: Number(data.price),
                img: imgPre,
                quantity: Number(data.quantity),
                description: data.description,
                categoryId: data.category
            }
            
            const res = await put(`/products/edit/${params?.id}`, dataUpdate);
            
            if (res.data) {
                toast.success('Cập nhật sản phẩm thành công!');
                navigate('/admin/product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error('Có lỗi xảy ra khi cập nhật sản phẩm!');
        } finally {
            setIsSubmitting(false);
        }
    }

    const convertToBase64 = (selectedFile: any) => {
        const reader = new FileReader()
        reader.readAsDataURL(selectedFile)
        reader.onload = () => {
            setImgPre(reader.result)
        }
    }

    const handleChangePreImg = (e: any) => {
        if (e.target.files?.[0]) {
            convertToBase64(e.target.files[0]);
        }
    }

    if (loadingProduct || loadingCategories) {
        return (
            <div className="flex justify-center items-center p-10 min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto my-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h1>
                <button 
                    onClick={() => navigate('/admin/product')}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Quay lại
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="sku" className="block mb-2 text-sm font-medium text-gray-700">
                                Mã sản phẩm (SKU) <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="sku" 
                                {...register("sku", { required: "Vui lòng nhập mã sản phẩm" })} 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors" 
                                placeholder="VD: SP001"
                            />
                            {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku.message as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                                Tên sản phẩm <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="name" 
                                {...register("name", { required: "Vui lòng nhập tên sản phẩm" })} 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors" 
                                placeholder="Nhập tên sản phẩm"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">
                                Giá <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="text-gray-500">₫</span>
                                </div>
                                <input 
                                    type="number" 
                                    id="price" 
                                    {...register("price", { 
                                        required: "Vui lòng nhập giá sản phẩm",
                                        min: { value: 0, message: "Giá không được âm" }
                                    })} 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 p-2.5 transition-colors" 
                                    placeholder="0"
                                />
                            </div>
                            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="quantity" className="block mb-2 text-sm font-medium text-gray-700">
                                Số lượng <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="number" 
                                id="quantity" 
                                {...register("quantity", { 
                                    required: "Vui lòng nhập số lượng",
                                    min: { value: 0, message: "Số lượng không được âm" }
                                })} 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors" 
                            />
                            {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message as string}</p>}
                        </div>

                        <div>
                            <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            <select 
                                id="category" 
                                {...register("category", { required: "Vui lòng chọn danh mục" })} 
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {currentCate.map((item: any) => (
                                    <option 
                                        key={item.id} 
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message as string}</p>}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="img" className="block mb-2 text-sm font-medium text-gray-700">
                                Hình ảnh sản phẩm
                            </label>
                            <div className="flex flex-col items-center space-y-4">
                                <div className={`w-full h-48 border-2 border-dashed rounded-lg ${imgPre ? 'border-gray-300' : 'border-gray-400'} flex items-center justify-center bg-gray-50 overflow-hidden relative group`}>
                                    {imgPre ? (
                                        <>
                                            <img 
                                                src={imgPre} 
                                                className="object-contain w-full h-full" 
                                                alt="Product preview" 
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    type="button"
                                                    onClick={() => setImgPre('')}
                                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center p-4">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Kéo thả hoặc nhấp để tải lên
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF (Tối đa 5MB)
                                            </p>
                                        </div>
                                    )}
                                </div>
                                
                                <input 
                                    type="file" 
                                    id="img" 
                                    accept="image/*"
                                    {...register("img", { 
                                        onChange: (e) => handleChangePreImg(e),
                                    })} 
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors" 
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
                                Mô tả sản phẩm
                            </label>
                            <textarea 
                                id="description" 
                                {...register("description")} 
                                rows={6} 
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                                placeholder="Nhập mô tả chi tiết về sản phẩm..." 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/product')}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-colors flex items-center ${
                            isSubmitting 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                        }`}
                    >
                        {isSubmitting && (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditProductPage
