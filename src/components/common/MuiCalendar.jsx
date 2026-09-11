import { useState, useMemo } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TodayIcon from '@mui/icons-material/Today';
import ClearIcon from '@mui/icons-material/Clear';
import { normalizeDateInputValue } from '@/utils/formatters';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAYS_HEADER = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * Custom MUI-styled Calendar Component
 * Supports both single date selection and date-range selection without native browser popups.
 */
export const MuiCalendar = ({
  mode = 'single', // 'single' | 'range'
  value = '', // for single mode (YYYY-MM-DD or DD-MM-YYYY)
  onChange, // (dateStr: 'YYYY-MM-DD') => void
  startDate = '', // for range mode (YYYY-MM-DD)
  endDate = '', // for range mode (YYYY-MM-DD)
  onRangeChange, // ({ start, end }) => void
  minDate,
  maxDate,
  onClose,
  showActions = true,
  className = '',
}) => {
  const normalizedValue = normalizeDateInputValue(value);
  const normalizedStart = normalizeDateInputValue(startDate);
  const normalizedEnd = normalizeDateInputValue(endDate);
  const normalizedMin = minDate ? normalizeDateInputValue(minDate) : null;
  const normalizedMax = maxDate ? normalizeDateInputValue(maxDate) : null;

  // Determine initial view month & year
  const initialDate = useMemo(() => {
    if (mode === 'range' && normalizedStart) {
      return new Date(normalizedStart);
    }
    if (normalizedValue) {
      return new Date(normalizedValue);
    }
    if (normalizedMin) {
      return new Date(normalizedMin);
    }
    return new Date();
  }, [mode, normalizedStart, normalizedValue, normalizedMin]);

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0 - 11
  const [hoveredDate, setHoveredDate] = useState(null);
  const [tempRangeStart, setTempRangeStart] = useState(null);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const isDateDisabled = (dateStr) => {
    if (normalizedMin && dateStr < normalizedMin) return true;
    if (normalizedMax && dateStr > normalizedMax) return true;
    return false;
  };

  const handleGoToToday = () => {
    const today = new Date();
    const isoToday = today.toISOString().slice(0, 10);
    if (isDateDisabled(isoToday)) return;

    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    if (mode === 'single') {
      onChange?.(isoToday);
      onClose?.();
    } else {
      onRangeChange?.({ start: isoToday, end: isoToday });
    }
  };

  const handleClear = () => {
    if (mode === 'single') {
      onChange?.('');
    } else {
      setTempRangeStart(null);
      onRangeChange?.({ start: '', end: '' });
    }
  };

  // Generate calendar days for current month view
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days = [];

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const m = viewMonth === 0 ? 11 : viewMonth - 1;
      const y = viewMonth === 0 ? viewYear - 1 : viewYear;
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
      });
    }

    // Next month filler days (to complete 42 cells)
    const remaining = 42 - days.length;
    for (let n = 1; n <= remaining; n++) {
      const m = viewMonth === 11 ? 0 : viewMonth + 1;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: n,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const handleDateClick = (dateStr) => {
    if (isDateDisabled(dateStr)) return;

    if (mode === 'single') {
      onChange?.(dateStr);
      onClose?.();
      return;
    }

    // Range mode logic
    if (!tempRangeStart && !normalizedStart) {
      setTempRangeStart(dateStr);
      onRangeChange?.({ start: dateStr, end: '' });
    } else if (tempRangeStart) {
      if (dateStr < tempRangeStart) {
        onRangeChange?.({ start: dateStr, end: tempRangeStart });
      } else {
        onRangeChange?.({ start: tempRangeStart, end: dateStr });
      }
      setTempRangeStart(null);
    } else {
      // Start a new range selection
      setTempRangeStart(dateStr);
      onRangeChange?.({ start: dateStr, end: '' });
    }
  };

  // Helper to determine range styling
  const getDayStatus = (dateStr) => {
    const disabled = isDateDisabled(dateStr);

    if (mode === 'single') {
      return {
        isSelected: dateStr === normalizedValue,
        isToday: dateStr === todayStr,
        isInRange: false,
        isRangeStart: dateStr === normalizedValue,
        isRangeEnd: dateStr === normalizedValue,
        isDisabled: disabled,
      };
    }

    const start = tempRangeStart || normalizedStart;
    let end = normalizedEnd;

    if (tempRangeStart && hoveredDate && !normalizedEnd) {
      end = hoveredDate;
    }

    const effectiveStart = start && end && start > end ? end : start;
    const effectiveEnd = start && end && start > end ? start : end;

    const isStart = dateStr === effectiveStart;
    const isEnd = dateStr === effectiveEnd;
    const inRange =
      effectiveStart &&
      effectiveEnd &&
      dateStr > effectiveStart &&
      dateStr < effectiveEnd;

    return {
      isSelected: isStart || isEnd,
      isToday: dateStr === todayStr,
      isInRange: inRange,
      isRangeStart: isStart,
      isRangeEnd: isEnd,
      isDisabled: disabled,
    };
  };

  // Year options for fast navigation dropdown
  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    const years = [];
    for (let y = current - 5; y <= current + 5; y++) {
      years.push(y);
    }
    return years;
  }, []);

  return (
    <div
      className={`p-3.5 bg-white select-none w-72 text-slate-800 font-sans ${className}`}
      onMouseLeave={() => setHoveredDate(null)}
    >
      {/* Month & Year Header Navigation */}
      <div className='flex items-center justify-between gap-1 mb-3'>
        <div className='flex items-center gap-1.5'>
          <select
            value={viewMonth}
            onChange={(e) => setViewMonth(Number(e.target.value))}
            className='h-7.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none cursor-pointer'
          >
            {MONTH_NAMES.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={viewYear}
            onChange={(e) => setViewYear(Number(e.target.value))}
            className='h-7.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none cursor-pointer'
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className='flex items-center gap-0.5'>
          <button
            type='button'
            onClick={handlePrevMonth}
            className='w-7.5 h-7.5 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 active:scale-95 transition-all cursor-pointer'
            aria-label='Previous Month'
          >
            <ChevronLeftIcon sx={{ fontSize: 18 }} />
          </button>
          <button
            type='button'
            onClick={handleNextMonth}
            className='w-7.5 h-7.5 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 active:scale-95 transition-all cursor-pointer'
            aria-label='Next Month'
          >
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className='grid grid-cols-7 gap-1 mb-1 text-center'>
        {DAYS_HEADER.map((d, i) => (
          <div
            key={d}
            className={`text-[11px] font-extrabold ${i === 0 || i === 6 ? 'text-slate-400' : 'text-slate-500'}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className='grid grid-cols-7 gap-y-1 gap-x-0.5'>
        {calendarGrid.map(({ dateStr, dayNum, isCurrentMonth }) => {
          const {
            isSelected,
            isToday,
            isInRange,
            isRangeStart,
            isRangeEnd,
            isDisabled,
          } = getDayStatus(dateStr);

          return (
            <div
              key={dateStr}
              className={`relative flex items-center justify-center h-8 ${
                isInRange ? 'bg-[#10b981]/15' : ''
              } ${isRangeStart && normalizedEnd ? 'rounded-l-full bg-[#10b981]/15' : ''} ${
                isRangeEnd && normalizedStart ? 'rounded-r-full bg-[#10b981]/15' : ''
              }`}
            >
              <button
                type='button'
                disabled={isDisabled}
                onClick={() => handleDateClick(dateStr)}
                onMouseEnter={() => mode === 'range' && !isDisabled && setHoveredDate(dateStr)}
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-150 ${
                  isDisabled
                    ? 'text-slate-300 opacity-40 cursor-not-allowed bg-transparent'
                    : isSelected
                      ? 'bg-linear-to-r from-[#10b981] to-[#059669] text-white shadow-xs font-black ring-2 ring-[#10b981]/30 scale-105 z-10 cursor-pointer'
                      : isToday
                        ? 'border-2 border-[#10b981] text-[#059669] hover:bg-emerald-50 cursor-pointer'
                        : isInRange
                          ? 'text-[#059669] font-extrabold hover:bg-[#10b981]/20 cursor-pointer'
                          : isCurrentMonth
                            ? 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer'
                            : 'text-slate-300 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                {dayNum}
              </button>
            </div>
          );
        })}
      </div>

      {/* Action footer */}
      {showActions && (
        <div className='flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs'>
          <button
            type='button'
            onClick={handleClear}
            className='inline-flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md font-bold transition-colors cursor-pointer'
          >
            <ClearIcon sx={{ fontSize: 13 }} />
            <span>Clear</span>
          </button>

          <button
            type='button'
            onClick={handleGoToToday}
            disabled={isDateDisabled(todayStr)}
            className='inline-flex items-center gap-1 px-2.5 py-1 text-[#059669] hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-md font-bold transition-colors cursor-pointer'
          >
            <TodayIcon sx={{ fontSize: 13 }} />
            <span>Today</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MuiCalendar;
