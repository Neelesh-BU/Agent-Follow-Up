import { createContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

export const NotificationContext = createContext({
  showSuccess: () => {},
  showError: () => {},
  showWarning: () => {},
  showInfo: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info', // 'success' | 'error' | 'warning' | 'info'
    autoHideDuration: 4000,
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const showNotification = useCallback(
    (message, severity = 'info', autoHideDuration = 4000) => {
      setNotification({
        open: true,
        message,
        severity,
        autoHideDuration,
      });
    },
    [],
  );

  const showSuccess = useCallback(
    (message) => showNotification(message, 'success'),
    [showNotification],
  );

  const showError = useCallback(
    (message) => showNotification(message, 'error'),
    [showNotification],
  );

  const showWarning = useCallback(
    (message) => showNotification(message, 'warning'),
    [showNotification],
  );

  const showInfo = useCallback(
    (message) => showNotification(message, 'info'),
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
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.autoHideDuration}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant='filled'
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
