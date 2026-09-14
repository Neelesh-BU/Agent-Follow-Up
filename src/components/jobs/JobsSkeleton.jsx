/**
 * High-fidelity Skeleton UI for the Jobs & Roles Page.
 * Matches the layout and dimensions of the Banner, Metrics, Filters, and Jobs Table.
 */
export const JobsSkeleton = () => {
  return (
    <div
      className='p-6 md:p-8 max-w-7xl mx-auto space-y-6 animate-pulse'
      aria-label='Loading jobs content...'
    >
      {/* ── TOP HEADER / BANNER SKELETON ─────────────────────────────────────── */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs'>
        <div className='flex items-center gap-4'>
          {/* Icon placeholder */}
          <div className='w-12 h-12 rounded-2xl bg-emerald-100/80 shrink-0' />
          <div className='space-y-2'>
            {/* Title */}
            <div className='h-6 w-52 bg-slate-300/80 rounded-lg' />
            {/* Subtitle */}
            <div className='h-3.5 w-72 max-w-full bg-slate-200/70 rounded-md' />
          </div>
        </div>

        {/* Action Button */}
        <div className='h-10 w-36 bg-emerald-100/70 rounded-xl shrink-0' />
      </div>

      {/* ── QUICK METRICS BAR SKELETON ───────────────────────────────────────── */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        {[
          { labelW: 'w-20', numW: 'w-12', iconBg: 'bg-emerald-50' },
          { labelW: 'w-28', numW: 'w-10', iconBg: 'bg-emerald-50' },
          { labelW: 'w-24', numW: 'w-14', iconBg: 'bg-blue-50' },
        ].map((card, idx) => (
          <div
            key={idx}
            className='bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between shadow-xs'
          >
            <div className='space-y-2'>
              <div className={`h-3 ${card.labelW} bg-slate-200/80 rounded`} />
              <div className={`h-6 ${card.numW} bg-slate-300/80 rounded-md`} />
            </div>
            <div className={`w-9 h-9 rounded-lg ${card.iconBg} shrink-0`} />
          </div>
        ))}
      </div>

      {/* ── SEARCH & FILTER BAR SKELETON ─────────────────────────────────────── */}
      <div className='bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3'>
        {/* Search input placeholder */}
        <div className='h-10 flex-1 bg-slate-100 rounded-xl' />

        {/* Filters placeholder */}
        <div className='flex items-center gap-2 flex-wrap sm:flex-nowrap'>
          <div className='h-10 w-44 bg-slate-100 rounded-xl' />
          <div className='h-10 w-36 bg-slate-100 rounded-xl' />
        </div>
      </div>

      {/* ── TABLE CONTAINER SKELETON ─────────────────────────────────────────── */}
      <div className='bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden'>
        {/* Table Header */}
        <div className='bg-slate-50/90 border-b border-slate-200/80 px-6 py-4 grid grid-cols-12 gap-4 items-center'>
          <div className='col-span-2 h-3 w-16 bg-slate-200/80 rounded' />
          <div className='col-span-3 h-3 w-32 bg-slate-200/80 rounded' />
          <div className='col-span-2 h-3 w-24 bg-slate-200/80 rounded hidden md:block' />
          <div className='col-span-2 h-3 w-20 bg-slate-200/80 rounded hidden lg:block' />
          <div className='col-span-2 md:col-span-3 lg:col-span-1 h-3 w-16 bg-slate-200/80 rounded' />
          <div className='col-span-2 h-3 w-16 bg-slate-200/80 rounded ml-auto' />
        </div>

        {/* Table Rows */}
        <div className='divide-y divide-slate-100'>
          {[1, 2, 3, 4, 5, 6].map((row) => (
            <div
              key={row}
              className='px-6 py-4 grid grid-cols-12 gap-4 items-center'
            >
              {/* Job ID Pill */}
              <div className='col-span-2 flex items-center'>
                <div className='h-6 w-16 bg-emerald-100/70 rounded-md' />
              </div>

              {/* Title & Company */}
              <div className='col-span-3 space-y-1.5'>
                <div className='h-4 w-40 max-w-full bg-slate-300/80 rounded' />
                <div className='h-3 w-24 bg-slate-200/70 rounded' />
              </div>

              {/* Role / Position */}
              <div className='col-span-2 hidden md:block'>
                <div className='h-3.5 w-28 bg-slate-200/80 rounded' />
              </div>

              {/* Location & Type */}
              <div className='col-span-2 hidden lg:block space-y-1'>
                <div className='h-3.5 w-24 bg-slate-200/80 rounded' />
                <div className='h-2.5 w-16 bg-slate-100 rounded' />
              </div>

              {/* Status */}
              <div className='col-span-2 md:col-span-3 lg:col-span-1'>
                <div className='h-6 w-20 bg-slate-200/70 rounded-full' />
              </div>

              {/* Action Buttons */}
              <div className='col-span-2 flex items-center justify-end gap-2'>
                <div className='w-8 h-8 rounded-lg bg-slate-100' />
                <div className='w-8 h-8 rounded-lg bg-emerald-100/70' />
                <div className='w-8 h-8 rounded-lg bg-red-100/60' />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Bar */}
        <div className='border-t border-slate-100 px-6 py-3.5 flex items-center justify-between'>
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

export default JobsSkeleton;
