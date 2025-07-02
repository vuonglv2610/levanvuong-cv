import { faCode, faExclamationTriangle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface PaymentApiDebugProps {
  response: any;
  expectedStructure: any;
}

const PaymentApiDebug: React.FC<PaymentApiDebugProps> = ({ response, expectedStructure }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-3">
        <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 text-yellow-600 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            Vấn đề với API Payment
          </h3>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <FontAwesomeIcon icon={faInfoCircle} className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-gray-900">Response thực tế:</span>
              </div>
              <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>

            <div className="bg-white rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <FontAwesomeIcon icon={faCode} className="h-4 w-4 text-green-600" />
                <span className="font-medium text-gray-900">Cấu trúc mong đợi:</span>
              </div>
              <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
                {JSON.stringify(expectedStructure, null, 2)}
              </pre>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-2">Vấn đề:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• API `/payments/create-from-cart` đang trả về thông tin user thay vì payment</li>
                <li>• Cấu trúc response không khớp với interface `PaymentResponse`</li>
                <li>• Thiếu thông tin payment như orderId, paymentId, vnpayUrl</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Cần kiểm tra Backend:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Endpoint `/payments/create-from-cart` có đang implement đúng không?</li>
                <li>• Response có nên trả về payment info thay vì user info không?</li>
                <li>• Cấu trúc response có cần cập nhật theo interface không?</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Giải pháp tạm thời:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Frontend đã được cập nhật để xử lý cấu trúc response hiện tại</li>
                <li>• Sử dụng dữ liệu mock cho các trường thiếu</li>
                <li>• Hiển thị thông báo debug này để theo dõi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentApiDebug;
