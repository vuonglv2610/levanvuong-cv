// import { faCoffee } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import React from 'react';

function Cart() {
  return (
    <div className='container py-[40px] min-h-[calc(100vh-175px)]'>
      <div className="subtitle text-left">Trang chủ <FontAwesomeIcon icon={faAngleRight} /> Giỏ hàng</div>
      <div className='cart-content flex gap-[20px]'>
        <div className="relative overflow-x-auto min-w-[800px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xl text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3"><input type="checkbox" /></th>
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
              <tr className="bg-white border-b ">
                <td className="px-6 py-4">
                  <input type="checkbox" />
                </td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Apple MacBook Pro 17"
                </th>
                <td className="px-6 py-4">
                  Silver
                </td>
                <td className="px-6 py-4">
                  Laptop
                </td>
                <td className="px-6 py-4">
                  $2999
                </td>
              </tr>
              <tr className="bg-white border-b">
                <td className="px-6 py-4">
                  <input type="checkbox" />
                </td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Microsoft Surface Pro
                </th>
                <td className="px-6 py-4">
                  White
                </td>
                <td className="px-6 py-4">
                  Laptop PC
                </td>
                <td className="px-6 py-4">
                  $1999
                </td>
              </tr>
              <tr className="bg-white">
                <td className="px-6 py-4">
                  <input type="checkbox" />
                </td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Magic Mouse 2
                </th>
                <td className="px-6 py-4">
                  Black
                </td>
                <td className="px-6 py-4">
                  Accessories
                </td>
                <td className="px-6 py-4">
                  $99
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="w-full">
          <div className="promotion bg-white p-3 mb-3">
            <h3>
              Khuyễn mãi : <a href="#">######</a>
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
                14.880.000₫
              </div>
            </div>
            <div className="total flex justify-between mb-2">
              <div>
                Thành tiền
              </div>
              <div>
                14.880.000đ
              </div>
            </div>
            <button className='btn-primary'>Tiếp tục</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
