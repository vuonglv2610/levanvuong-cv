import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, put } from "services/api";
import FormComponent from '../../components/Form';

const EditInventoryReceipt = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  
  // Lấy thông tin phiếu nhập
  const { data: receiptData, isLoading: loadingReceipt } = useQuery({ 
    queryKey: [`/inventory-receipts/${params?.id}`], 
    queryFn: () => get(`/inventory-receipts/${params?.id}`),
    staleTime: 60000
  });
  
  // Lấy danh sách sản phẩm
  const { data: productsData, isLoading: loadingProducts } = useQuery({ 
    queryKey: ['/products'], 
    queryFn: () => get('/products'),
    staleTime: 60000
  });
  
  const receipt = receiptData?.data?.result?.data || {};
  const products = productsData?.data?.result?.data || [];
  
  const productOptions = products.map((product: any) => ({
    value: product.id,
    label: `${product.sku} - ${product.name}`
  }));
  
  // Cập nhật danh sách sản phẩm khi có dữ liệu phiếu nhập
  useEffect(() => {
    if (receipt && receipt.items) {
      const items = receipt.items.map((item: any) => {
        const product = products.find((p: any) => p.id === item.productId);
        return {
          productId: item.productId,
          productName: product?.name || "Unknown Product",
          productSku: product?.sku || "Unknown SKU",
          quantity: item.quantity,
          serials: item.serials || []
        };
      });
      setSelectedProducts(items);
    }
  }, [receipt, products]);
  
  // Form fields cho thông tin phiếu nhập
  const formFields = [
    {
      name: "receiptCode",
      label: "Mã phiếu nhập",
      type: "text" as const,
      required: true,
      placeholder: "VD: NK001",
      validation: {
        required: "Vui lòng nhập mã phiếu nhập"
      }
    },
    {
      name: "supplier",
      label: "Nhà cung cấp",
      type: "text" as const,
      required: true,
      placeholder: "Nhập tên nhà cung cấp",
      validation: {
        required: "Vui lòng nhập nhà cung cấp"
      }
    },
    {
      name: "status",
      label: "Trạng thái",
      type: "select" as const,
      required: true,
      options: [
        { value: "draft", label: "Nháp" },
        { value: "pending", label: "Đang xử lý" },
        { value: "completed", label: "Hoàn thành" }
      ],
      validation: {
        required: "Vui lòng chọn trạng thái"
      }
    },
    {
      name: "notes",
      label: "Ghi chú",
      type: "textarea" as const,
      rows: 3,
      placeholder: "Nhập ghi chú nếu có"
    }
  ];
  
  // Xử lý khi submit form
  const handleSubmit = async (data: any) => {
    if (selectedProducts.length === 0) {
      throw new Error("Vui lòng chọn ít nhất một sản phẩm");
    }
    
    const receiptData = {
      receiptCode: data.receiptCode,
      supplier: data.supplier,
      notes: data.notes,
      status: data.status,
      items: selectedProducts.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        serials: item.serials || []
      }))
    };
    
    return await put(`/inventory-receipts/edit/${params?.id}`, receiptData);
  };
  
  if (loadingReceipt || loadingProducts) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <FormComponent
      title="Chỉnh sửa phiếu nhập kho"
      fields={formFields}
      initialValues={{
        receiptCode: receipt.receiptCode || "",
        supplier: receipt.supplier || "",
        status: receipt.status || "draft",
        notes: receipt.notes || ""
      }}
      onSubmit={handleSubmit}
      backUrl="/admin/inventory"
      submitButtonText="Cập nhật phiếu nhập"
      invalidateQueryKey="/inventory-receipts"
      redirectAfterSubmit="/admin/inventory"
    />
  );
};

export default EditInventoryReceipt;
