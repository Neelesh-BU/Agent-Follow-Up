import { useState, useEffect, useRef, useMemo } from 'react';
import { normalizeDateInputValue, normalizeTimeInputValue } from '@/utils/formatters';

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

/**
 * Checks if a specific 12-hour time (e.g. hr="02", min="15", period="PM")
 * has passed relative to today's current time.
 */
export const isTimePast = (hour12, minute, period, selectedDate) => {
  if (!selectedDate) return false;

  const normalizedDate = normalizeDateInputValue(selectedDate);
  if (!normalizedDate) return false;

  const now = new Date();
  const todayY = now.getFullYear();
  const todayM = String(now.getMonth() + 1).padStart(2, '0');
  const todayD = String(now.getDate()).padStart(2, '0');
  const todayIso = `${todayY}-${todayM}-${todayD}`;

  // If selected date is in the past, all times are past
  if (normalizedDate < todayIso) return true;
  // If selected date is in the future, no times are past
  if (normalizedDate > todayIso) return false;

  // Selected date is today:
  let h24 = Number(hour12);
  if (period === 'PM' && h24 < 12) h24 += 12;
  if (period === 'AM' && h24 === 12) h24 = 0;

  const slotMinutes = h24 * 60 + Number(minute);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return slotMinutes <= currentMinutes;
};

/**
 * Parse an incoming time string (e.g. "14:30" or "02:30 PM") into { hour, minute, period }
 */
export const parseTimeString = (timeStr, defaultToFuture = false, selectedDate = '') => {
  let hr = '10';
  let min = '00';
  let period = 'AM';

  if (timeStr) {
    const norm = normalizeTimeInputValue(timeStr);
    if (norm) {
      const [hStr, mStr] = norm.split(':');
      let hNum = Number(hStr);
      min = mStr.padStart(2, '0');
      if (hNum >= 12) {
        period = 'PM';
        if (hNum > 12) hNum -= 12;
      } else {
        period = 'AM';
        if (hNum === 0) hNum = 12;
      }
      hr = String(hNum).padStart(2, '0');
    }
  } else if (defaultToFuture) {
    // Pick nearest future hour/minute
    const now = new Date();
    const isToday = (() => {
      if (!selectedDate) return false;
      const norm = normalizeDateInputValue(selectedDate);
      const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      return norm === todayIso;
    })();

    if (isToday) {
      const nextDate = new Date(now.getTime() + 15 * 60 * 1000); // 15 mins ahead
      let hNum = nextDate.getHours();
      min = String(nextDate.getMinutes()).padStart(2, '0');
      if (hNum >= 12) {
        period = 'PM';
        if (hNum > 12) hNum -= 12;
      } else {
        period = 'AM';
        if (hNum === 0) hNum = 12;
      }
      hr = String(hNum).padStart(2, '0');
    }
  }

  return { hr, min, period };
};

/**
 * 3-Column Time Picker matching the user design with:
 * - Columns: HR | MIN | A/P
 * - Project Emerald Theme rounded pill highlights
 * - Automatic disabling of past hours, minutes, and periods for today
 * - Right-aligned "Done" button
 */
