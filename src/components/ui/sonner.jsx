import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from 'lucide-react';
import { Toaster as Sonner } from 'sonner';

export const Toaster = ({ ...props }) => {
  return (
    <Sonner
      className='toaster group'
      icons={{
        success: <CircleCheck className='h-4 w-4 text-[#10b981] shrink-0' />,
        info: <Info className='h-4 w-4 text-sky-500 shrink-0' />,
        warning: <TriangleAlert className='h-4 w-4 text-amber-500 shrink-0' />,
        error: <OctagonX className='h-4 w-4 text-rose-500 shrink-0' />,
        loading: <LoaderCircle className='h-4 w-4 animate-spin text-[#10b981] shrink-0' />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200/90 group-[.toaster]:shadow-xl group-[.toaster]:shadow-slate-900/8 group-[.toaster]:rounded-2xl font-[\'Plus_Jakarta_Sans\',sans-serif] p-4 text-xs font-semibold',
          title: 'font-bold text-slate-900 text-xs tracking-tight',
          description: 'group-[.toast]:text-slate-500 text-[11px] font-medium leading-relaxed mt-0.5',
          actionButton:
            'group-[.toast]:bg-linear-to-r group-[.toast]:from-[#10b981] group-[.toast]:to-[#059669] group-[.toast]:text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs shadow-[#10b981]/25 hover:opacity-95 transition-opacity',
          cancelButton:
            'group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600 font-semibold text-xs px-3 py-1.5 rounded-xl hover:bg-slate-200/70 transition-colors',
          closeButton:
            'group-[.toast]:bg-white group-[.toast]:text-slate-400 group-[.toast]:border-slate-200 hover:group-[.toast]:text-slate-800 hover:group-[.toast]:bg-slate-50 transition-colors rounded-lg shadow-2xs',
          success:
            'group-[.toaster]:border-emerald-200 group-[.toaster]:bg-emerald-50/50 group-[.toaster]:text-emerald-950',
          error:
            'group-[.toaster]:border-rose-200 group-[.toaster]:bg-rose-50/50 group-[.toaster]:text-rose-950',
          warning:
            'group-[.toaster]:border-amber-200 group-[.toaster]:bg-amber-50/50 group-[.toaster]:text-amber-950',
          info:
            'group-[.toaster]:border-sky-200 group-[.toaster]:bg-sky-50/50 group-[.toaster]:text-sky-950',
        },
      }}
      {...props}
    />
  );
};

export default Toaster;

