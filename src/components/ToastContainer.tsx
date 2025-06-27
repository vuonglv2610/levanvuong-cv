import React from 'react';
import { useNotifications } from 'contexts/NotificationContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
  const { notifications } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.slice(0, 5).map((notification) => (
        <Toast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default ToastContainer;
