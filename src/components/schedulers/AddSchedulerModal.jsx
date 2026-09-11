import { useState } from "react";
import { useTranslation } from "react-i18next";

export const AddSchedulerModal = ({
  isOpen = false,
  onClose,
  onAdd,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [countryCode] = useState("+91");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePhoneChange = (e) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phoneNumber: digitsOnly }));
  };

  const isPhoneValid = formData.phoneNumber.length === 10;
  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    isPhoneValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPhoneValid) return;

    setIsSubmitting(true);
    const cleanedNumber = (formData.phoneNumber || "")
      .replace(/^\+91\s*/, "")
      .trim();
    const fullPhone = cleanedNumber ? `${countryCode} ${cleanedNumber}` : "";

    const submitFn = onAdd || onSubmit;
    try {
      if (submitFn) {
        await submitFn({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: fullPhone,
          role: 2,
        });
      }
      setFormData({ name: "", email: "", phoneNumber: "" });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <strong className="text-base font-extrabold text-slate-900">
            {t("schedulers.addSchedulerModalTitle")}
          </strong>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 transition-colors font-bold text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              {t("schedulers.schedulerName")} *
            </label>
            <input
              type="text"
              required
              placeholder={t("schedulers.schedulerNamePlaceholder")}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-10 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-[#10b981]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              {t("schedulers.schedulerEmail")} *
            </label>
            <input
              type="email"
              required
              placeholder={t("schedulers.schedulerEmailPlaceholder")}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="h-10 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-[#10b981]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5 col-span-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                {t("schedulers.countryCode")}
              </label>
              <input
                type="text"
                disabled
                value={countryCode}
                className="h-10 px-3 border border-slate-200 bg-slate-50 rounded-lg text-xs font-semibold text-slate-500 cursor-not-allowed outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5 col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {t("schedulers.schedulerPhone")} *
                </label>
                {formData.phoneNumber.length > 0 &&
                  formData.phoneNumber.length < 10 && (
                    <span className="text-[10px] text-amber-600 font-bold">
                      {formData.phoneNumber.length}/10 digits
                    </span>
                  )}
              </div>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder={t("schedulers.schedulerPhonePlaceholder", {
                  defaultValue: "9876543210",
                })}
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                className={`h-10 px-3 border rounded-lg text-xs font-semibold text-slate-800 outline-none transition-colors ${
                  formData.phoneNumber.length > 0 &&
                  formData.phoneNumber.length < 10
                    ? "border-amber-400 focus:border-amber-500"
                    : "border-slate-300 focus:border-[#10b981]"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-xs transition-colors cursor-pointer"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="px-5 py-2.5 bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs shadow-md shadow-[#10b981]/25 transition-all cursor-pointer"
            >
              {isSubmitting ? t("common.submitting") : t("schedulers.addUser")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchedulerModal;
