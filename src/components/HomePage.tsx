import { useAuthProvider } from "contexts/AuthContext";
import ProductList from "layouts/ProductList";
import ProductsList from "pages/Products";
import React from "react";
import HotDeals from "./HotDeals";
import SwiperComponent from "./SwiperComponent";

const HomePage = () => {
  const { userInfo } = useAuthProvider();
  const user: any = userInfo;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <SwiperComponent />

      {/* Welcome Section */}
      {user && (
        <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container">
            <div className="text-center" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Chào mừng trở lại, {user?.fullname}! 👋
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Khám phá những sản phẩm mới nhất và ưu đãi đặc biệt dành riêng cho bạn
              </p>
            </div>
          </div>
        </section>
      )}

      <ProductList/>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tuyệt vời nhất cho khách hàng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Giao hàng nhanh</h3>
              <p className="text-gray-600">Giao hàng trong 24h tại TP.HCM và 2-3 ngày toàn quốc</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-300" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Chất lượng đảm bảo</h3>
              <p className="text-gray-600">Sản phẩm chính hãng 100% với bảo hành chính thức</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors duration-300" data-aos="fade-up" data-aos-delay="300">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ</p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors duration-300" data-aos="fade-up" data-aos-delay="400">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Giá tốt nhất</h3>
              <p className="text-gray-600">Cam kết giá tốt nhất thị trường với nhiều ưu đãi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Deals Section */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-pink-50">
        <div className="container">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🔥 Ưu đãi hot trong tuần
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Những sản phẩm được giảm giá sâu, số lượng có hạn
            </p>
          </div>
          <HotDeals />
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá bộ sưu tập sản phẩm đa dạng với chất lượng tuyệt vời
            </p>
          </div>
          <ProductsList />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container">
          <div className="text-center text-white" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Đăng ký nhận tin tức mới nhất
            </h2>
            <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
              Nhận thông báo về sản phẩm mới, ưu đãi đặc biệt và tin tức công nghệ
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-900"
                />
                <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div data-aos="fade-up" data-aos-delay="100">
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-gray-300">Khách hàng hài lòng</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">500+</div>
              <div className="text-gray-300">Sản phẩm chất lượng</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-300">Hỗ trợ khách hàng</div>
            </div>
            <div data-aos="fade-up" data-aos-delay="400">
              <div className="text-4xl md:text-5xl font-bold text-orange-400 mb-2">99%</div>
              <div className="text-gray-300">Đánh giá tích cực</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
