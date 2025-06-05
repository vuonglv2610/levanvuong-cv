import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { get } from "services/api";

interface TableManageProps {
  isShowFooter: boolean;
  url: string;
}

const TableManage = ({ isShowFooter = true, url }: TableManageProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  // Cải thiện cấu hình React Query
  const { data, isLoading, error } = useQuery({ 
    queryKey: [url], 
    queryFn: () => get(url),
    staleTime: 30000,
    retry: 2,
  });

  // Cập nhật state products khi data thay đổi
  useEffect(() => {
    if (data?.data?.result?.data) {
      const productsData = data.data.result.data;
      setProducts(productsData);
      toast.success("Lấy dữ liệu thành công!");
    }
  }, [data]);

  // Lọc sản phẩm theo tìm kiếm và danh mục
  const filteredProducts = useMemo(() => {
    return products && products.length > 0 
      ? products.filter(product => {
          const matchesSearch = product?.name?.toLowerCase().includes((searchTerm || "").toLowerCase());
          const matchesCategory = filterCategory === "ALL" || product?.category === filterCategory;
          return matchesSearch && matchesCategory;
        })
      : [];
  }, [products, searchTerm, filterCategory]);

  // Tính toán tổng số trang
  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / itemsPerPage);
  }, [filteredProducts, itemsPerPage]);

  // Lấy sản phẩm cho trang hiện tại
  const currentProducts = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Lấy danh sách các danh mục duy nhất
  const categories = useMemo(() => {
    return ["ALL", ...Array.from(new Set(
      products && products.length > 0 
        ? products
            .map(product => product?.category)
            .filter(Boolean)
        : []
    ))];
  }, [products]);

  // Xử lý chuyển trang
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Tạo mảng số trang để hiển thị
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5; // Số trang tối đa hiển thị
    
    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang ít hơn hoặc bằng số trang tối đa hiển thị
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Nếu tổng số trang nhiều hơn số trang tối đa hiển thị
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  // Xử lý thay đổi số lượng sản phẩm trên mỗi trang
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi số lượng sản phẩm trên mỗi trang
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10 min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center bg-red-50 rounded-lg border border-red-200 min-h-[400px] flex items-center justify-center">
        <div>
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-red-500 text-lg font-medium">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-full overflow-hidden">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý sản phẩm</h2>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row mb-6 gap-4 md:gap-6 md:items-center">
        <div className="md:w-1/3">
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
            }}
            className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((category, index) => (
              <option key={index} value={category || ""}>{category || "Không có danh mục"}</option>
            ))}
          </select>
        </div>
        <div className="md:w-2/3">
          <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm sản phẩm</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="text"
              id="search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi tìm kiếm
              }}
              className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tìm kiếm theo tên sản phẩm..."
            />
          </div>
        </div>
      </div>
      
      {/* Add Product Button */}
      <div className="flex justify-end mb-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors duration-200 flex items-center"
          onClick={() => navigate('/admin/product/add')}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Thêm sản phẩm mới
        </button>
      </div>
      
      {/* Products Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        {filteredProducts.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">STT</th>
                <th scope="col" className="px-6 py-3">Tên sản phẩm</th>
                <th scope="col" className="px-6 py-3">Hình ảnh</th>
                <th scope="col" className="px-6 py-3">Giá</th>
                <th scope="col" className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((item: any, i: number) => (
                <tr
                  className="bg-white border-b hover:bg-gray-50 transition-colors duration-200"
                  key={`${item.id || item.name || i}`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item?.name || "Không có tên"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                      <img
                        src={item?.img || "https://via.placeholder.com/64x64?text=No+Image"}
                        alt={item?.name || "Product image"}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=No+Image';
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {typeof item?.price === 'number' 
                      ? item.price.toLocaleString('vi-VN') + '₫' 
                      : item?.price || "Chưa có giá"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Link
                        to={`edit/${item.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors duration-200"
                      >
                        Sửa
                      </Link>
                      <button
                        className="font-medium text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded-md transition-colors duration-200"
                        onClick={() => {
                          if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
                            console.log('Delete product:', item.id);
                            // Implement delete functionality here
                          }
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p className="text-lg font-medium text-gray-600 mb-2">Không tìm thấy sản phẩm nào</p>
            <p className="text-gray-500 mb-4">Hãy thêm sản phẩm mới hoặc thay đổi bộ lọc tìm kiếm</p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={() => navigate('/admin/product/add')}
            >
              Thêm sản phẩm mới
            </button>
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {isShowFooter && filteredProducts.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-2">
            <label htmlFor="items-per-page" className="text-sm text-gray-700">Hiển thị:</label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{currentProducts.length}</span> / <span className="font-medium">{filteredProducts.length}</span> sản phẩm
            </span>
          </div>
          
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 border rounded-md ${
                currentPage === 1 
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Trước
            </button>
            
            {pageNumbers.map(number => (
              <button
                key={number}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === number
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}
            
            <button 
              className={`px-3 py-1 border rounded-md ${
                currentPage === totalPages || totalPages === 0
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManage;




