import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post } from "services/api";
import { useToast } from '../../hooks/useToast';

const AddInventoryReceipt = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [serials, setSerials] = useState<string[]>([]);
  const [serialInput, setSerialInput] = useState('');
  
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
  
  // Xử lý khi chọn sản phẩm
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const product = products.find((p: any) => p.id === productId);
    setSelectedProduct(product);
  };
  
  // Xử lý khi nhập serial
  const handleSerialInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSerialInput(e.target.value);
  };
  
  // Xử lý khi thêm serial
  const handleAddSerials = () => {
    if (!serialInput.trim()) return;
    
    // Tách các serial bằng dấu xuống dòng hoặc dấu phẩy
    const newSerials = serialInput
      .split(/[\n,]/)
      .map(s => s.trim())
      .filter(s => s !== '');
    
    setSerials([...serials, ...newSerials]);
    setSerialInput('');
  };
  
  // Xử lý khi xóa serial
  const handleRemoveSerial = (index: number) => {
    const newSerials = [...serials];
    newSerials.splice(index, 1);
    setSerials(newSerials);
  };
  
  // Xử lý khi submit form
  const handleSubmit = async () => {
    if (!selectedProduct) {
      toast.error("Lỗi", "Vui lòng chọn sản phẩm");
      return;
    }
    
    if (serials.length === 0) {
      toast.error("Lỗi", "Vui lòng nhập ít nhất một serial");
      return;
    }
    
    const receiptData = {
      productId: selectedProduct.id,
      serials: serials
    };
    
    try {
      await post('/serials/bulk', receiptData);
      toast.success("Thành công", `Đã thêm ${serials.length} serial cho sản phẩm ${selectedProduct.name}`);
      navigate('/admin/inventory');
    } catch (error: any) {
      console.error('Error creating inventory receipt:', error);
      const errorMessage = error.response?.data?.message || 'Không thể thêm serial sản phẩm';
      toast.error("Lỗi", errorMessage);
    }
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Thêm serial sản phẩm mới</h2>
        
        <div className="space-y-6">
          {/* Chọn sản phẩm */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
            <select 
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={handleProductChange}
              value={selectedProduct?.id || ''}
            >
              <option value="">Chọn sản phẩm</option>
              {productOptions.map((option: any) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          {/* Nhập serial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nhập serial (mỗi dòng hoặc phân cách bằng dấu phẩy)</label>
            <div className="flex">
              <textarea 
                className="w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={5}
                value={serialInput}
                onChange={handleSerialInputChange}
                placeholder="Nhập các serial, mỗi serial một dòng hoặc phân cách bằng dấu phẩy"
              />
              <button
                type="button"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-r-md"
                onClick={handleAddSerials}
              >
                Thêm
              </button>
            </div>
          </div>
          
          {/* Danh sách serial đã nhập */}
          {serials.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-2">Danh sách serial đã nhập ({serials.length})</h3>
              <div className="bg-gray-50 p-3 rounded-md max-h-60 overflow-y-auto">
                <ul className="space-y-1">
                  {serials.map((serial, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <span>{serial}</span>
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleRemoveSerial(index)}
                      >
                        Xóa
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Nút lưu */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
              onClick={() => navigate('/admin/inventory')}
            >
              Hủy
            </button>
            <button
              type="button"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
              onClick={handleSubmit}
            >
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInventoryReceipt;
