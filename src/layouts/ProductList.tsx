import { useQueryClient } from '@tanstack/react-query';
import useToast from 'hooks/useToast';
import { getCookie } from 'libs/getCookie';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { get, post } from 'services/api';
import ProductFilter from '../components/ProductFilter';

interface ProductFilterParams {
  name?: string;
  sku?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

const ProductList = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const toast = useToast();
    const queryClient = useQueryClient();

    // Khởi tạo filterParams từ URL search params
    const initialFilterParams = useMemo(() => {
        const params: ProductFilterParams = {};

        if (searchParams.get('name')) params.name = searchParams.get('name')!;
        if (searchParams.get('sku')) params.sku = searchParams.get('sku')!;
        if (searchParams.get('categoryId')) params.categoryId = searchParams.get('categoryId')!;
        if (searchParams.get('brandId')) params.brandId = searchParams.get('brandId')!;
        if (searchParams.get('minPrice')) params.minPrice = Number(searchParams.get('minPrice'));
        if (searchParams.get('maxPrice')) params.maxPrice = Number(searchParams.get('maxPrice'));
        if (searchParams.get('sort_by')) params.sort_by = searchParams.get('sort_by')!;
        if (searchParams.get('sort_order')) params.sort_order = searchParams.get('sort_order') as 'ASC' | 'DESC';

        return params;
    }, [searchParams]);

    const [filterParams, setFilterParams] = useState<ProductFilterParams>(initialFilterParams);

