/**
 * High-fidelity Skeleton UI for the Account & Profile Management Page.
 * Matches the layout and dimensions of the Header, Avatar Section, and Profile Form.
 */
export const AccountSkeleton = () => {
  return (
    <div
      className='max-w-2xl mx-auto flex flex-col gap-5 py-4 animate-pulse'
      aria-label='Loading account profile...'
    >
      {/* ── HEADER SKELETON ─────────────────────────────────────────────────── */}
      <div className='flex flex-col items-center space-y-2 text-center'>
        {/* Title */}
        <div className='h-7 w-56 bg-slate-300/80 rounded-lg' />
        {/* Subtitle */}
        <div className='h-3.5 w-64 bg-slate-200/70 rounded-md' />
      </div>

      {/* ── CARD SKELETON ───────────────────────────────────────────────────── */}
      <div className='bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs'>
        {/* Avatar Profile Section */}
        <div className='flex flex-col items-center pb-6 border-b border-slate-100 mb-6'>
          {/* Avatar Circle */}
          <div className='w-20 h-20 rounded-full bg-slate-200/80 mb-3' />
          {/* Name */}
          <div className='h-5 w-36 bg-slate-300/80 rounded-md mb-2' />
          {/* Email */}
          <div className='h-3.5 w-44 bg-slate-200/70 rounded mb-3' />
          {/* Role Pill */}
          <div className='h-6 w-24 bg-emerald-100/70 rounded-full' />
        </div>

        {/* Form Fields Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* First Name */}
          <div className='space-y-1.5'>
            <div className='h-3 w-20 bg-slate-200/80 rounded' />
            <div className='h-10 w-full bg-slate-100 rounded-lg' />
          </div>

          {/* Last Name */}
          <div className='space-y-1.5'>
            <div className='h-3 w-20 bg-slate-200/80 rounded' />
            <div className='h-10 w-full bg-slate-100 rounded-lg' />
          </div>

          {/* Email (Full Width) */}
          <div className='col-span-full space-y-1.5'>
            <div className='h-3 w-16 bg-slate-200/80 rounded' />
            <div className='h-10 w-full bg-slate-50 border border-slate-200/60 rounded-lg' />
          </div>

          {/* Country Code */}
          <div className='space-y-1.5'>
            <div className='h-3 w-24 bg-slate-200/80 rounded' />
            <div className='h-10 w-full bg-slate-50 border border-slate-200/60 rounded-lg' />
          </div>

          {/* Phone Number */}
          <div className='space-y-1.5'>
            <div className='h-3 w-24 bg-slate-200/80 rounded' />
            <div className='h-10 w-full bg-slate-100 rounded-lg' />
          </div>

          {/* Save Button */}
          <div className='col-span-full flex justify-end mt-4 pt-4 border-t border-slate-100'>
            <div className='h-10 w-32 bg-emerald-100/70 rounded-xl' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSkeleton;