export const MuiTimePicker = ({
  value = '',
  onChange,
  onDone,
  selectedDate = '',
  disablePastTime = true,
}) => {
  const parsed = useMemo(() => {
    return parseTimeString(value, true, selectedDate);
  }, [value, selectedDate]);

  const [selectedHr, setSelectedHr] = useState(parsed.hr);
  const [selectedMin, setSelectedMin] = useState(parsed.min);
  const [selectedPeriod, setSelectedPeriod] = useState(parsed.period);

  const selectedHourRef = useRef(null);
  const selectedMinRef = useRef(null);

  // Sync state if external value changes
  useEffect(() => {
    setSelectedHr(parsed.hr);
    setSelectedMin(parsed.min);
    setSelectedPeriod(parsed.period);
  }, [parsed]);

  // Auto-scroll selected items into view on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedHourRef.current) {
        selectedHourRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      if (selectedMinRef.current) {
        selectedMinRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const now = useMemo(() => new Date(), []);

  const isToday = useMemo(() => {
    if (!selectedDate) return false;
    const norm = normalizeDateInputValue(selectedDate);
    if (!norm) return false;
    const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    return norm === todayIso;
  }, [selectedDate, now]);

  // Check if AM is completely in the past today (i.e. currently 12:00 PM or later)
  const isAmDisabled = useMemo(() => {
    if (!disablePastTime || !isToday) return false;
    return now.getHours() >= 12;
  }, [disablePastTime, isToday, now]);

  // Check if PM is completely in the past today (i.e. 23:59)
  const isPmDisabled = useMemo(() => {
    if (!disablePastTime || !isToday) return false;
    return now.getHours() >= 23 && now.getMinutes() >= 59;
  }, [disablePastTime, isToday, now]);

  // Check if a specific hour is in the past for the currently selected period
  const isHourDisabled = (hrStr) => {
    if (!disablePastTime || !isToday) return false;

    let h24 = Number(hrStr);
    if (selectedPeriod === 'PM' && h24 < 12) h24 += 12;
    if (selectedPeriod === 'AM' && h24 === 12) h24 = 0;

    const currentHour = now.getHours();

    // If whole hour is earlier than current hour, it's past
    if (h24 < currentHour) return true;
    // If it's the current hour, check if 59th minute has passed
    if (h24 === currentHour && now.getMinutes() >= 59) return true;

    return false;
  };

  // Check if a specific minute is in the past for currently selected hour and period
  const isMinuteDisabled = (minStr) => {
    if (!disablePastTime || !isToday) return false;

    let h24 = Number(selectedHr);
    if (selectedPeriod === 'PM' && h24 < 12) h24 += 12;
    if (selectedPeriod === 'AM' && h24 === 12) h24 = 0;

    const currentHour = now.getHours();

    if (h24 < currentHour) return true;
    if (h24 > currentHour) return false;

    // Current hour: minute must be strictly greater than current minute
    return Number(minStr) <= now.getMinutes();
  };

  // Build the 24-hour time string
  const format24HourTime = (h12, m, p) => {
    let hNum = Number(h12);
    if (p === 'PM' && hNum < 12) hNum += 12;
    if (p === 'AM' && hNum === 12) hNum = 0;
    return `${String(hNum).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Update selection and notify parent
  const handleSelectHour = (hr) => {
    if (isHourDisabled(hr)) return;
    setSelectedHr(hr);

    // If current minute becomes disabled with new hour, find first valid minute
    let nextMin = selectedMin;
    if (disablePastTime && isToday) {
      let h24 = Number(hr);
      if (selectedPeriod === 'PM' && h24 < 12) h24 += 12;
      if (selectedPeriod === 'AM' && h24 === 12) h24 = 0;
      if (h24 === now.getHours() && Number(nextMin) <= now.getMinutes()) {
        const firstValidMin = Math.min(59, now.getMinutes() + 1);
        nextMin = String(firstValidMin).padStart(2, '0');
        setSelectedMin(nextMin);
      }
    }

    const time24 = format24HourTime(hr, nextMin, selectedPeriod);
    onChange?.(time24);
  };

  const handleSelectMinute = (min) => {
    if (isMinuteDisabled(min)) return;
    setSelectedMin(min);
    const time24 = format24HourTime(selectedHr, min, selectedPeriod);
    onChange?.(time24);
  };

  const handleSelectPeriod = (period) => {
    if (period === 'AM' && isAmDisabled) return;
    if (period === 'PM' && isPmDisabled) return;
    setSelectedPeriod(period);

    // If current hour becomes disabled in new period, pick first valid hour
    let nextHr = selectedHr;
    if (disablePastTime && isToday) {
      let h24 = Number(nextHr);
      if (period === 'PM' && h24 < 12) h24 += 12;
      if (period === 'AM' && h24 === 12) h24 = 0;

      if (h24 <= now.getHours()) {
        // Find next valid hour
        for (const h of HOURS) {
          let testH = Number(h);
          if (period === 'PM' && testH < 12) testH += 12;
          if (period === 'AM' && testH === 12) testH = 0;
          if (testH >= now.getHours()) {
            nextHr = h;
            break;
          }
        }
        setSelectedHr(nextHr);
      }
    }

    const time24 = format24HourTime(nextHr, selectedMin, period);
    onChange?.(time24);
  };

  const handleDoneClick = () => {
    const time24 = format24HourTime(selectedHr, selectedMin, selectedPeriod);
    onChange?.(time24);
    onDone?.(time24);
  };

  return (
    <div className='w-64 bg-white rounded-2xl shadow-xl border border-slate-100/90 overflow-hidden flex flex-col select-none'>
      {/* Top Title */}
      <div className='px-4 pt-3.5 pb-2'>
        <h3 className='text-sm font-black text-slate-800 tracking-tight'>
          Select Time
        </h3>
      </div>

      {/* 3 Columns Layout */}
      <div className='grid grid-cols-3 border-t border-slate-100'>
        {/* Column 1: HR */}
        <div className='flex flex-col border-r border-slate-100'>
          <div className='py-2 text-[11px] font-black text-slate-400 text-center tracking-wider border-b border-slate-50'>
            HR
          </div>
          <div className='h-48 overflow-y-auto custom-time-scroll flex flex-col items-center py-1.5 px-1.5 gap-0.5'>
            {HOURS.map((hr) => {
              const isSelected = hr === selectedHr;
              const disabled = isHourDisabled(hr);

              return (
                <button
                  key={hr}
                  ref={isSelected ? selectedHourRef : null}
                  type='button'
                  disabled={disabled}
                  onClick={() => handleSelectHour(hr)}
                  className={`w-full py-1.5 text-center text-xs rounded-xl transition-all ${
                    disabled
                      ? 'text-slate-300 opacity-40 cursor-not-allowed line-through decoration-slate-300 select-none'
                      : isSelected
                        ? 'bg-emerald-50 text-[#059669] font-black border border-emerald-200/90 shadow-2xs cursor-pointer'
                        : 'text-slate-700 hover:bg-slate-100/70 font-semibold cursor-pointer'
                  }`}
                >
                  {hr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: MIN */}
        <div className='flex flex-col border-r border-slate-100'>
          <div className='py-2 text-[11px] font-black text-slate-400 text-center tracking-wider border-b border-slate-50'>
            MIN
          </div>
          <div className='h-48 overflow-y-auto custom-time-scroll flex flex-col items-center py-1.5 px-1.5 gap-0.5'>
            {MINUTES.map((min) => {
              const isSelected = min === selectedMin;
              const disabled = isMinuteDisabled(min);

              return (
                <button
                  key={min}
                  ref={isSelected ? selectedMinRef : null}
                  type='button'
                  disabled={disabled}
                  onClick={() => handleSelectMinute(min)}
                  className={`w-full py-1.5 text-center text-xs rounded-xl transition-all ${
                    disabled
                      ? 'text-slate-300 opacity-40 cursor-not-allowed line-through decoration-slate-300 select-none'
                      : isSelected
                        ? 'bg-emerald-50 text-[#059669] font-black border border-emerald-200/90 shadow-2xs cursor-pointer'
                        : 'text-slate-700 hover:bg-slate-100/70 font-semibold cursor-pointer'
                  }`}
                >
                  {min}
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 3: A/P */}
        <div className='flex flex-col'>
          <div className='py-2 text-[11px] font-black text-slate-400 text-center tracking-wider border-b border-slate-50'>
            A/P
          </div>
          <div className='h-48 flex flex-col items-center justify-start pt-3 gap-2.5 px-2'>
            {/* AM */}
            <button
              type='button'
              disabled={isAmDisabled}
              onClick={() => handleSelectPeriod('AM')}
              className={`w-full py-2 text-center text-xs rounded-xl transition-all ${
                isAmDisabled
                  ? 'text-slate-300 opacity-40 cursor-not-allowed line-through decoration-slate-300 select-none'
                  : selectedPeriod === 'AM'
                    ? 'bg-emerald-50 text-[#059669] font-black border border-emerald-200/90 shadow-2xs cursor-pointer'
                    : 'text-slate-700 hover:bg-slate-100/70 font-semibold cursor-pointer'
              }`}
            >
              AM
            </button>

            {/* PM */}
            <button
              type='button'
              disabled={isPmDisabled}
              onClick={() => handleSelectPeriod('PM')}
              className={`w-full py-2 text-center text-xs rounded-xl transition-all ${
                isPmDisabled
                  ? 'text-slate-300 opacity-40 cursor-not-allowed line-through decoration-slate-300 select-none'
                  : selectedPeriod === 'PM'
                    ? 'bg-emerald-50 text-[#059669] font-black border border-emerald-200/90 shadow-2xs cursor-pointer'
                    : 'text-slate-700 hover:bg-slate-100/70 font-semibold cursor-pointer'
              }`}
            >
              PM
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer with Done Button */}
      <div className='px-4 py-2 border-t border-slate-100 flex items-center justify-end bg-slate-50/50'>
        <button
          type='button'
          onClick={handleDoneClick}
          className='text-[#059669] hover:text-[#047857] hover:bg-emerald-100/60 text-xs font-black px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer tracking-tight'
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default MuiTimePicker;
