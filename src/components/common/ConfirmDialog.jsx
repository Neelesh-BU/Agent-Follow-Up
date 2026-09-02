import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

export const ConfirmDialog = ({
  open,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth='xs' fullWidth>
      <DialogTitle className='font-semibold text-slate-900'>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText className='text-slate-600'>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions className='px-6 pb-4'>
        <Button onClick={onCancel} color='inherit'>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={confirmColor}
          variant='contained'
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
