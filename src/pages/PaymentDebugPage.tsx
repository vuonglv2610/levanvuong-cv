import { faArrowLeft, faPlay, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useToast from 'hooks/useToast';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentApiDebug from '../components/PaymentApiDebug';
import paymentService from '../services/paymentService';

const PaymentDebugPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const expectedPaymentResponse = {
    statusCode: 200,
    message: "Success!",
    result: {
      data: {
        payment: {
          id: "payment-id",
          orderId: "order-id",
          customerId: "customer-id",
          amount: 100000,
          paymentMethod: "vnpay",
          paymentStatus: "pending",
          transactionId: "transaction-id",
          finalAmount: 95000,
          discountAmount: 5000
        },
        order: {
          id: "order-id",
          customerId: "customer-id",
          status: "pending",
          total_amount: 100000
        },
        vnpayUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?..."
      }
    }
  };

  const testPaymentData = {
    customerId: "6f9ff9c4-cf13-45a6-87e1-2a97e7484e12",
    paymentMethod: "vnpay" as const,
    voucherId: "",
    description: "Test payment from debug page"
  };

  const handleTestPayment = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setResponse(null);

      console.log('Testing payment with data:', testPaymentData);
      
      const result = await paymentService.createPaymentFromCart(testPaymentData);
      
      console.log('Payment test result:', result);
      setResponse(result);
      
      toast.success('Thành công', 'API call completed. Check response below.');
    } catch (err: any) {
      console.error('Payment test error:', err);
      setError(err.message);
      toast.error('Lỗi', 'API call failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                <span>Quay lại</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Payment API Debug
              </h1>
            </div>
            
            <button
              onClick={handleTestPayment}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <FontAwesomeIcon icon={faSync} className="h-4 w-4 animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faPlay} className="h-4 w-4" />
              )}
              <span>{isLoading ? 'Testing...' : 'Test API'}</span>
            </button>
          </div>
        </div>

        {/* Test Data */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Data</h2>
          <div className="bg-gray-100 rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(testPaymentData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Response Debug */}
        {response && (
          <PaymentApiDebug 
            response={response} 
            expectedStructure={expectedPaymentResponse}
          />
        )}

        {/* API Documentation */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            API Documentation
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Endpoint:</h3>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                POST /payments/create-from-cart
              </code>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Request Body:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`{
  "customerId": "string",
  "paymentMethod": "vnpay" | "momo" | "zalopay" | "cash" | "bank_transfer",
  "voucherId": "string (optional)",
  "description": "string (optional)"
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Expected Response:</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(expectedPaymentResponse, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDebugPage;
