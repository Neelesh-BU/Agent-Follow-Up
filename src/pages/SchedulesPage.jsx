import { Box, Paper, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/common/PageHeader';

export const SchedulesPage = () => {
  return (
    <Box>
      <PageHeader
        title='Schedules'
        subtitle='Manage and configure your automated schedules'
        action={
          <Button variant='contained' startIcon={<AddIcon />} disableElevation>
            Create Schedule
          </Button>
        }
      />
      <Paper
        elevation={0}
        className='p-8 border border-slate-200 rounded-xl text-center'
      >
        <Typography variant='h6' className='text-slate-700 font-semibold mb-2'>
          No schedules created yet
        </Typography>
        <Typography
          variant='body2'
          className='text-slate-500 max-w-md mx-auto mb-6'
        >
          Get started by creating your first automated scheduling workflow.
        </Typography>
        <Button variant='contained' startIcon={<AddIcon />} disableElevation>
          Create First Schedule
        </Button>
      </Paper>
    </Box>
  );
};

export default SchedulesPage;
