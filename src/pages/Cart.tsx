// import { faCoffee } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { get } from 'services/api';

function Cart() {
  const url = '/shoppingcart/customer'

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCheckedAll, setCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  //note: check login user or customer after get cart by this acc 

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

  const { data, isLoading } = useQuery({
    queryKey: [url],
    queryFn: () => get(`/shoppingcart/customer/11033333`)
  });

  // Tính tổng tiền của các sản phẩm được chọn
  const totalSelectedPrice = useMemo(() => {
    let total = 0;
    cartItems.forEach((item, index) => {
      if (checkedItems[index]) {
        total += parseFloat(item.price || '0');
      }
    });
    return total.toLocaleString('vi-VN') + '₫';
  }, [cartItems, checkedItems]);

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
    return <div>Loading...</div>;
  }

  return (
    <div className='container py-[40px] min-h-[calc(100vh-175px)]'>
      <div className="subtitle text-left">Trang chủ <FontAwesomeIcon icon={faAngleRight} /> Giỏ hàng</div>
      {cartItems.length === 0 ? (
        <div className="empty-cart text-center py-10">
          <h2 className="text-xl mb-4">Giỏ hàng của bạn đang trống</h2>
          <a href="/" className="btn-primary">Tiếp tục mua sắm</a>
        </div>
      ) : (
        <div className='cart-content flex gap-[20px]'>
          <div className="relative overflow-x-auto min-w-[800px]">
            <table className="w-full text-sm text-left">
              <thead className="text-xl text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <input
                      type="checkbox"
                      checked={isCheckedAll}
                      onChange={handleCheckAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Product name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Color
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item: any, index: number) => (
                  <tr key={item.id} className={`bg-white ${index < cartItems.length - 1 ? 'border-b' : ''}`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={checkedItems[index]}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {item?.product?.name}
                    </th>
                    <td className="px-6 py-4">{item?.product?.name}</td>
                    <td className="px-6 py-4"><img src={item?.product?.img} width={100} alt="#" className='object-fit'/></td>
                    <td className="px-6 py-4">{item?.product?.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full">
            <div className="promotion bg-white p-3 mb-3">
              <h3>
                Khuyến mãi: <a href="#">Nhập mã giảm giá</a>
              </h3>
            </div>
            <div className="payment bg-white p-4">
              <div className="title mb-2">
                <h3>
                  Thanh toán
                </h3>
              </div>
              <div className="pre-total flex justify-between mb-2">
                <div>
                  Tổng tạm tính
                </div>
                <div>
                  {totalSelectedPrice}
                </div>
              </div>
              <div className="total flex justify-between mb-2">
                <div>
                  Thành tiền
                </div>
                <div>
                  {totalSelectedPrice}
                </div>
              </div>
              <button className='btn-primary w-full'>Tiếp tục</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
