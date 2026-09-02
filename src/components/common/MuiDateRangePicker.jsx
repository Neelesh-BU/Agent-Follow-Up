import { useState, useMemo } from 'react';
import Popover from '@mui/material/Popover';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MuiCalendar from './MuiCalendar';
import {
  displayDate,
  normalizeDateInputValue,
} from '@/utils/formatters';

/**
 * Reusable MUI Date Range Picker Component
 * Interactive MUI Popover Date Range Calendar without presets.
 */
export const MuiDateRangePicker = ({
  fromDate = '',
  toDate = '',
  onChange, // ({ from, to }) => void
  onOpenChange, // (isOpen: boolean) => void
  className = '',
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const [tempStart, setTempStart] = useState(fromDate);
  const [tempEnd, setTempEnd] = useState(toDate);

  const handleOpen = (event) => {
    if (disabled) return;
    setAnchorEl(event.currentTarget);
    setTempStart(fromDate);
    setTempEnd(toDate);
    onOpenChange?.(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onOpenChange?.(false);
  };

  const handleRangeChange = ({ start, end }) => {
    setTempStart(start);
    setTempEnd(end);
  };

  const handleApply = () => {
    const finalStart = tempStart || fromDate;
    const finalEnd = tempEnd || tempStart || toDate;

    onChange?.({
      from: finalStart,
      to: finalEnd,
    });
    handleClose();
  };

  const handleClear = () => {
    setTempStart('');
    setTempEnd('');
    onChange?.({
      from: '',
      to: '',
    });
    handleClose();
  };

  // Formatted trigger label
  const formattedRangeLabel = useMemo(() => {
    const normFrom = normalizeDateInputValue(fromDate);
    const normTo = normalizeDateInputValue(toDate);

    if (normFrom && normTo) {
      if (normFrom === normTo) {
        return displayDate(normFrom);
      }
      return `${displayDate(normFrom)} - ${displayDate(normTo)}`;
    }
    if (normFrom) return `From ${displayDate(normFrom)}`;
    if (normTo) return `Until ${displayDate(normTo)}`;

    return 'Select Interview Scheduled Date';
  }, [fromDate, toDate]);

  return (
    <>
      <button
        type='button'
        onClick={handleOpen}
        disabled={disabled}
        className={`h-8.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg inline-flex items-center gap-2 text-xs font-bold text-slate-800 shadow-2xs transition-all cursor-pointer select-none ${
          isOpen ? 'ring-2 ring-[#007cc2]/20 border-[#007cc2]' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        <CalendarMonthOutlinedIcon sx={{ fontSize: 16, color: '#007cc2' }} />
        <span className='truncate'>{formattedRangeLabel}</span>
        <KeyboardArrowDownIcon
          sx={{
            fontSize: 15,
            color: '#64748b',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: '16px',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              overflow: 'hidden',
            },
          },
        }}
      >
        <div className='flex flex-col bg-white'>
          {/* Header Range Display */}
          <div className='p-3 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/60 text-xs'>
            <div className='flex items-center gap-2 font-bold text-slate-700'>
              <span className='px-2.5 py-1 bg-white border border-slate-200 rounded-md shadow-2xs'>
                {tempStart ? displayDate(tempStart) : 'From Date'}
              </span>
              <ArrowForwardIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
              <span className='px-2.5 py-1 bg-white border border-slate-200 rounded-md shadow-2xs'>
                {tempEnd ? displayDate(tempEnd) : 'To Date'}
              </span>
            </div>
          </div>

          {/* Calendar Pane */}
          <MuiCalendar
            mode='range'
            startDate={tempStart}
            endDate={tempEnd}
            onRangeChange={handleRangeChange}
            showActions={false}
            className='border-0'
          />

          {/* Bottom Footer Actions */}
          <div className='flex items-center justify-between p-3 border-t border-slate-100 bg-slate-50/60'>
            <button
              type='button'
              onClick={handleClear}
              className='px-3 py-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-lg transition-colors cursor-pointer'
            >
              Reset
            </button>

            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={handleClose}
                className='px-3.5 py-1.5 text-slate-600 hover:bg-slate-200/70 text-xs font-bold rounded-lg transition-colors cursor-pointer'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleApply}
                className='px-4 py-1.5 bg-[#007cc2] hover:bg-[#006ca9] text-white text-xs font-extrabold rounded-lg shadow-xs transition-colors cursor-pointer'
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default MuiDateRangePicker;
