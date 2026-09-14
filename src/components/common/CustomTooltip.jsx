import Tooltip from '@mui/material/Tooltip';

// Custom White Card Tooltip matching Follow-up records table design
export const CustomTooltip = ({
  title,
  children,
  placement = 'bottom-start',
  ...props
}) => {
  if (!title) return children;
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={false}
      enterDelay={150}
      leaveDelay={100}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: '#ffffff',
            color: '#1e293b',
            fontSize: '12px',
            fontWeight: 700,
            lineHeight: 1.45,
            boxShadow:
              '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            py: 1.25,
            px: 1.75,
            maxWidth: 340,
          },
        },
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
