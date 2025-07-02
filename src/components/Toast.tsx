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
    // Animate in with slight delay for better effect
    const showTimer = setTimeout(() => setIsVisible(true), 100);

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
    }, 300); // Match animation duration
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
        toast-item transform transition-all duration-300 mb-3 w-full max-w-sm
        ${isVisible && !isLeaving
          ? 'toast-enter-active'
          : isLeaving
            ? 'toast-exit-active'
            : 'toast-enter'
        }
      `}
      style={{
        animationFillMode: 'both',
        animationDuration: '300ms'
      }}
    >
      <div className={`
        w-full shadow-lg rounded-lg pointer-events-auto relative overflow-hidden
        ${getColors()}
        hover:shadow-xl transition-all duration-200 transform hover:scale-105
      `}>
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 w-full bg-black bg-opacity-10">
          <div
            className={`h-full ${getProgressBarColor()} toast-progress-bar`}
            style={{
              width: '100%',
              animation: `toastProgressShrink ${notification.duration}ms linear forwards`
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
          className="toast-close-btn absolute top-3 right-3 p-1.5 rounded-full hover:bg-black hover:bg-opacity-20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transform hover:scale-110"
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faTimes} className="h-3.5 w-3.5 text-white opacity-70 hover:opacity-100 transition-opacity duration-200" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
