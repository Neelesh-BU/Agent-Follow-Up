/**
 * High-fidelity Skeleton UI for the Scheduler Accounts Management Page.
 * Matches the layout and dimensions of the Header, Add User action, and Data Table.
 */
export const SchedulerAccountsSkeleton = () => {
  return (
    <div
      className='max-w-6xl mx-auto flex flex-col gap-5 animate-pulse'
      aria-label='Loading scheduler accounts...'
    >
      {/* ── HEADER SKELETON ─────────────────────────────────────────────────── */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='space-y-2'>
          {/* Title */}
          <div className='h-7 w-56 bg-slate-300/80 rounded-lg' />
          {/* Subtitle */}
          <div className='h-3.5 w-96 max-w-full bg-slate-200/70 rounded-md' />
        </div>

        {/* Add User Button */}
        <div className='h-10 w-32 bg-emerald-100/70 rounded-xl shrink-0' />
      </div>

      {/* ── MAIN TABLE CARD SKELETON ────────────────────────────────────────── */}
      <div className='bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs overflow-hidden'>
        {/* Table Header */}
        <div className='bg-slate-50/90 border-b border-slate-200/80 px-4 py-3.5 grid grid-cols-12 gap-3 items-center'>
          <div className='col-span-1 h-3 w-8 bg-slate-200/80 rounded' />
          <div className='col-span-2 h-3 w-24 bg-slate-200/80 rounded hidden sm:block' />
          <div className='col-span-3 sm:col-span-2 h-3 w-20 bg-slate-200/80 rounded' />
          <div className='col-span-3 sm:col-span-2 h-3 w-24 bg-slate-200/80 rounded' />
          <div className='col-span-2 h-3 w-20 bg-slate-200/80 rounded hidden md:block' />
          <div className='col-span-2 sm:col-span-1 h-3 w-14 bg-slate-200/80 rounded' />
          <div className='col-span-3 sm:col-span-2 h-3 w-16 bg-slate-200/80 rounded ml-auto' />
        </div>

        {/* Table Rows */}
        <div className='divide-y divide-slate-100'>
          {[1, 2, 3, 4, 5, 6, 7].map((row) => (
            <div
              key={row}
              className='px-4 py-3.5 grid grid-cols-12 gap-3 items-center'
            >
              {/* SL NO */}
              <div className='col-span-1'>
                <div className='h-3.5 w-6 bg-slate-200/80 rounded' />
              </div>

              {/* Created Date */}
              <div className='col-span-2 hidden sm:block'>
                <div className='h-3.5 w-24 bg-slate-200/70 rounded' />
              </div>

              {/* Name */}
              <div className='col-span-3 sm:col-span-2'>
                <div className='h-4 w-28 bg-slate-300/80 rounded' />
              </div>

              {/* Email */}
              <div className='col-span-3 sm:col-span-2'>
                <div className='h-3.5 w-36 max-w-full bg-slate-200/70 rounded' />
              </div>

              {/* Phone */}
              <div className='col-span-2 hidden md:block'>
                <div className='h-3.5 w-24 bg-slate-200/70 rounded' />
              </div>

              {/* Role */}
              <div className='col-span-2 sm:col-span-1'>
                <div className='h-5 w-16 bg-emerald-100/60 rounded-md' />
              </div>

              {/* Actions */}
              <div className='col-span-3 sm:col-span-2 flex items-center justify-end gap-2'>
                <div className='h-7 w-20 bg-emerald-100/70 rounded-lg' />
                <div className='h-7 w-20 bg-amber-100/70 rounded-lg hidden sm:block' />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Pagination Bar */}
        <div className='border-t border-slate-100 mt-2 pt-3 px-2 flex items-center justify-between'>
          <div className='h-3.5 w-36 bg-slate-200/80 rounded' />
          <div className='flex items-center gap-1.5'>
            <div className='h-8 w-8 bg-slate-100 rounded-lg' />
            <div className='h-8 w-8 bg-emerald-100/70 rounded-lg' />
            <div className='h-8 w-8 bg-slate-100 rounded-lg' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerAccountsSkeleton;
