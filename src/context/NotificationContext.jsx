import { createContext, useCallback } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export const NotificationContext = createContext({
  showSuccess: () => {},
  showError: () => {},
  showWarning: () => {},
  showInfo: () => {},
  showNotification: () => {},
});

export const NotificationProvider = ({ children }) => {
  const showNotification = useCallback(
    (message, severity = 'info', options = {}) => {
      switch (severity) {
        case 'success':
          return toast.success(message, options);
        case 'error':
          return toast.error(message, options);
        case 'warning':
          return toast.warning(message, options);
        case 'info':
        default:
          return toast.info(message, options);
      }
    },
    [],
  );

  const showSuccess = useCallback(
    (message, options) => showNotification(message, 'success', options),
    [showNotification],
  );

  const showError = useCallback(
    (message, options) => showNotification(message, 'error', options),
    [showNotification],
  );

  const showWarning = useCallback(
    (message, options) => showNotification(message, 'warning', options),
    [showNotification],
  );

  const showInfo = useCallback(
    (message, options) => showNotification(message, 'info', options),
    [showNotification],
  );

  return (
    <NotificationContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showNotification,
      }}
    >
      {children}
      <Toaster position='top-right' closeButton />
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

