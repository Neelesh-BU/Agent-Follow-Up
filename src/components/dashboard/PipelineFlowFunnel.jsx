import { useState } from "react";
import { useTranslation } from "react-i18next";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import SkipNextOutlinedIcon from "@mui/icons-material/SkipNextOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";

export const PipelineFlowFunnel = ({ counts = {} }) => {
  const { t } = useTranslation();
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const total = Math.max(1, counts.uploaded || 0);

  const stageDefinitions = [
    {
      id: "uploaded",
      step: "01",
      label: t("pipelineStages.totalFollowUps", { defaultValue: "Total" }),
      labelFull: t("pipelineStages.totalFollowUpsFull"),
      meta: t("pipelineStages.totalFollowUpsMeta"),
      description: t("pipelineStages.totalFollowUpsDescription"),
      gradient: "from-blue-600 to-blue-400",
      bgLight: "bg-blue-50",
      badgeBg: "bg-blue-100/80 text-blue-700",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      icon: CloudUploadOutlinedIcon,
      countKey: "uploaded",
    },
    {
      id: "followup_initiated",
      step: "02",
      label: t("pipelineStages.followup_initiated_short"),
      labelFull: t("pipelineStages.followup_initiated"),
      meta: t("pipelineStages.followup_initiatedMeta"),
      description: t("pipelineStages.followup_initiatedDescription"),
      gradient: "from-sky-500 to-sky-300",
      bgLight: "bg-sky-50",
      badgeBg: "bg-sky-100/80 text-sky-700",
      textColor: "text-sky-600",
      borderColor: "border-sky-200",
      icon: PlayCircleOutlinedIcon,
      countKey: "followup_initiated",
    },
    {
      id: "followup_completed",
      step: "03",
      label: t("pipelineStages.followup_completed_short"),
      labelFull: t("pipelineStages.followup_completed"),
      meta: t("pipelineStages.followup_completedMeta"),
      description: t("pipelineStages.followup_completedDescription"),
      gradient: "from-amber-500 to-amber-300",
      bgLight: "bg-amber-50",
      badgeBg: "bg-amber-100/80 text-amber-700",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
      icon: CheckCircleOutlinedIcon,
      countKey: "followup_completed",
    },
    {
      id: "call_skipped",
      step: "04",
      label: t("pipelineStages.call_skipped_short"),
      labelFull: t("pipelineStages.call_skipped"),
      meta: t("pipelineStages.call_skippedMeta"),
      description: t("pipelineStages.call_skippedDescription"),
      gradient: "from-rose-500 to-rose-300",
      bgLight: "bg-rose-50",
      badgeBg: "bg-rose-100/80 text-rose-700",
      textColor: "text-rose-600",
      borderColor: "border-rose-200",
      icon: SkipNextOutlinedIcon,
      countKey: "call_skipped",
    },
    {
      id: "joining_confirmed",
      step: "05",
      label: t("pipelineStages.joining_confirmed_short"),
      labelFull: t("pipelineStages.joining_confirmed"),
      meta: t("pipelineStages.joining_confirmedMeta"),
      description: t("pipelineStages.joining_confirmedDescription"),
      gradient: "from-emerald-500 to-emerald-400",
      bgLight: "bg-emerald-50",
      badgeBg: "bg-emerald-100/80 text-emerald-700",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      icon: HandshakeOutlinedIcon,
      countKey: "joining_confirmed",
    },
  ];

  const stages = stageDefinitions.map((stage) => {
    const count = counts[stage.countKey] || 0;
    const percent = Math.round((count / total) * 100);
    const formattedCount = count.toLocaleString("en-IN");
    return { ...stage, count, formattedCount, percent };
  });

  return (
    <section className="mb-4 sm:mb-8">
      {/* ── UNIFIED FUNNEL CONTAINER ── */}
      <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        {/* Section Header Inside Funnel Card */}
        <div className="flex items-center justify-between gap-2 mb-3 sm:mb-6">
          <div>
            <h2 className="text-[14px] sm:text-[17px] font-bold text-slate-900 tracking-normal">
              {t("dashboard.pipelineFlowHeading", {
                defaultValue: "Call Follow-up Funnel",
              })}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 hidden sm:block">
              {t("dashboard.pipelineFlowSubheading", {
                defaultValue: "Stage-wise movement of candidates",
              })}
            </p>
          </div>
        </div>

        {/* ── MOBILE: Horizontal scrollable compact bar ── */}
        <div className="sm:hidden pt-1">
          <div className="flex items-center gap-0 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div key={stage.id} className="flex items-center shrink-0">
                  {/* Stage pill */}
                  <div
                    onClick={() => setIsGuideOpen(true)}
                    className={`flex flex-col items-center px-3 py-2.5 rounded-xl border ${stage.borderColor} ${stage.bgLight} min-w-20 cursor-pointer active:scale-95 transition-transform`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full bg-linear-to-br ${stage.gradient} text-white flex items-center justify-center shadow-sm mb-1.5`}
                    >
                      <Icon sx={{ fontSize: 14 }} />
                    </div>
                    <span
                      className={`font-black leading-none ${stage.textColor} ${
                        stage.formattedCount.length > 7
                          ? "text-[12px]"
                          : stage.formattedCount.length > 5
                            ? "text-[13px]"
                            : "text-[18px]"
                      }`}
                    >
                      {stage.formattedCount}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 mt-0.5 text-center leading-tight">
                      {stage.label}
                    </span>
                    {idx !== 0 && (
                      <span
                        className={`text-[9px] font-extrabold mt-0.5 ${stage.textColor}`}
                      >
                        {stage.percent}%
                      </span>
                    )}
                  </div>
                  {/* Arrow between stages */}
                  {idx < stages.length - 1 && (
                    <div className="text-slate-300 mx-0.5">
                      <KeyboardArrowRightIcon sx={{ fontSize: 16 }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── DESKTOP: Funnel graphic ── */}
        <div className="hidden sm:block relative pt-6 pb-2">
          {/* Horizontal Track */}
          <div className="absolute top-14 left-[10%] right-[10%] h-2.5 bg-slate-100 rounded-full" />
          {/* Animated gradient fill */}
          <div
            className="absolute top-14 left-[10%] right-[10%] h-2.5 rounded-full bg-linear-to-r from-blue-500 via-sky-400 to-emerald-400"
            style={{
              backgroundSize: "200% 100%",
              animation: "pipelineFlow 3s linear infinite",
            }}
          />

          <style>{`
            @keyframes pipelineFlow {
              0% { background-position: 100% 0; }
              100% { background-position: -100% 0; }
            }
            @keyframes nodePulse {
              0% { box-shadow: 0 0 0 0 rgba(0, 124, 194, 0.4); }
              70% { box-shadow: 0 0 0 10px rgba(0, 124, 194, 0); }
              100% { box-shadow: 0 0 0 0 rgba(0, 124, 194, 0); }
            }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>

          <div className="relative z-10 flex justify-between items-start">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.id}
                  className="flex-1 flex flex-col items-center text-center group"
                >
                  <Tooltip
                    title={
                      <div className="p-1">
                        <p className="font-bold text-xs mb-1 text-slate-800 text-center">
                          {stage.labelFull}
                        </p>
                        <p className="text-[11px] text-slate-600 leading-snug">
                          {stage.description}
                        </p>
                      </div>
                    }
                    arrow
                    placement="top"
                    slotProps={{
                      tooltip: {
                        sx: {
                          bgcolor: "#ffffff",
                          color: "#1e293b",
                          boxShadow:
                            "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06)",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          p: 1.5,
                          maxWidth: 240,
                        },
                      },
                      arrow: {
                        sx: {
                          color: "#ffffff",
                          "&::before": {
                            border: "1px solid #e2e8f0",
                          },
                        },
                      },
                    }}
                  >
                    <div
                      onClick={() => setIsGuideOpen(true)}
                      className="relative cursor-pointer mb-5"
                    >
                      <div className="absolute -inset-2 rounded-full bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div
                        className="relative w-20 h-20 rounded-full bg-white shadow-[0_8px_24px_rgb(0,0,0,0.12)] border-[5px] border-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 z-10"
                        style={{
                          animation:
                            idx === 1 ? "nodePulse 2s infinite" : "none",
                        }}
                      >
                        <div
                          className={`absolute inset-0 rounded-full bg-linear-to-br ${stage.gradient} opacity-10`}
                        />
                        <div className="flex flex-col items-center justify-center">
                          <span
                            className={`font-black leading-none bg-linear-to-br ${stage.gradient} bg-clip-text text-transparent ${
                              stage.formattedCount.length > 7
                                ? "text-[13px]"
                                : stage.formattedCount.length > 5
                                  ? "text-[16px]"
                                  : stage.formattedCount.length > 3
                                    ? "text-[20px]"
                                    : "text-[28px]"
                            }`}
                          >
                            {stage.formattedCount}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`absolute -top-1 -right-1 w-7 h-7 rounded-full bg-linear-to-br ${stage.gradient} text-white shadow-md flex items-center justify-center border-2 border-white z-20`}
                      >
                        <Icon sx={{ fontSize: 14 }} />
                      </div>
                    </div>
                  </Tooltip>

                  <div className="px-2">
                    <h3 className="text-[14px] font-bold text-slate-800 leading-tight mb-1">
                      {stage.labelFull}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-35 mx-auto min-h-8.5">
                      {stage.meta}
                    </p>
                  </div>

                  <div className="mt-3">
                    {stage.id !== "uploaded" ? (
                      <span
                        className={`inline-block text-[13px] font-extrabold bg-linear-to-br ${stage.gradient} bg-clip-text text-transparent bg-slate-50 border border-slate-100 px-3 py-1 rounded-full shadow-2xs`}
                      >
                        {stage.percent}%
                      </span>
                    ) : (
                      <span className="inline-block text-[12px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                        100% Volume
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Guide Modal / Dialog ── */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#007cc2]/10 text-[#007cc2] flex items-center justify-center shadow-inner">
                  <InfoOutlinedIcon sx={{ fontSize: 22 }} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Call Follow-up Funnel Guide
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Understand what each funnel metric and stage represents
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content - 5 Step Cards */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-3 bg-slate-50/40">
              {stageDefinitions.map((stage) => {
                const Icon = stage.icon;
                return (
                  <div
                    key={stage.id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-start gap-4"
                  >
                    {/* Stage Step Icon Badge */}
                    <div
                      className={`w-10 h-10 rounded-xl bg-linear-to-br ${stage.gradient} text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5`}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </div>

                    {/* Stage Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${stage.badgeBg}`}
                        >
                          Stage {stage.step}
                        </span>
                        <h4 className="text-sm font-black text-slate-800 tracking-tight">
                          {stage.labelFull}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="px-5 py-2.5 bg-[#007cc2] hover:bg-[#006ca9] text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PipelineFlowFunnel;
