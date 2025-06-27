import { useNotifications } from 'contexts/NotificationContext';

export const useToast = () => {
  const { addNotification } = useNotifications();

  const toast = {
    success: (title: string, message: string, duration?: number) => {
      addNotification({
        type: 'success',
        title,
        message,
        duration,
      });
    },
    error: (title: string, message: string, duration?: number) => {
      addNotification({
        type: 'error',
        title,
        message,
        duration,
      });
    },
    warning: (title: string, message: string, duration?: number) => {
      addNotification({
        type: 'warning',
        title,
        message,
        duration,
      });
    },
    info: (title: string, message: string, duration?: number) => {
      addNotification({
        type: 'info',
        title,
        message,
        duration,
      });
    },
  };

  return toast;
};

export default useToast;
