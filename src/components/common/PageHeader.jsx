import { Box, Typography } from '@mui/material';

export const PageHeader = ({ title, subtitle, action }) => {
  return (
    <Box className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-200 gap-4'>
      <div>
        <Typography
          variant='h4'
          component='h1'
          className='font-bold text-slate-900'
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant='body2' className='text-slate-500 mt-1'>
            {subtitle}
          </Typography>
        )}
      </div>
      {action && <div>{action}</div>}
    </Box>
  );
};

export default PageHeader;
