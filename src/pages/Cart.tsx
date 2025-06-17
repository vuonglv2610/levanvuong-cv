import { faAngleRight, faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'libs/getCookie';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { get, put, remove } from 'services/api';

function Cart() {
  const url = '/shoppingcart/customer';
  const userId = getCookie('userId');
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCheckedAll, setCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showPromoInput, setShowPromoInput] = useState(false);

  // Handle individual checkbox change
  const handleCheckboxChange = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !newCheckedItems[index];
    setCheckedItems(newCheckedItems);
  };

  // Handle check all
  const handleCheckAll = () => {
    const newState = !isCheckedAll;
    setCheckedAll(newState);
    setCheckedItems(new Array(cartItems.length).fill(newState));
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [url, userId],
    queryFn: () => get(`${url}/${userId}`)
  });

  // Cập nhật số lượng sản phẩm
  const updateQuantity = async (itemId: string, newQuantity: number, index: number) => {
    if (newQuantity < 1) return;
    try {
      setIsUpdating(true);
      // Cập nhật UI trước để tạo trải nghiệm mượt mà
      const updatedItems = [...cartItems];
      updatedItems[index] = {
        ...updatedItems[index],
        quantity: newQuantity
      };
      setCartItems(updatedItems);

      // Gọi API để cập nhật số lượng
      await put(`/shoppingcart/edit/${itemId}`, { quantity: newQuantity });
      // Refresh dữ liệu sau khi cập nhật
      refetch();
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Không thể cập nhật số lượng sản phẩm');
      // Khôi phục lại dữ liệu cũ nếu có lỗi
      refetch();
    } finally {
      setIsUpdating(false);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const removeItem = async (itemId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) return;
    
    try {
      setIsUpdating(true);
      await remove(`/shoppingcart/${itemId}`);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      refetch();
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Không thể xóa sản phẩm');
    } finally {
      setIsUpdating(false);
    }
  };

  // Áp dụng mã giảm giá
  const applyPromoCode = () => {
    if (!promoCode.trim()) {
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    // Giả lập kiểm tra mã giảm giá
    // Trong thực tế, bạn sẽ gọi API để kiểm tra
    if (promoCode === 'SALE10') {
      setDiscount(10); // Giảm 10%
      toast.success('Áp dụng mã giảm giá thành công: Giảm 10%');
    } else if (promoCode === 'SALE20') {
      setDiscount(20); // Giảm 20%
      toast.success('Áp dụng mã giảm giá thành công: Giảm 20%');
    } else {
      toast.error('Mã giảm giá không hợp lệ hoặc đã hết hạn');
      setDiscount(0);
    }
    
    setShowPromoInput(false);
  };

  // Tính tổng tiền của các sản phẩm được chọn (chưa giảm giá)
  const subtotal = useMemo(() => {
    let total = 0;
    cartItems.forEach((item, index) => {
      if (checkedItems[index]) {
        // Đảm bảo tính đúng với số lượng sản phẩm
        const price = parseFloat(item.product?.price || '0');
        const quantity = item.quantity || 1;
        total += price * quantity;
      }
    });
    return total;
  }, [cartItems, checkedItems]);

  // Tính số tiền được giảm
  const discountAmount = useMemo(() => {
    return (subtotal * discount) / 100;
  }, [subtotal, discount]);

  // Tính tổng tiền sau khi giảm giá
  const finalTotal = useMemo(() => {
    return subtotal - discountAmount;
  }, [subtotal, discountAmount]);

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  useEffect(() => {
    if (data?.data?.result?.data) {
      const items = data.data.result.data;
      setCartItems(items);
      // Khởi tạo mảng checkedItems với độ dài bằng với số lượng sản phẩm
      setCheckedItems(new Array(items.length).fill(false));
    }
  }, [data]);

  // Update checkedAll when all individual items are checked
  useEffect(() => {
    if (checkedItems.length > 0) {
      setCheckedAll(checkedItems.every(item => item === true));
    }
  }, [checkedItems]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Thêm hàm xử lý chuyển đến trang thanh toán
  const handleCheckout = () => {
    const selectedItems = cartItems.filter((_, index) => checkedItems[index]);
    
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }
    
    // Lưu các sản phẩm đã chọn vào localStorage để sử dụng ở trang thanh toán
    localStorage.setItem('checkoutItems', JSON.stringify(selectedItems));
    
    // Chuyển hướng đến trang thanh toán
    navigate('/checkout');
  };

  return (
    <div className='container py-[40px] min-h-[calc(100vh-175px)]'>
      <div className="subtitle text-left mb-6">
        <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
        <FontAwesomeIcon icon={faAngleRight} className="mx-2" />
        <span className="font-medium">Giỏ hàng</span>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart text-center py-10 bg-white rounded-lg shadow-sm">
          <div className="mb-4">
            <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h2 className="text-xl mb-4 font-medium">Giỏ hàng của bạn đang trống</h2>
          <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng và quay lại đây nhé!</p>
          <Link to="/" className="btn-primary inline-block px-6 py-3">Tiếp tục mua sắm</Link>
        </div>
      ) : (
        <div className='cart-content flex flex-col md:flex-row gap-[20px]'>
          <div className="relative overflow-x-auto md:min-w-[800px] bg-white rounded-lg shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-700 uppercase bg-gray-50 rounded-t-lg">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={isCheckedAll}
                      onChange={handleCheckAll}
                      className="w-4 h-4 accent-primary"
                    />
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Sản phẩm
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Số lượng
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Đơn giá
                  </th>
                  <th scope="col" className="px-6 py-3 text-right">
                    Thành tiền
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item: any, index: number) => {
                  const price = parseFloat(item.product?.price || '0');
                  const quantity = item.quantity || 1;
                  const itemTotal = price * quantity;
                  
                  return (
                    <tr key={item.id} className={`bg-white ${index < cartItems.length - 1 ? 'border-b' : ''}`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={checkedItems[index]}
                          onChange={() => handleCheckboxChange(index)}
                          className="w-4 h-4 accent-primary"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-20 h-20 mr-4">
                            <img
                              src={item?.product?.img || 'https://via.placeholder.com/80'}
                              alt={item?.product?.name}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 line-clamp-2">
                              {item?.product?.name || 'Sản phẩm không tên'}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {item?.product?.category?.name || 'Chưa phân loại'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(item.id, quantity - 1, index)}
                            disabled={isUpdating || quantity <= 1}
                          >
                            <FontAwesomeIcon icon={faMinus} className="text-gray-600" />
                          </button>
                          <input
                            type="text"
                            value={quantity}
                            readOnly
                            className="w-12 h-8 border-t border-b border-gray-300 text-center focus:outline-none"
                          />
                          <button
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100 transition-colors"
                            onClick={() => updateQuantity(item.id, quantity + 1, index)}
                            disabled={isUpdating}
                          >
                            <FontAwesomeIcon icon={faPlus} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {formatCurrency(price)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        {formatCurrency(itemTotal)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="text-red-500 hover:text-red-700 transition-colors"
                          onClick={() => removeItem(item.id)}
                          disabled={isUpdating}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="promotion bg-white p-4 mb-3 rounded-lg shadow-sm">
              <h3 className="font-medium mb-3">
                Khuyến mãi
              </h3>
              
              {showPromoInput ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                    >
                      Áp dụng
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowPromoInput(false)}
                    className="text-gray-500 text-sm hover:text-gray-700 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowPromoInput(true)}
                  className="text-primary hover:text-blue-700 transition-colors flex items-center"
                >
                  <span className="mr-2">+</span> Nhập mã giảm giá
                </button>
              )}
              
              {discount > 0 && (
                <div className="mt-3 p-2 bg-green-50 text-green-700 rounded-md flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Mã {promoCode}:</span>
                    <span>Giảm {discount}%</span>
                  </div>
                  <button 
                    onClick={() => {
                      setDiscount(0);
                      setPromoCode('');
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="payment bg-white p-4 rounded-lg shadow-sm">
              <div className="title mb-4 pb-2 border-b">
                <h3 className="font-medium text-lg">
                  Thanh toán
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="text-gray-600">
                    Tổng sản phẩm
                  </div>
                  <div>
                    {checkedItems.filter(Boolean).length} sản phẩm
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div className="text-gray-600">
                    Tổng tạm tính
                  </div>
                  <div>
                    {formatCurrency(subtotal)}
                  </div>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <div>
                      Giảm giá ({discount}%)
                    </div>
                    <div>
                      - {formatCurrency(discountAmount)}
                    </div>
                  </div>
                )}
                
                <div className="pt-3 border-t flex justify-between font-medium text-lg">
                  <div>
                    Thành tiền
                  </div>
                  <div className="text-primary">
                    {formatCurrency(finalTotal)}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 text-right">
                  (Đã bao gồm VAT nếu có)
                </div>
              </div>
              
              <button 
                className='btn-primary w-full mt-4 py-3 rounded-md font-medium disabled:bg-gray-400 disabled:cursor-not-allowed'
                disabled={checkedItems.filter(Boolean).length === 0}
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
              </button>
              
              <Link to="/" className="block text-center mt-3 text-primary hover:underline">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
