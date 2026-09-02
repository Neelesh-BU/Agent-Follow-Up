import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import DateTimePickerField from "@/components/common/DateTimePickerField";
import SelectDropdown from "@/components/common/SelectDropdown";
import { displayDate, normalizeTimeInputValue } from "@/utils/formatters";
import {
  buildInterviewPayload,
  buildReschedulePayload,
} from "@/lib/api/interviews/interviews.payload";
import { useSchedulersQuery } from "@/hooks/queries/useSchedulerQueries";
import { useCompaniesQuery, useJobsQuery } from "@/hooks/queries/useJobQueries";
import { useViewRecordQuery } from "@/hooks/queries/useDashboardQuery";

export const FollowUpDetailModal = ({
  isOpen = false,
  onClose,
  onSave,
  onDelete,
  initialData = null,
  schedulers = [],
  isMaster = false,
  isLoading: externalLoading = false,
}) => {
  const { t } = useTranslation();

  // Query schedulers as reliable fallback if props are empty
  const { data: schedulersQueryData } = useSchedulersQuery({
    enabled: Boolean(isMaster && isOpen),
  });

  const availableSchedulers = useMemo(() => {
    if (schedulers && schedulers.length > 0) return schedulers;
    if (
      schedulersQueryData?.schedulers &&
      schedulersQueryData.schedulers.length > 0
    ) {
      return schedulersQueryData.schedulers;
    }
    return [];
  }, [schedulers, schedulersQueryData?.schedulers]);

  const schedulerOptions = useMemo(() => {
    return availableSchedulers.map((sch) => {
      const id = sch.id || sch._id || sch.user_id || "";
      const name = sch.name || sch.full_name || sch.username || "Scheduler";
      const email = sch.email || sch.emailId || "";
      return {
        value: id,
        name: name,
        label: name,
        subLabel: email,
        email: email,
      };
    });
  }, [availableSchedulers]);

  const recordId = initialData?.id || initialData?.record_id || "";

  // Query single record details from view-record API by passing id
  const { data: viewRecordResponse } = useViewRecordQuery(
    recordId,
    { enabled: Boolean(isOpen && recordId) }
  );

  const activeRecord = useMemo(() => {
    if (viewRecordResponse?.data) {
      return {
        ...viewRecordResponse.data,
        id: recordId || viewRecordResponse.data.id || viewRecordResponse.data.record_id,
        record_id: recordId || viewRecordResponse.data.record_id || viewRecordResponse.data.id,
      };
    }
    return initialData;
  }, [viewRecordResponse, initialData, recordId]);

  const isEditing = Boolean(recordId);
  const rawCallResponse = String(
    initialData?.candidateCallResponseType ||
      initialData?.candidate_call_response_type ||
      initialData?.call_response_type ||
      initialData?.candidate_respond_type ||
      initialData?.response ||
      activeRecord?.candidateCallResponseType ||
      activeRecord?.candidate_call_response_type ||
      activeRecord?.call_response_type ||
      activeRecord?.candidate_respond_type ||
      activeRecord?.response ||
      "",
  )
    .toLowerCase()
    .trim();

  const isRescheduleRequested = [
    "reschedule requested",
    "reschedule_requested",
    "reschedule",
  ].includes(rawCallResponse);

  // If opening an existing record, editing is enabled ONLY for the Reschedule button.
  // When opened via View, isReadOnly is TRUE (all fields disabled, no save button).
  const isReadOnly = isEditing && !isRescheduleRequested;
  const isComplete = isReadOnly;

  // Only allow Today and following 2 days (3 days total window), and disable all past dates
  const { minDateIso, maxDateIso } = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const minIso = `${y}-${m}-${d}`;

    const maxFuture = new Date(today);
    maxFuture.setDate(today.getDate() + 2);
    const maxY = maxFuture.getFullYear();
    const maxM = String(maxFuture.getMonth() + 1).padStart(2, "0");
    const maxD = String(maxFuture.getDate()).padStart(2, "0");
    const maxIso = `${maxY}-${maxM}-${maxD}`;

    return { minDateIso: minIso, maxDateIso: maxIso };
  }, [isOpen]);

  const [formData, setFormData] = useState({
    candidate_name: "",
    phone: "",
    email: "",
    interview_company: "",
    interview_date: "",
    interview_time: "",
    role: "",
    scheduler_id: "",
    status: "pending",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isLoading = isSubmitting || externalLoading;

  const [errors, setErrors] = useState({});

  const handlePhoneChange = (e) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digitsOnly }));
  };

  const { data: companiesResponse } = useCompaniesQuery();
  const companyOptions = useMemo(() => {
    return (companiesResponse?.data || []).map((c) => ({
      value: c.company_id,
      label: c.company_name,
      name: c.company_name,
    }));
  }, [companiesResponse]);

  const currentCompanyId = useMemo(() => {
    const exactMatch = companyOptions.find(
      (c) => c.value === formData.interview_company,
    );
    if (exactMatch) return exactMatch.value;
    const nameMatch = companyOptions.find(
      (c) => c.label === formData.interview_company,
    );
    if (nameMatch) return nameMatch.value;
    return formData.interview_company;
  }, [formData.interview_company, companyOptions]);

  const { data: jobsResponse } = useJobsQuery(
    { company_id: currentCompanyId },
    { enabled: !!currentCompanyId },
  );

  const jobOptions = useMemo(() => {
    return (jobsResponse?.data || []).map((j) => ({
      value: String(j.job_id), // Storing job_id for the backend
      label: `${j.job_id}-${j.job_title}`,
      name: j.job_title,
    }));
  }, [jobsResponse]);

  useEffect(() => {
    const matchedScheduler = schedulerOptions.find(
      (s) =>
        (activeRecord?.scheduler_email &&
          s.email?.toLowerCase() === activeRecord.scheduler_email.toLowerCase()) ||
        (activeRecord?.scheduler_name &&
          s.name?.toLowerCase() === activeRecord.scheduler_name.toLowerCase()) ||
        s.value === activeRecord?.scheduler_id
    );

    const defaultSchedulerId =
      matchedScheduler?.value ||
      activeRecord?.scheduler_id ||
      initialData?.scheduler_id ||
      schedulers[0]?.id ||
      schedulerOptions[0]?.value ||
      "";

    if (activeRecord) {
      const rawPhone = String(
        activeRecord.candidate_phone ||
        activeRecord.phone ||
        activeRecord.phone_number ||
        "",
      );
      const cleanedInitialPhone = rawPhone
        .replace(/^\+91\s*/, "")
        .replace(/\D/g, "")
        .slice(0, 10);

      const parsedDate = activeRecord.interview_date
        ? displayDate(activeRecord.interview_date)
        : "";

      const rawTime = activeRecord.interview_time || "";
      const parsedTime = rawTime
        ? (normalizeTimeInputValue(rawTime) || rawTime)
        : "";

      setFormData({
        candidate_name: activeRecord.candidate_name || "",
        phone: cleanedInitialPhone,
        email: activeRecord.candidate_email || activeRecord.email || "",
        interview_company:
          activeRecord.interview_company || activeRecord.company_name || "",
        interview_date: parsedDate,
        interview_time: parsedTime,
        role: String(activeRecord.job_title || activeRecord.job_id || activeRecord.role || ""),
        scheduler_id: defaultSchedulerId,
        status: activeRecord.status || activeRecord.call_pipeline || "pending",
        notes: activeRecord.notes || "",
      });
    } else {
      setFormData({
        candidate_name: "",
        phone: "",
        email: "",
        interview_company: "",
        interview_date: "",
        interview_time: "",
        role: "",
        scheduler_id: defaultSchedulerId,
        status: "pending",
        notes: "",
      });
    }
    setErrors({});
    setIsSubmitting(false);
  }, [activeRecord, initialData, schedulers, schedulerOptions, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setErrors({});

    const newErrors = {};
    if (!formData.interview_company) newErrors.interview_company = true;
    if (!formData.role) newErrors.role = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Let the native form validation handle text inputs, but for custom dropdowns we alert if they are empty
      alert(
        t("modals.requiredFieldsError", {
          defaultValue: "Please fill in all required fields.",
        }),
      );
      return;
    }

    if (formData.phone && formData.phone.length !== 10) {
      alert(
        t("modals.invalidPhoneError", {
          defaultValue: "Phone number must be exactly 10 digits.",
        }),
      );
      return;
    }

    if (formData.interview_date === displayDate(minDateIso)) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const timeStr = formData.interview_time || "00:00";
      const [hours, mins] = timeStr.split(":").map(Number);
      const selectedMinutes = hours * 60 + (mins || 0);

      if (selectedMinutes <= currentMinutes) {
        alert(
          t("modals.pastTimeError", {
            defaultValue: "Interview time cannot be in the past.",
          }),
        );
        return;
      }
    }

    const company = companyOptions.find((c) => c.value === currentCompanyId);
    const job = jobOptions.find(
      (j) =>
        j.value === formData.role ||
        j.label === formData.role ||
        j.name === formData.role,
    );

    if (formData.role && !job) {
      alert(
        t("modals.invalidJobError", {
          defaultValue: "Please select a valid Job Title from the dropdown.",
        }),
      );
      return;
    }

    const cleanedPhone = (formData.phone || "").replace(/\D/g, "").slice(0, 10);
    const fullPhone = cleanedPhone ? `+91 ${cleanedPhone}` : "";

    const effectiveId =
      recordId ||
      activeRecord?.id ||
      activeRecord?.record_id ||
      initialData?.id ||
      initialData?.record_id ||
      "";

    const payloadData = {
      ...formData,
      id: effectiveId,
      record_id: effectiveId,
      phone: fullPhone,
      phone_number: fullPhone,
      company_name: company ? company.label : formData.interview_company,
      job_id: job ? job.value : "",
      job_title: job ? job.name : formData.role,
    };

    const payload = isRescheduleRequested
      ? buildReschedulePayload(payloadData, { isMaster })
      : buildInterviewPayload(payloadData, { isMaster });

    try {
      setIsSubmitting(true);
      await onSave(payload, effectiveId, {
        isReschedule: isRescheduleRequested,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150 custom-scrollbar">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 rounded-t-2xl border-b border-slate-100 bg-slate-50/50">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                {isEditing
                  ? isRescheduleRequested
                    ? t("modals.rescheduleFollowUp", {
                        defaultValue: "Reschedule Follow Up",
                      })
                    : t("modals.viewFollowUp", {
                        defaultValue: "Follow Up Details",
                      })
                  : t("modals.addFollowUp")}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isReadOnly
                  ? t("modals.completedRecordNotice", {
                      defaultValue: "This record is view-only.",
                    })
                  : isRescheduleRequested
                    ? t("modals.rescheduleNotice", {
                        defaultValue:
                          "Update interview date and time to reschedule the candidate.",
                      })
                    : t("modals.fillDetailsNotice")}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 disabled:opacity-50 transition-colors font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Master: Scheduler selection (Dropdown above the form) */}
              {isMaster && (
                <div className="col-span-full flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {t("modals.scheduler", { defaultValue: "Scheduler" })}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <SelectDropdown
                    value={formData.scheduler_id}
                    onChange={(val) =>
                      setFormData({ ...formData, scheduler_id: val })
                    }
                    options={schedulerOptions}
                    placeholder={t("modals.chooseScheduler", {
                      defaultValue: "-- Select Scheduler --",
                    })}
                    disabled={isComplete}
                    variant="form"
                    className="w-full"
                  />
                </div>
              )}

              {/* Candidate Name */}
              <div className="flex flex-col gap-1.5 col-span-full">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {t("modals.candidateName", {
                    defaultValue: "Candidate Name",
                  })}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isComplete}
                  placeholder={t("modals.candidateNamePlaceholder", {
                    defaultValue: "e.g. Rahul Sharma",
                  })}
                  value={formData.candidate_name}
                  onChange={(e) =>
                    setFormData({ ...formData, candidate_name: e.target.value })
                  }
                  className="h-9 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-[#007cc2]"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {t("modals.email", { defaultValue: "Email Address" })}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  disabled={isComplete}
                  placeholder={t("modals.emailPlaceholder", {
                    defaultValue: "candidate@example.com",
                  })}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-9 px-3 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-[#007cc2]"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    {t("modals.phone", { defaultValue: "Phone Number" })}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  {formData.phone.length > 0 && formData.phone.length < 10 && (
                    <span className="text-[10px] text-amber-600 font-bold">
                      {formData.phone.length}/10 digits
                    </span>
                  )}
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  disabled={isComplete}
                  placeholder={t("modals.phonePlaceholder", {
                    defaultValue: "9876543210",
                  })}
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`h-9 px-3 border rounded-lg text-xs font-semibold text-slate-800 outline-none transition-colors ${
                    formData.phone.length > 0 && formData.phone.length < 10
                      ? "border-amber-400 focus:border-amber-500"
                      : "border-slate-300 focus:border-[#007cc2]"
                  } ${isComplete ? "bg-slate-50 cursor-not-allowed text-slate-500" : ""}`}
                />
              </div>

              {/* Interview Company */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {t("modals.interviewCompany", {
                    defaultValue: "Interview Company",
                  })}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                  value={formData.interview_company}
                  onChange={(val) => {
                    setFormData({
                      ...formData,
                      interview_company: val,
                      role: "",
                    });
                    setErrors((prev) => ({
                      ...prev,
                      interview_company: false,
                      role: false,
                    }));
                  }}
                  options={companyOptions}
                  placeholder={t("modals.interviewCompanyPlaceholder", {
                    defaultValue: "-- Select Company --",
                  })}
                  disabled={isComplete}
                  variant="form"
                  className="w-full"
                  isSearchable={true}
                  error={errors.interview_company}
                />
              </div>

              {/* Job Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {t("modals.jobTitle", { defaultValue: "Job Role" })}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <SelectDropdown
                  value={formData.role}
                  onChange={(val) => {
                    setFormData({ ...formData, role: val });
                    setErrors((prev) => ({ ...prev, role: false }));
                  }}
                  options={jobOptions}
                  placeholder={t("modals.jobTitlePlaceholder", {
                    defaultValue: "-- Select Job Title --",
                  })}
                  disabled={isComplete || !formData.interview_company}
                  variant="form"
                  className="w-full"
                  isSearchable={true}
                  error={errors.role}
                />
              </div>

              {/* Interview Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {t("modals.interviewDate", {
                    defaultValue: "Interview Date",
                  })}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <DateTimePickerField
                  type="date"
                  required
                  disabled={isComplete}
                  minDate={minDateIso}
                  maxDate={maxDateIso}
                  value={formData.interview_date}
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      interview_date: val,
                      interview_time: "",
                    })
                  }
                />
              </div>

              {/* Interview Time */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {t("modals.interviewTime", {
                    defaultValue: "Interview Time",
                  })}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <DateTimePickerField
                  type="time"
                  required
                  disabled={isComplete || !formData.interview_date}
                  disablePastTime={
                    formData.interview_date === displayDate(minDateIso)
                  }
                  value={formData.interview_time}
                  onChange={(val) =>
                    setFormData({ ...formData, interview_time: val })
                  }
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-200">
              {isEditing && isMaster && !isComplete && (
                <button
                  type="button"
                  onClick={() => onDelete(activeRecord || initialData)}
                  disabled={isLoading}
                  className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-50 rounded-lg font-bold text-xs mr-auto transition-colors cursor-pointer"
                >
                  {t("common.delete", { defaultValue: "Delete" })}
                </button>
              )}

              {isReadOnly ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                >
                  {t("common.close", { defaultValue: "Close" })}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-100 disabled:opacity-50 text-slate-700 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                  >
                    {t("common.cancel", { defaultValue: "Cancel" })}
                  </button>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2 bg-[#007cc2] hover:bg-[#006ca9] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-bold text-xs shadow-md transition-colors cursor-pointer inline-flex items-center justify-center gap-2 min-w-[75px]"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>
                          {isRescheduleRequested
                            ? t("common.rescheduling", {
                                defaultValue: "Rescheduling...",
                              })
                            : t("common.saving", { defaultValue: "Saving..." })}
                        </span>
                      </>
                    ) : (
                      <span>
                        {isRescheduleRequested
                          ? t("common.reschedule", { defaultValue: "Reschedule" })
                          : t("common.save", { defaultValue: "Save" })}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FollowUpDetailModal;
