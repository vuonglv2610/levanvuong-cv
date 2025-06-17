import React from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export function ErrorBoundary() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">
          {error.status} {error.statusText}
        </h1>
        <p className="mb-4">{error.data}</p>
        <a href="/" className="text-blue-500 hover:underline">Quay lại trang chủ</a>
      </div>
    );
  } else if (error instanceof Error) {
    console.error(error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Đã xảy ra lỗi</h1>
        <p className="mb-4">{error.message}</p>
        <details className="mb-4 p-2 border rounded">
          <summary className="cursor-pointer">Chi tiết lỗi</summary>
          <pre className="mt-2 whitespace-pre-wrap text-sm">{error.stack}</pre>
        </details>
        <a href="/" className="text-blue-500 hover:underline">Quay lại trang chủ</a>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Đã xảy ra lỗi không xác định</h1>
        <a href="/" className="text-blue-500 hover:underline">Quay lại trang chủ</a>
      </div>
    );
  }
}