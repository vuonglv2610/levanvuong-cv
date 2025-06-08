import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'libs/getCookie';
import React from 'react';
import { get } from 'services/api';
import SearchForm from '../components/SearchForm';

function Header() {
  const isLogin = getCookie("userId");

  // Lấy danh sách categories cho dropdown
  const { data } = useQuery({ 
    queryKey: ['/categories'], 
    queryFn: () => get('/categories'),
    staleTime: 60000
  });
  
  const categories = data?.data?.result?.data || [];
  const categoryOptions = categories.map((cat: any) => ({
    value: cat.id,
    label: cat.name
  }));

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
        <div className="header-search-container">
          <SearchForm 
            placeholder="Search for products..." 
            showCategories={true}
            categories={categoryOptions}
            className="max-w-md mx-auto h-[45px]"
          />
        </div>
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