    // Tạo URL với query parameters
    const apiUrl = useMemo(() => {
        const params = new URLSearchParams();

        Object.entries(filterParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        const queryString = params.toString();
        return queryString ? `/products?${queryString}` : '/products';
    }, [filterParams]);

    const getProducts = async () => {
        try {
            setLoading(true);
            const data = await get(apiUrl);
            if(data?.data) {
                setProducts(data?.data?.result?.data || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Lỗi', 'Không thể tải danh sách sản phẩm');
        } finally {
            setLoading(false);
        }
    }

    // Tính toán tổng số trang
    const totalPages = useMemo(() => {
        return Math.ceil(products.length / itemsPerPage);
    }, [products, itemsPerPage]);

    // Lấy sản phẩm cho trang hiện tại
    const currentProducts = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return products.slice(indexOfFirstItem, indexOfLastItem);
    }, [products, currentPage, itemsPerPage]);

    // Xử lý chuyển trang
    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            // Cuộn lên đầu danh sách sản phẩm
            window.scrollTo({
                top: document.getElementById('products-heading')?.offsetTop || 0,
                behavior: 'smooth'
            });
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

    const handleAddToCart = async (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();

        const userId = getCookie("userId");

        if (!userId) {
            toast.info("Thông báo", "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
            window.location.href = "/login";
            return;
        }

        // Kiểm tra số lượng trong kho
        if (product.quantity === 0) {
            toast.error("Lỗi", "Sản phẩm đã hết hàng");
            return;
        }

        try {
            await post(`/shoppingcart`, {
                product_id: product.id,
                customer_id: userId,
                quantity: 1
            });

            // Invalidate cart cache để cập nhật số lượng trong Header
            queryClient.invalidateQueries({ queryKey: ['/shoppingcart/customer', userId] });

            toast.success("Thành công", `Đã thêm ${product.name} vào giỏ hàng!`);
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Lỗi", "Không thể thêm sản phẩm vào giỏ hàng");
        }
    }

    // Handler cho filter change
    const handleFilterChange = (newParams: ProductFilterParams) => {
        setFilterParams(newParams);
        setCurrentPage(1); // Reset về trang đầu khi filter thay đổi
    };

    useEffect(() => {
        getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiUrl]); // Thay đổi dependency từ [] thành [apiUrl]

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-12 sm:py-16">
                <h2 id="products-heading" className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm nổi bật</h2>

                {/* Layout with Filter and Products */}
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Filter Sidebar */}
                    <div className="lg:col-span-1 mb-8 lg:mb-0">
                        <ProductFilter
                            onFilterChange={handleFilterChange}
                            initialParams={filterParams}
                        />
                    </div>

                    {/* Products Section */}
                    <div className="lg:col-span-3">
                        {/* Hiển thị thông báo khi không có sản phẩm */}
                        {products.length === 0 && !loading ? (
                            <div className="text-center py-16">
                                <div className="mb-6">
                                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.9-6.172-2.172M12 21l9-9-9-9-9 9 9 9z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Không tìm thấy sản phẩm nào</h3>
                                <p className="text-gray-600 mb-6">
                                    {Object.keys(filterParams).length > 0
                                        ? "Không có sản phẩm nào phù hợp với bộ lọc hiện tại. Hãy thử điều chỉnh bộ lọc hoặc xóa một số tiêu chí tìm kiếm."
                                        : "Hiện tại chưa có sản phẩm nào trong danh mục này."
                                    }
                                </p>
                                {Object.keys(filterParams).length > 0 && (
                                    <button
                                        onClick={() => {
                                            setFilterParams({});
                                            setCurrentPage(1);
                                        }}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Xóa tất cả bộ lọc
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Products Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {currentProducts.map((product, index) => (
                        <div key={product.id || index} className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 flex flex-col h-full">
                            {/* Image Container */}
                            <div className="relative overflow-hidden">
                                <Link to={`/product/${product.id}`}>
                                    <div className="aspect-square w-full bg-gray-50 overflow-hidden">
                                        <img
                                            src={product.img || 'https://via.placeholder.com/300x300?text=No+Image'}
                                            alt={product.name || 'Product image'}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
                                            }}
                                        />
                                    </div>
                                </Link>

                                {/* Badges */}
                                {product.isNew && (
                                    <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                                        Mới
                                    </div>
                                )}
                                {product.discount && (
                                    <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                                        -{product.discount}%
                                    </div>
                                )}

                                {/* Out of Stock Badge */}
                                {product.quantity === 0 && (
                                    <div className="absolute bottom-3 left-3 bg-gray-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                                        Hết hàng
                                    </div>
                                )}

                                {/* Quick Add Button - Hiện khi hover */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        disabled={product.quantity === 0}
                                        className={`px-4 py-2 rounded-lg font-medium shadow-lg transition-colors transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 ${
                                            product.quantity === 0
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-white text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                        {product.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex-1 flex flex-col">
                                {/* Product Info */}
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] leading-tight mb-2">
                                        <Link to={`/product/${product.id}`} className="hover:text-blue-600 transition-colors">
                                            {product.name || 'Sản phẩm không tên'}
                                        </Link>
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                                        {product.categoryName || 'Không có danh mục'}
                                    </p>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-lg font-bold text-gray-900">
                                            {typeof product.price === 'number'
                                                ? product.price.toLocaleString('vi-VN') + '₫'
                                                : product.price || 'Liên hệ'}
                                        </p>
                                        {product.oldPrice && (
                                            <p className="text-sm text-gray-400 line-through">
                                                {typeof product.oldPrice === 'number'
                                                    ? product.oldPrice.toLocaleString('vi-VN') + '₫'
                                                    : product.oldPrice}
                                            </p>
                                        )}
                                    </div>

                                    {/* Rating Stars (placeholder) */}
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                            </svg>
                                        ))}
                                        <span className="text-xs text-gray-500 ml-1">(4.5)</span>
                                    </div>
                                </div>

                                {/* Stock Information */}
                                <div className="mt-2 text-sm">
                                    <span className={`${product.quantity === 0 ? 'text-red-500' : product.quantity < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                                        {product.quantity === 0 ? 'Hết hàng' :
                                         product.quantity < 10 ? `Còn ${product.quantity} sản phẩm` :
                                         'Còn hàng'}
                                    </span>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={(e) => handleAddToCart(e, product)}
                                    disabled={product.quantity === 0}
                                    className={`w-full mt-4 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                                        product.quantity === 0
                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                    {product.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Pagination */}
                {products.length > 0 && (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-10">
                        <div className="flex items-center gap-2">
                            <label htmlFor="items-per-page" className="text-sm text-gray-700">Hiển thị:</label>
                            <select
                                id="items-per-page"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                className="p-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
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
                                <option value="4">4</option>
                                <option value="6">6</option>
                                <option value="8">8</option>
                                <option value="12">12</option>
                                <option value="16">16</option>
                            </select>
                            <span className="text-sm text-gray-700">
                                Hiển thị <span className="font-medium">{currentProducts.length}</span> / <span className="font-medium">{products.length}</span> sản phẩm
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductList;
