import { useQuery } from "@tanstack/react-query";
import useToast from "hooks/useToast";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get, remove } from "services/api";
import PermissionButton from "./PermissionButton";

interface Column {
  key: string;
  header: string;
  render?: (item: any, index: number) => React.ReactNode;
}

interface TableManageProps {
  isShowFooter?: boolean;
  url: string;
  title: string;
  addButtonText?: string;
  addPath?: string;
  editPath?: string;
  deletePath?: string;
  columns: Column[];
  filterOptions?: {
    showCategoryFilter?: boolean;
    showSearch?: boolean;
    customFilters?: Array<{
      name: string;
      label: string;
      type: string;
      options: Array<{ value: string; label: string }>;
    }>;
  };
  permissions?: {
    create?: string;
    update?: string;
    delete?: string;
  };
}

const TableManage = ({
  isShowFooter = true,
  url,
  title = "Quản lý dữ liệu",
  addButtonText = "Thêm mới",
  addPath = "add",
  editPath = "edit",
  deletePath = "",
  columns = [],
  filterOptions = { showCategoryFilter: false, showSearch: true },
  permissions = {}
}: TableManageProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();
  const toast = useToast();

  // State để lưu thời gian cập nhật cuối cùng
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // State để theo dõi item đang xóa
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // State cho modal xác nhận xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Thêm state cho các custom filters
  const [customFilterValues, setCustomFilterValues] = useState<Record<string, string>>({});

  // Cấu hình React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [url],
    queryFn: () => get(url),
    staleTime: 30000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Debug logging for API response
  useEffect(() => {
    if (data) {
      console.log(`TableManage API Response for ${url}:`, data);
      console.log('Data structure:', {
        'data.data': data.data,
        'data.data?.result': data.data?.result,
        'data.data?.result?.data': data.data?.result?.data
      });
    }
    if (error) {
      console.error(`TableManage API Error for ${url}:`, error);
    }
  }, [data, error, url]);

  // Hàm refetch để cập nhật dữ liệu từ server
  const refreshData = async () => {
    try {
      await refetch();
      toast.success("Thành công", "Dữ liệu đã được cập nhật!");
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Lỗi', 'Không thể cập nhật dữ liệu!');
    }
  };

  // Cập nhật state items khi data thay đổi
  useEffect(() => {
    if (data?.data?.result?.data) {
      let itemsData = data.data.result.data;

      // Check if data is wrapped in a specific property (like categories, products, etc.)
      // This handles the new API response structure
      if (itemsData && typeof itemsData === 'object' && !Array.isArray(itemsData)) {
        // Look for common array properties
        const possibleArrayProps = ['categories', 'products', 'users', 'orders'];
        for (const prop of possibleArrayProps) {
          if (Array.isArray(itemsData[prop])) {
            console.log(`Found data array in property: ${prop}`);
            itemsData = itemsData[prop];
            break;
          }
        }
      }

      // Ensure itemsData is an array
      if (Array.isArray(itemsData)) {
        setItems(itemsData);
        setLastUpdated(new Date());
        console.log(`TableManage: Loaded ${itemsData.length} items`);
      } else {
        console.warn('TableManage: Expected array but got:', itemsData);
        setItems([]);
      }
    }
  }, [data]);

  // Cập nhật hàm lọc items để xử lý custom filters
  const filteredItems = useMemo(() => {
    return items && items.length > 0
      ? items.filter(item => {
        // Improved search logic for different types of items
        let matchesSearch = true;
        if (filterOptions.showSearch && searchTerm) {
          const searchLower = searchTerm.toLowerCase();

          // For items with title: search in title and content
          if (item?.title !== undefined) {
            matchesSearch =
              item?.title?.toLowerCase().includes(searchLower) ||
              item?.content?.toLowerCase().includes(searchLower) ||
              item?.excerpt?.toLowerCase().includes(searchLower);
          }
          // For other items: search in name
          else if (item?.name !== undefined) {
            matchesSearch = item?.name?.toLowerCase().includes(searchLower);
          }
          // Fallback: search in any string field
          else {
            matchesSearch = Object.values(item).some(value =>
              typeof value === 'string' && value.toLowerCase().includes(searchLower)
            );
          }
        }

        const matchesCategory = !filterOptions.showCategoryFilter ||
                               filterCategory === "ALL" ||
                               item?.category === filterCategory;

        // Xử lý custom filters
        const matchesCustomFilters = filterOptions.customFilters
          ? filterOptions.customFilters.every(filter => {
              const filterValue = customFilterValues[filter.name];
              return !filterValue || filterValue === "ALL" || item[filter.name] === filterValue;
            })
          : true;

        return matchesSearch && matchesCategory && matchesCustomFilters;
      })
      : [];
  }, [items, searchTerm, filterCategory, filterOptions.showCategoryFilter, filterOptions.showSearch, filterOptions.customFilters, customFilterValues]);

  // Tính toán tổng số trang
  const totalPages = useMemo(() => {
    return Math.ceil(filteredItems.length / itemsPerPage);
  }, [filteredItems, itemsPerPage]);

  // Lấy items cho trang hiện tại
  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Lấy danh sách các danh mục duy nhất (nếu cần)
  const categories = useMemo(() => {
    if (!filterOptions.showCategoryFilter) return [];
    
    return ["ALL", ...Array.from(new Set(
      items && items.length > 0
        ? items
          .map(item => item?.category)
          .filter(Boolean)
        : []
    ))];
  }, [items, filterOptions.showCategoryFilter]);

  // Xử lý chuyển trang
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Tạo mảng số trang để hiển thị
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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

  // Xử lý thay đổi số lượng items trên mỗi trang
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Hàm xóa item
  const handleRemoveItem = async (id: any) => {
    try {
      setDeletingId(id);

      const deleteUrl = deletePath ? `${deletePath}/${id}` : `${url}/${id}`;
      const res = await remove(deleteUrl);

      if (res.data) {
        toast.success('Thành công', 'Xóa thành công!');

        await refetch();

        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error: any) {
      console.error('Error removing item:', error);
      
      // Xử lý lỗi 403 - không có quyền
      if (error.response?.status === 403) {
        toast.error('Lỗi', 'Bạn không có quyền xóa!');
      } else if (error.response?.status === 404) {
        toast.error('Lỗi', 'Không tìm thấy dữ liệu để xóa!');
      } else {
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa!';
        toast.error('Lỗi', errorMessage);
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Hàm mở modal xác nhận xóa
  const openDeleteModal = (item: any) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  // Hàm đóng modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  // Hàm xác nhận xóa
  const confirmDelete = () => {
    if (itemToDelete) {
      handleRemoveItem(itemToDelete.id);
      closeDeleteModal();
    }
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
          <h3 className="text-lg font-medium text-red-800 mb-2">Đã xảy ra lỗi khi tải dữ liệu</h3>
          <p className="text-red-600">Vui lòng thử lại sau hoặc liên hệ quản trị viên.</p>
          <button
            onClick={refreshData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Cập nhật lần cuối: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={refreshData}
            className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 rounded-full transition-colors duration-200"
            title="Làm mới dữ liệu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      {(filterOptions.showCategoryFilter || filterOptions.showSearch || (filterOptions.customFilters && filterOptions.customFilters.length > 0)) && (
        <div className="flex flex-col md:flex-row mb-6 gap-4 md:gap-6 md:items-center">
          {filterOptions.showCategoryFilter && (
            <div className="md:w-1/3">
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                id="category-filter"
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category || ""}>{category || "Không có danh mục"}</option>
                ))}
              </select>
            </div>
          )}
          {filterOptions.showSearch && (
            <div className={filterOptions.showCategoryFilter ? "md:w-2/3" : "w-full"}>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={title.includes('bài viết') ? "Tìm kiếm theo tiêu đề, nội dung..." : "Tìm kiếm theo tên..."}
                />
              </div>
            </div>
          )}
          {filterOptions.customFilters && filterOptions.customFilters.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              {filterOptions.customFilters.map((filter, index) => (
                <div key={index} className="md:w-1/3">
                  <label htmlFor={`filter-${filter.name}`} className="block text-sm font-medium text-gray-700 mb-1">
                    {filter.label}
                  </label>
                  <select
                    id={`filter-${filter.name}`}
                    value={customFilterValues[filter.name] || "ALL"}
                    onChange={(e) => {
                      setCustomFilterValues({
                        ...customFilterValues,
                        [filter.name]: e.target.value
                      });
                      setCurrentPage(1);
                    }}
                    className="w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {filter.options.map((option, optIndex) => (
                      <option key={optIndex} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <PermissionButton
          permission={permissions.create}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors duration-200 flex items-center"
          onClick={() => navigate(`${addPath}`)}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          {addButtonText}
        </PermissionButton>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        {filteredItems.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3">STT</th>
                {columns.map((column, index) => (
                  <th key={index} scope="col" className="px-6 py-3">{column.header}</th>
                ))}
                <th scope="col" className="px-6 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item: any, i: number) => (
                <tr
                  className={`bg-white border-b hover:bg-gray-50 transition-colors duration-200 ${
                    deletingId === item.id ? 'opacity-50 bg-red-50' : ''
                  }`}
                  key={`${item.id || item.name || i}`}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  {columns.map((column, index) => (
                    <td key={index} className="px-6 py-4">
                      {column.render ? column.render(item, i) : item[column.key] || `Không có ${column.header.toLowerCase()}`}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <PermissionButton
                        permission={permissions.update}
                        type="link"
                        to={`${editPath}/${item.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors duration-200"
                      >
                        Sửa
                      </PermissionButton>
                      <PermissionButton
                        permission={permissions.delete}
                        className="font-medium text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded-md transition-colors duration-200"
                        onClick={() => openDeleteModal(item)}
                      >
                        Xóa
                      </PermissionButton>
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
            <p className="text-lg font-medium text-gray-600 mb-2">Không tìm thấy dữ liệu</p>
            <p className="text-gray-500 mb-4">Hãy thêm mới hoặc thay đổi bộ lọc tìm kiếm</p>
            <PermissionButton
              permission={permissions.create}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={() => navigate(`${addPath}`)}
            >
              {addButtonText}
            </PermissionButton>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredItems.length > 0 && isShowFooter && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-600">Hiển thị:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1em'
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-gray-600">mục mỗi trang</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Hiển thị {filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredItems.length)} của {filteredItems.length} mục
            </span>
          </div>

          <nav aria-label="Page navigation">
            <ul className="flex items-center -space-x-px h-8 text-sm">
              <li>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
                  </svg>
                </button>
              </li>
              
              {pageNumbers.map(number => (
                <li key={number}>
                  <button
                    onClick={() => paginate(number)}
                    className={`flex items-center justify-center px-3 h-8 leading-tight ${
                      currentPage === number
                        ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    {number}
                  </button>
                </li>
              ))}
              
              <li>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}

                >
                  <span className="sr-only">Next</span>
                  <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa</h3>
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa mục này?<br />Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId === itemToDelete?.id}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-md transition-colors duration-200"
              >
                {deletingId === itemToDelete?.id ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManage;














