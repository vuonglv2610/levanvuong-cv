import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCookie } from 'libs/getCookie';
import React from 'react';

function Header() {
  const isLogin = getCookie("userId");

  return (<>
    <div className="header-top bg-[#1435c3] text-white p-2 text-[12px]">
      <div className="container">
        <ul className='flex justify-between'>
          <li><a href="#">Hệ thống showroom</a></li>
          <li><a href="#">Dành cho doanh nghiệp</a></li>
          <li><a href="#">Apple education</a></li>
          <li><a href="#">Hotline: 1800 6768</a></li>
          <li><a href="#">Tin công nghệ</a></li>
          <li><a href="#">Xây dựng cấu hình</a></li>
          <li><a href="#">Khuyến mãi</a></li>
        </ul>
      </div>
    </div>
    <div className="bg-white">
      <div className='header-container grid grid-cols-4 gap-[40px] items-center p-4 container'>
        <div className="logo max-w-[200px]">
          <img src="https://cdn2.fptshop.com.vn/unsafe/360x0/filters:quality(100)/small/fptshop_logo_c5ac91ae46.png" alt="#" />
        </div>
        <form className="form-header-category max-w-sm h-[45px]">
          <select className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-full">
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
          </select>
        </form>
        <form className="form-header-search max-w-md mx-auto h-[45px]">
          <label htmlFor="default-search" className="mb-2 text-sm font-medium  sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="default-search" className="block w-full h-[45px] p-4 ps-10 text-sm  border border-gray-300 rounded-lg bg-gray-50" placeholder="Search..." />
            <button type="submit" className="text-white absolute end-[5px] bottom-[5px] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
          </div>
        </form>
        <div className="container-icon flex gap-[40px] justify-center">
          {
            !isLogin &&
            <div className='user text-[18px]'>
              <a href="/login" >
                <FontAwesomeIcon icon={faUser} />
              </a>
            </div>
          }
          <div className='cart font-[18px]'>
            <a href="/cart">
              <FontAwesomeIcon icon={faCartShopping} />
            </a>
          </div>
        </div>
      </div>
    </div >
  </>
  )
}

export default Header;

