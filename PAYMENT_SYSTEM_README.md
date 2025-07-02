# 💳 Hệ Thống Thanh Toán - Payment System

## 📋 Tổng Quan

Hệ thống thanh toán đã được tích hợp hoàn chỉnh với các tính năng:

- ✅ Thanh toán COD (Cash on Delivery)
- ✅ Thanh toán qua VNPay
- ✅ Theo dõi trạng thái thanh toán real-time
- ✅ Xử lý callback từ payment gateway
- ✅ Quản lý lỗi và retry mechanism
- 🔄 Sẵn sàng tích hợp MoMo, ZaloPay (đã chuẩn bị)

## 🔄 Flow Thanh Toán

### 1. **Cart → Checkout**
```
Giỏ hàng → Chọn sản phẩm → Checkout Page
```

### 2. **Checkout → Payment Processing**
```
Điền thông tin → Chọn phương thức thanh toán → Payment Processing Page
```

### 3. **Payment Gateway (VNPay)**
```
Payment Processing → Redirect VNPay → Thanh toán → Callback
```

### 4. **Payment Callback → Success/Failed**
```
VNPay Callback → Xử lý kết quả → Order Success/Failed Page
```

## 📁 Cấu Trúc Files

### **Services**
- `src/services/paymentService.ts` - Service xử lý API payment

### **Pages**
- `src/pages/Checkout.tsx` - Trang thanh toán (đã cập nhật)
- `src/pages/PaymentProcessingPage.tsx` - Trang xử lý thanh toán
- `src/pages/PaymentCallbackPage.tsx` - Xử lý callback từ gateway
- `src/pages/PaymentFailedPage.tsx` - Trang thanh toán thất bại
- `src/pages/OrderSuccessPage.tsx` - Trang thành công (đã cập nhật)
- `src/pages/OrdersPage.tsx` - Trang đơn hàng (đã cập nhật)

### **Components**
- `src/components/PaymentStatusTracker.tsx` - Component theo dõi trạng thái thanh toán

## 🚀 Cách Sử Dụng

### **1. Khởi tạo thanh toán**
```typescript
import paymentService, { PaymentData } from '../services/paymentService';

const paymentData: PaymentData = {
  customerId: userId,
  paymentMethod: 'vnpay', // 'cash', 'vnpay', 'momo', etc.
  description: 'Thanh toán đơn hàng'
};

const response = await paymentService.createPaymentFromCart(paymentData);
```

### **2. Theo dõi trạng thái thanh toán**
```tsx
import PaymentStatusTracker from '../components/PaymentStatusTracker';

<PaymentStatusTracker
  paymentId={paymentId}
  orderId={orderId}
  onStatusChange={(status) => console.log('Status:', status)}
/>
```

### **3. Xử lý callback VNPay**
```typescript
// Tự động xử lý tại /payment-callback
const urlParams = new URLSearchParams(location.search);
const response = await paymentService.checkVNPayResult(urlParams);
```

## 🔧 Cấu Hình Backend

### **Environment Variables**
```env
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_SECRET_KEY=your_vnpay_secret_key
VNPAY_HOST=https://sandbox.vnpayment.vn
VNPAY_RETURN_URL=http://localhost:3000/payment-callback
PAYMENT_RETURN_URL=http://localhost:3000/order-success
```

### **API Endpoints**
- `POST /payment/create-from-cart` - Tạo thanh toán từ giỏ hàng
- `GET /payment/:id` - Lấy thông tin thanh toán
- `PUT /payment/process/:id` - Xử lý thanh toán
- `GET /payment/check-vnpay` - Kiểm tra kết quả VNPay
- `PUT /payment/refund/:id` - Hoàn tiền

## 🎯 Routes Mới

```typescript
// Client routes
/checkout              - Trang thanh toán
/payment-processing    - Trang xử lý thanh toán
/payment-callback      - Callback từ payment gateway (public)
/payment-failed        - Trang thanh toán thất bại
/order-success         - Trang thành công (đã cập nhật)
/orders               - Trang đơn hàng (có payment tracking)
```

## 💡 Tính Năng Nổi Bật

### **1. Real-time Payment Tracking**
- Tự động refresh trạng thái mỗi 30 giây
- Hiển thị thông tin chi tiết thanh toán
- Status indicators với màu sắc trực quan

### **2. Error Handling**
- Retry mechanism cho failed payments
- User-friendly error messages
- Fallback options

### **3. Payment Methods Support**
```typescript
// Supported payment methods
'cash'         // COD
'vnpay'        // VNPay
'momo'         // MoMo (ready)
'zalopay'      // ZaloPay (ready)
'credit_card'  // Credit Card
'bank_transfer' // Bank Transfer
```

### **4. Payment Status**
```typescript
'pending'      // Chờ thanh toán
'processing'   // Đang xử lý
'completed'    // Đã hoàn thành
'failed'       // Thất bại
'cancelled'    // Đã hủy
'refunded'     // Đã hoàn tiền
```

## 🧪 Testing

### **Test Cases**
1. ✅ Thanh toán COD thành công
2. ✅ Thanh toán VNPay thành công
3. ✅ Thanh toán VNPay thất bại
4. ✅ Callback handling
5. ✅ Payment status tracking
6. ✅ Error handling và retry

### **Test Commands**
```bash
# Start frontend
npm start

# Start backend
cd learn-nodejs
npm start

# Test payment flow
1. Thêm sản phẩm vào giỏ hàng
2. Checkout với VNPay
3. Kiểm tra redirect và callback
4. Verify payment status trong Orders page
```

## 🔮 Tương Lai

### **Planned Features**
- [ ] MoMo integration
- [ ] ZaloPay integration
- [ ] Installment payments
- [ ] Wallet system
- [ ] Payment analytics dashboard
- [ ] Automated refund processing

### **Improvements**
- [ ] Payment retry với exponential backoff
- [ ] Payment webhook notifications
- [ ] Multi-currency support
- [ ] Payment method recommendations

## 🚨 Lưu Ý Quan Trọng

1. **VNPay Callback Route** (`/payment-callback`) phải là **public** (không cần authentication)
2. **Environment variables** phải được cấu hình đúng
3. **CORS** phải cho phép callback từ VNPay domain
4. **HTTPS** bắt buộc cho production
5. **Database transactions** đảm bảo data consistency

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Verify environment variables
3. Test với VNPay sandbox
4. Kiểm tra network requests
5. Review payment status trong database

---

**🎉 Hệ thống thanh toán đã sẵn sàng sử dụng!**
