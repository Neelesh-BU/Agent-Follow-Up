import { useState, useRef } from 'react';
import Popover from '@mui/material/Popover';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CheckIcon from '@mui/icons-material/Check';
import MuiCalendar from './MuiCalendar';
import {
  displayDate,
  displayTime,
  normalizeDateInputValue,
  normalizeTimeInputValue,
} from '@/utils/formatters';

const COMMON_TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
];

/**
 * Custom DateTimePickerField using Material-UI Popover and MuiCalendar
 * Completely replaces native browser date/time popups with styled MUI pickers.
 */
export const DateTimePickerField = ({
  id,
  type = 'date', // 'date' | 'time'
  value = '',
  onChange,
  placeholder,
  disabled = false,
  required = false,
  readOnly = false,
  minDate,
  maxDate,
  disablePastTime = false,
  className = '',
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const containerRef = useRef(null);

  const handleOpen = (event) => {
    if (disabled || readOnly) return;
    setAnchorEl(containerRef.current || event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateSelect = (isoDate) => {
    if (!isoDate) {
      onChange?.('');
    } else {
      onChange?.(displayDate(isoDate));
    }
    handleClose();
  };

  const handleTimeSlotSelect = (timeSlot) => {
    // Convert 12hr slot (e.g. "02:30 PM") to 24hr "14:30" or normalized format
    const normalized = normalizeTimeInputValue(timeSlot);
    onChange?.(normalized || timeSlot);
    handleClose();
  };

  const formattedDisplayValue =
    type === 'date' ? (value ? displayDate(value) : '') : (value ? displayTime(value) : '');

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center border rounded-lg overflow-hidden bg-white transition-all ${
        disabled
          ? 'opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed'
          : isOpen
            ? 'border-[#007cc2] ring-2 ring-[#007cc2]/15'
            : 'border-slate-300 hover:border-slate-400'
      } ${className}`}
    >
      <input
        id={id}
        type='text'
        placeholder={placeholder || (type === 'date' ? 'DD-MM-YYYY' : 'HH:MM')}
        value={formattedDisplayValue}
        onChange={(e) => onChange?.(e.target.value)}
        onClick={handleOpen}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className='w-full h-9 px-3 border-0 outline-none text-slate-800 text-xs font-semibold bg-transparent cursor-pointer'
      />

      <button
        type='button'
        aria-label='Open calendar'
        onClick={handleOpen}
        disabled={disabled || readOnly}
        className='w-9 h-9 flex items-center justify-center border-l border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#007cc2] disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0'
      >
        {type === 'date' ? (
          <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />
        ) : (
          <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
        )}
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
              mt: 0.5,
              borderRadius: '14px',
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(226, 232, 240, 0.9)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {type === 'date' ? (
          <MuiCalendar
            mode='single'
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleDateSelect}
            onClose={handleClose}
          />
        ) : (
          <div className='p-2.5 bg-white w-52 max-h-64 overflow-y-auto custom-scrollbar flex flex-col gap-0.5'>
            <div className='text-[10px] font-black uppercase tracking-wider text-slate-400 px-2.5 py-1 mb-1'>
              Select Time
            </div>
            {COMMON_TIME_SLOTS.filter(slot => {
              if (!disablePastTime) return true;
              const [time, modifier] = slot.split(' ');
              let [hours, minutes] = time.split(':').map(Number);
              if (hours === 12) hours = modifier === 'PM' ? 12 : 0;
              else if (modifier === 'PM') hours += 12;
              
              const slotTime = hours * 60 + minutes;
              const now = new Date();
              const currentTime = now.getHours() * 60 + now.getMinutes();
              return slotTime > currentTime;
            }).map((slot) => {
              const normSlot = normalizeTimeInputValue(slot);
              const isSelected = normSlot === normalizeTimeInputValue(value);
              return (
                <button
                  key={slot}
                  type='button'
                  onClick={() => handleTimeSlotSelect(slot)}
                  className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-left flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#007cc2] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{slot}</span>
                  {isSelected && <CheckIcon sx={{ fontSize: 14 }} />}
                </button>
              );
            })}
          </div>
        )}
      </Popover>
    </div>
  );
};

export default DateTimePickerField;
