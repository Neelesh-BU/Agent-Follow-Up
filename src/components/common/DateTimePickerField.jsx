import { useState, useRef } from "react";
import Popover from "@mui/material/Popover";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MuiCalendar from "./MuiCalendar";
import MuiTimePicker, { isTimePast } from "./MuiTimePicker";
import {
  displayDate,
  displayTime,
} from "@/utils/formatters";

export { isTimePast };

/**
 * Custom DateTimePickerField using Material-UI Popover, MuiCalendar, and MuiTimePicker
 * Completely replaces native browser date/time popups with styled MUI pickers matching the project theme.
 */
export const DateTimePickerField = ({
  id,
  type = "date", // 'date' | 'time'
  value = "",
  onChange,
  placeholder,
  disabled = false,
  required = false,
  readOnly = false,
  minDate,
  maxDate,
  selectedDate = "",
  disablePastTime = true,
  error = false,
  className = "",
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
      onChange?.("");
    } else {
      onChange?.(displayDate(isoDate));
    }
    handleClose();
  };

  const formattedDisplayValue =
    type === "date" ? (value ? displayDate(value) : "") : (value ? displayTime(value) : "");

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center border rounded-lg overflow-hidden bg-white transition-all ${
        disabled
          ? "opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed"
          : error
            ? "border-rose-400 ring-2 ring-rose-100"
            : isOpen
              ? "border-[#10b981] ring-2 ring-[#10b981]/15"
              : "border-slate-300 hover:border-slate-400"
      } ${className}`}
    >
      <input
        id={id}
        type="text"
        placeholder={placeholder || (type === "date" ? "DD-MM-YYYY" : "HH:MM")}
        value={formattedDisplayValue}
        onChange={(e) => onChange?.(e.target.value)}
        onClick={handleOpen}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        className="w-full h-9 px-3 border-0 outline-none text-slate-800 text-xs font-semibold bg-transparent cursor-pointer"
      />

      <button
        type="button"
        aria-label={type === "date" ? "Open calendar" : "Open time picker"}
        onClick={handleOpen}
        disabled={disabled || readOnly}
        className="w-9 h-9 flex items-center justify-center border-l border-slate-200 bg-slate-50 hover:bg-slate-100 text-[#059669] disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
      >
        {type === "date" ? (
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
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              borderRadius: "16px",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(226, 232, 240, 0.9)",
              overflow: "hidden",
            },
          },
        }}
      >
        {type === "date" ? (
          <MuiCalendar
            mode="single"
            value={value}
            minDate={minDate}
            maxDate={maxDate}
            onChange={handleDateSelect}
            onClose={handleClose}
          />
        ) : (
          <MuiTimePicker
            value={value}
            onChange={onChange}
            onDone={handleClose}
            selectedDate={selectedDate}
            disablePastTime={disablePastTime}
          />
        )}
      </Popover>
    </div>
  );
};

export default DateTimePickerField;
