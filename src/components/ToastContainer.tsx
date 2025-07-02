import { useNotifications } from 'contexts/NotificationContext';
import React from 'react';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="toast-container fixed top-4 right-4 md:top-6 md:right-6 z-[9999] max-w-sm w-full pointer-events-none px-4 md:px-0">
      <div className="space-y-1">
        {notifications.slice(0, 5).map((notification) => (
          <Toast key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
