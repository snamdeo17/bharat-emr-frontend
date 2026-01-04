import React, { useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useToastStore } from '../../store/toastStore';

const Toast = () => {
  const { message, severity, open, closeToast } = useToastStore();

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        closeToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [open, closeToast]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={closeToast}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={closeToast} severity={severity || 'info'} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
