import { Component } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box className='flex items-center justify-center min-h-screen p-4 bg-slate-50'>
          <Paper className='max-w-md w-full p-8 text-center rounded-xl shadow-lg border border-slate-200'>
            <ErrorOutlineIcon
              className='text-red-500 mb-4'
              sx={{ fontSize: 56 }}
            />
            <Typography variant='h5' className='font-bold text-slate-800 mb-2'>
              Something went wrong
            </Typography>
            <Typography variant='body2' className='text-slate-600 mb-6'>
              An unexpected error occurred in the application. Please try
              reloading the page.
            </Typography>
            <Button
              variant='contained'
              color='primary'
              onClick={this.handleReload}
              size='large'
              disableElevation
            >
              Reload Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
