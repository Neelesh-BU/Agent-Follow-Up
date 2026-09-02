import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingSpinner = ({
  fullScreen = false,
  message = 'Loading...',
}) => {
  if (fullScreen) {
    return (
      <Box
        className='flex flex-col items-center justify-center min-h-screen bg-slate-50'
        sx={{ fixed: 'inset-0', zIndex: 1300 }}
      >
        <CircularProgress size={48} thickness={4} color='primary' />
        {message && (
          <Typography
            variant='body1'
            className='mt-4 text-slate-600 font-medium'
          >
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box className='flex flex-col items-center justify-center p-8'>
      <CircularProgress size={36} thickness={4} color='primary' />
      {message && (
        <Typography variant='body2' className='mt-2 text-slate-500'>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;
