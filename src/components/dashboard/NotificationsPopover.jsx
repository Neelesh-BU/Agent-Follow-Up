import { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

export const NotificationsPopover = ({
  isOpen = false,
  onToggle,
  onClose,
  count = 0,
  onActionClick,
}) => {
  const { t } = useTranslation();
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const message =
    count === 1
      ? t("notifications.singleAttention")
      : count > 1
        ? t("notifications.multipleAttention", { count })
        : t("notifications.noAttention");

  return (
    <div ref={wrapRef} className="relative flex items-center">
      <button
        type="button"
        aria-label={t("notifications.title")}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-[#059669] transition-colors cursor-pointer"
      >
        <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center leading-none shadow-xs">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-slate-900 tracking-tight">
              {t("notifications.title")}
            </h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
              {count}
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-3 font-medium leading-relaxed">
            {message}
          </p>
          <button
            type="button"
            disabled={count === 0}
            onClick={() => {
              onClose();
              if (count > 0) onActionClick();
            }}
            className="w-full py-2.5 px-3 bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-[#10b981]/20"
          >
            {count === 0
              ? t("notifications.noActionNeeded")
              : t("notifications.viewNeedsAttention")}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopover;
