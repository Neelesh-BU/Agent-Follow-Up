import React from 'react';

/**
 * High-fidelity Skeleton UI for the Follow-up Dashboard.
 * Matches the layout and dimensions of the Header, KPI Cards, Funnel, Scheduler overview, and Data Table.
 */
export const DashboardSkeleton = ({ isMaster = false }) => {
  return (
    <div className='w-full min-h-full animate-pulse' aria-label='Loading dashboard content...'>
      {/* ── DASHBOARD HEADER SKELETON ───────────────────────────────────────── */}
      <div className='mb-5 sm:mb-7'>
        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4'>
          <div className='flex-1 min-w-0 space-y-2'>
            {/* Greeting */}
            <div className='h-4 w-36 bg-slate-200/80 rounded-md' />
            {/* Page title */}
            <div className='h-8 w-64 bg-slate-300/80 rounded-xl' />
            {/* Date line */}
            <div className='h-3.5 w-44 bg-slate-200/70 rounded-md' />
          </div>

          {/* Action buttons placeholder */}
          <div className='flex items-center gap-2 flex-wrap sm:flex-nowrap'>
            <div className='h-9 w-24 bg-slate-200/80 rounded-xl' />
            {!isMaster && (
              <>
                <div className='h-9 w-36 bg-emerald-100/70 rounded-xl' />
                <div className='h-9 w-24 bg-slate-200/80 rounded-xl' />
                <div className='h-9 w-28 bg-emerald-100/70 rounded-xl' />
              </>
            )}
          </div>
        </div>

        {/* Subtle rule */}
        <div className='h-px bg-slate-200/80' />
      </div>

      {/* ── KPI SUMMARY CARDS SKELETON ──────────────────────────────────────── */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-5 sm:mb-6'>
        {[1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            className='bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between h-[126px]'
          >
            <div className='flex items-start justify-between gap-2'>
              <div className='space-y-1.5'>
                <div className='h-3.5 w-24 bg-slate-200/80 rounded' />
                <div className='h-2.5 w-36 bg-slate-100 rounded' />
              </div>
              <div className='w-8 h-8 rounded-xl bg-slate-200/80 shrink-0' />
            </div>

            <div className='flex items-baseline justify-between mt-auto pt-2 border-t border-slate-100'>
              <div className='h-7 w-16 bg-slate-300/80 rounded-lg' />
              <div className='h-4 w-16 bg-slate-100 rounded-full' />
            </div>
          </div>
        ))}
      </div>

      {/* ── PIPELINE FLOW FUNNEL SKELETON ───────────────────────────────────── */}
      <div className='bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 shadow-xs'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 rounded-full bg-emerald-200/70' />
            <div className='h-4 w-36 bg-slate-200/80 rounded' />
          </div>
          <div className='h-3 w-28 bg-slate-100 rounded' />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3'>
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className='bg-slate-50/80 border border-slate-200/60 rounded-xl p-3.5 space-y-2'
            >
              <div className='flex items-center justify-between'>
                <div className='h-3 w-8 bg-slate-200/80 rounded' />
                <div className='w-6 h-6 rounded-full bg-slate-200/70' />
              </div>
              <div className='h-5 w-14 bg-slate-300/80 rounded' />
              <div className='h-3 w-24 bg-slate-200/70 rounded' />
              <div className='h-1.5 w-full bg-slate-200/70 rounded-full' />
            </div>
          ))}
        </div>
      </div>

      {/* ── SCHEDULER ACCOUNTS OVERVIEW SKELETON (Master only) ───────────────── */}
      {isMaster && (
        <div className='bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-5 sm:mb-6 shadow-xs'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <div className='w-4 h-4 rounded bg-slate-200/80' />
              <div className='h-4 w-48 bg-slate-200/80 rounded' />
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-8 w-32 bg-slate-200/70 rounded-xl' />
              <div className='h-8 w-24 bg-slate-200/70 rounded-xl' />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5'>
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className='bg-slate-50/70 border border-slate-200/60 rounded-xl p-3.5 space-y-3'
              >
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-slate-200/80 shrink-0' />
                  <div className='space-y-1.5 flex-1'>
                    <div className='h-3.5 w-28 bg-slate-200/80 rounded' />
                    <div className='h-2.5 w-36 bg-slate-100 rounded' />
                  </div>
                </div>
                <div className='grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60'>
                  <div className='h-8 bg-slate-200/70 rounded-lg' />
                  <div className='h-8 bg-slate-200/70 rounded-lg' />
                  <div className='h-8 bg-slate-200/70 rounded-lg' />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FOLLOW-UP DATA TABLE SKELETON ───────────────────────────────────── */}
      <section className='mb-6'>
        {/* Section header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 px-0.5'>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 rounded bg-emerald-200/80' />
            <div className='h-4 w-36 bg-slate-200/80 rounded' />
            <div className='h-4 w-12 bg-slate-100 rounded-full' />
          </div>
          <div className='h-8 w-24 bg-slate-200/80 rounded-xl' />
        </div>

        {/* Main table card */}
        <div className='bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs'>
          {/* Tab bar */}
          <div className='border-b border-slate-100 bg-slate-50/60 px-3 sm:px-4 py-2.5 flex items-center gap-2'>
            {[1, 2, 3, 4].map((tab) => (
              <div key={tab} className='h-8 w-28 bg-slate-200/80 rounded-xl' />
            ))}
          </div>

          {/* Table Header */}
          <div className='bg-slate-50/90 border-b border-slate-200/80 px-6 py-3.5 grid grid-cols-6 gap-4'>
            <div className='h-3 w-28 bg-slate-200/80 rounded' />
            <div className='h-3 w-20 bg-slate-200/80 rounded' />
            <div className='h-3 w-28 bg-slate-200/80 rounded' />
            <div className='h-3 w-24 bg-slate-200/80 rounded' />
            <div className='h-3 w-20 bg-slate-200/80 rounded' />
            <div className='h-3 w-16 bg-slate-200/80 rounded ml-auto' />
          </div>

          {/* Table Rows */}
          <div className='divide-y divide-slate-100'>
            {[1, 2, 3, 4, 5, 6, 7].map((row) => (
              <div
                key={row}
                className='px-6 py-4 grid grid-cols-6 gap-4 items-center'
              >
                {/* Candidate Name & phone */}
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-slate-200/80 shrink-0' />
                  <div className='space-y-1.5'>
                    <div className='h-3.5 w-28 bg-slate-200/80 rounded' />
                    <div className='h-2.5 w-20 bg-slate-100 rounded' />
                  </div>
                </div>

                {/* Scheduler */}
                <div className='h-5 w-20 bg-slate-100 rounded-full' />

                {/* Company */}
                <div className='h-3.5 w-32 bg-slate-200/80 rounded' />

                {/* Job / Role */}
                <div className='space-y-1'>
                  <div className='h-3.5 w-24 bg-slate-200/80 rounded' />
                  <div className='h-2.5 w-16 bg-slate-100 rounded' />
                </div>

                {/* Status pill */}
                <div className='h-5 w-24 bg-slate-200/70 rounded-full' />

                {/* Action buttons */}
                <div className='flex items-center justify-end gap-2'>
                  <div className='h-7 w-16 bg-emerald-100/70 rounded-lg' />
                  <div className='h-7 w-12 bg-slate-100 rounded-lg' />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination bar */}
          <div className='border-t border-slate-100 px-6 py-3 flex items-center justify-between'>
            <div className='h-3.5 w-36 bg-slate-200/80 rounded' />
            <div className='flex items-center gap-1.5'>
              <div className='h-8 w-8 bg-slate-100 rounded-lg' />
              <div className='h-8 w-8 bg-emerald-100/70 rounded-lg' />
              <div className='h-8 w-8 bg-slate-100 rounded-lg' />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardSkeleton;
