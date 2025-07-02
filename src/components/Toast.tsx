import {
    faCheckCircle,
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle,
    faTimes
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Notification, useNotifications } from 'contexts/NotificationContext';
import React, { useEffect, useState } from 'react';

interface ToastProps {
  notification: Notification;
}

const Toast: React.FC<ToastProps> = ({ notification }) => {
  const { removeNotification } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setIsVisible(true), 50);

    // Auto remove after duration
    let autoRemoveTimer: NodeJS.Timeout;
    if (notification.duration && notification.duration > 0) {
      autoRemoveTimer = setTimeout(() => {
        handleClose();
      }, notification.duration);
    }

    return () => {
      clearTimeout(showTimer);
      if (autoRemoveTimer) {
        clearTimeout(autoRemoveTimer);
      }
    };
  }, [notification.duration]);

  const handleClose = () => {
    if (isLeaving) return; // Prevent multiple calls
    setIsLeaving(true);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 400); // Increased to match animation duration
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationCircle;
      case 'warning':
        return faExclamationTriangle;
      case 'info':
        return faInfoCircle;
      default:
        return faInfoCircle;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getIconColor = () => {
    return 'text-white';
  };

  const getProgressBarColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-300';
      case 'error':
        return 'bg-red-300';
      case 'warning':
        return 'bg-yellow-300';
      case 'info':
        return 'bg-blue-300';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div
      className={`
        transform transition-all duration-400 mb-3 w-full max-w-sm
        ${isVisible && !isLeaving
          ? 'translate-x-0 opacity-100 scale-100'
          : isLeaving
            ? 'translate-x-full opacity-0 scale-95'
            : 'translate-x-full opacity-0 scale-95'
        }
        ${isVisible && !isLeaving ? 'ease-out' : 'ease-in'}
      `}
    >
      <div className={`
        w-full shadow-2xl rounded-lg pointer-events-auto relative overflow-hidden
        ${getColors()}
        hover:shadow-3xl transition-shadow duration-200
      `}>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-black bg-opacity-20">
          <div
            className={`h-full ${getProgressBarColor()} transition-all duration-100 ease-linear`}
            style={{
              width: '100%',
              animation: `shrink ${notification.duration}ms linear forwards`
            }}
          />
        </div>

        <div className="p-4 pr-12">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <FontAwesomeIcon
                icon={getIcon()}
                className={`h-5 w-5 ${getIconColor()}`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-5">
                {notification.title}
              </p>
              <p className="mt-1 text-sm opacity-95 leading-5">
                {notification.message}
              </p>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          className="absolute top-2 right-2 p-2 rounded-full hover:bg-black hover:bg-opacity-10 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faTimes} className="h-4 w-4 text-white opacity-80 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
