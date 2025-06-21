import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from "services/api";
import FormComponent from '../../components/Form';

const AddInventoryReceipt = () => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  
  // Lấy danh sách sản phẩm
  const { data: productsData, isLoading: loadingProducts } = useQuery({ 
    queryKey: ['/products'], 
    queryFn: () => get('/products'),
    staleTime: 60000
  });
  
  const products = productsData?.data?.result?.data || [];
  const productOptions = products.map((product: any) => ({
    value: product.id,
    label: `${product.sku} - ${product.name}`
  }));
  
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
      status: "draft",
      items: selectedProducts.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        serials: item.serials || []
      }))
    };
    
    return await post('/inventory-receipts', receiptData);
  };
  
  // Xử lý thêm sản phẩm vào phiếu nhập
  const handleAddProduct = (productId: string, quantity: number) => {
    const product = products.find((p: any) => p.id === productId);
    if (product) {
      setSelectedProducts([...selectedProducts, {
        productId,
        productName: product.name,
        productSku: product.sku,
        quantity,
        serials: []
      }]);
    }
  };
  
  // Xử lý xóa sản phẩm khỏi phiếu nhập
  const handleRemoveProduct = (index: number) => {
    const newProducts = [...selectedProducts];
    newProducts.splice(index, 1);
    setSelectedProducts(newProducts);
  };
  
  // Xử lý thêm serial cho sản phẩm
  const handleAddSerial = (index: number, serial: string) => {
    const newProducts = [...selectedProducts];
    if (!newProducts[index].serials) {
      newProducts[index].serials = [];
    }
    newProducts[index].serials.push(serial);
    setSelectedProducts(newProducts);
  };
  
  if (loadingProducts) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tạo phiếu nhập kho mới</h2>
        
        {/* Form thông tin phiếu nhập */}
        <FormComponent
          title=""
          fields={formFields}
          onSubmit={handleSubmit}
          backUrl="/admin/inventory"
          submitButtonText="Lưu phiếu nhập"
          invalidateQueryKey="/inventory-receipts"
          redirectAfterSubmit="/admin/inventory"
        />
        
        {/* Phần chọn sản phẩm và nhập serial */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Thêm sản phẩm vào phiếu nhập</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
              <select 
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                id="productSelect"
              >
                <option value="">Chọn sản phẩm</option>
                {productOptions.map((option: any) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
              <input 
                type="number" 
                min="1"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                id="quantityInput"
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
                onClick={() => {
                  const productSelect = document.getElementById('productSelect') as HTMLSelectElement;
                  const quantityInput = document.getElementById('quantityInput') as HTMLInputElement;
                  
                  if (productSelect.value && quantityInput.value) {
                    handleAddProduct(productSelect.value, parseInt(quantityInput.value));
                    productSelect.value = '';
                    quantityInput.value = '';
                  }
                }}
              >
                Thêm sản phẩm
              </button>
            </div>
          </div>
          
          {/* Danh sách sản phẩm đã chọn */}
          {selectedProducts.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium mb-2">Sản phẩm đã chọn</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STT
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã SP
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên sản phẩm
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Serial
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedProducts.map((product, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.productSku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.productName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex flex-col space-y-2">
                            {product.serials && product.serials.map((serial: string, idx: number) => (
                              <div key={idx} className="flex items-center">
                                <span className="mr-2">{serial}</span>
                              </div>
                            ))}
                            <div className="flex items-center">
                              <input
                                type="text"
                                placeholder="Nhập serial"
                                className="rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                id={`serial-input-${index}`}
                              />
                              <button
                                type="button"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 px-2 rounded-r-md"
                                onClick={() => {
                                  const serialInput = document.getElementById(`serial-input-${index}`) as HTMLInputElement;
                                  if (serialInput.value) {
                                    handleAddSerial(index, serialInput.value);
                                    serialInput.value = '';
                                  }
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleRemoveProduct(index)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddInventoryReceipt;