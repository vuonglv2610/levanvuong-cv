import { getCookie } from 'libs/getCookie';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { get, post } from 'services/api';

const ProductList = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    const getProducts = async () => {
        try {
            setLoading(true);
            const data = await get('/products');
            if(data?.data) {
                setProducts(data?.data?.result?.data || []);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Không thể tải danh sách sản phẩm');
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

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        
        const userId = getCookie("userId");
        
        if (!userId) {
            toast.info("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
            window.location.href = "/login";
            return;
        }
        
        try {
            post(`/shoppingcart`, {
                product_id: product.id,
                customer_id: userId,
                quantity: 1
            });
            toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Không thể thêm sản phẩm vào giỏ hàng");
        }
    }

    useEffect(() => {
        getProducts().then(() => {
            console.log('Products data:', products);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Không tìm thấy sản phẩm nào</h2>
                    <p className="text-gray-600 mb-8">Hiện tại chưa có sản phẩm nào trong danh mục này.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-12 sm:py-16">
                <h2 id="products-heading" className="text-2xl font-bold text-gray-900 mb-8">Sản phẩm nổi bật</h2>
                
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {currentProducts.map((product, index) => (
                        <div key={product.id || index} className="group relative">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 group-hover:opacity-90">
                                <Link to={`/product/${product.id}`}>
                                    <img 
                                        src={product.img || 'https://via.placeholder.com/300x300?text=No+Image'} 
                                        alt={product.name || 'Product image'} 
                                        className="h-60 w-full object-cover object-center"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=No+Image';
                                        }}
                                    />
                                </Link>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                                        <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
                                            {product.name || 'Sản phẩm không tên'}
                                        </Link>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                                        {product.category?.name || 'Không có danh mục'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {typeof product.price === 'number' 
                                            ? product.price.toLocaleString('vi-VN') + '₫' 
                                            : product.price || 'Liên hệ'}
                                    </p>
                                    {product.oldPrice && (
                                        <p className="text-sm text-gray-500 line-through">
                                            {typeof product.oldPrice === 'number' 
                                                ? product.oldPrice.toLocaleString('vi-VN') + '₫' 
                                                : product.oldPrice}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-3">
                                <button 
                                    onClick={(e) => handleAddToCart(e, product)}
                                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                    Thêm vào giỏ
                                </button>
                            </div>
                            {product.isNew && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    Mới
                                </div>
                            )}
                            {product.discount && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    -{product.discount}%
                                </div>
                            )}
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
                            >
                                <option value="4">4</option>
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
            </div>
        </div>
    );
}

export default ProductList;
