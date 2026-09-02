import { useTranslation } from 'react-i18next';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

export const OpsSummaryCards = ({
  activeCount = 0,
  totalCount = 0,
  needsAttentionCount = 0,
  completedCount = 0,
  onCardClick,
}) => {
  const { t } = useTranslation();

  const cards = [
    {
      id: 'total',
      title: 'Total Records',
      note: 'Total uploaded candidates',
      value: totalCount,
      formattedValue: totalCount.toLocaleString('en-IN'),
      badge: 'ALL',
      icon: <FormatListNumberedIcon sx={{ fontSize: 16 }} />,
      theme: {
        iconBg: 'bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white',
        valueColor: 'text-indigo-600',
        badgeBg: 'bg-indigo-100/80 text-indigo-700',
        border: 'border-indigo-200/60',
        hoverShadow: 'hover:shadow-md hover:shadow-indigo-500/20 hover:border-indigo-300',
        dot: 'bg-indigo-500',
      },
    },
    {
      id: 'active_follow_ups',
      title: t('metrics.activeFollowUps', { defaultValue: 'Active Follow Ups' }),
      note: t('metrics.activeFollowUpsNote', { defaultValue: 'WhatsApp or call is pending' }),
      value: activeCount,
      formattedValue: activeCount.toLocaleString('en-IN'),
      badge: 'IN PROGRESS',
      icon: <TrendingUpIcon sx={{ fontSize: 16 }} />,
      theme: {
        iconBg: 'bg-gradient-to-tr from-[#007cc2] to-[#38bdf8] text-white',
        valueColor: 'text-[#007cc2]',
        badgeBg: 'bg-sky-100/80 text-sky-700',
        border: 'border-sky-200/60',
        hoverShadow: 'hover:shadow-md hover:shadow-sky-500/20 hover:border-sky-300',
        dot: 'bg-sky-500',
      },
    },
    {
      id: 'needs_attention',
      title: t('metrics.needsAttention', { defaultValue: 'Needs Attention' }),
      note: t('metrics.needsAttentionNote', { defaultValue: 'Review candidate responses' }),
      value: needsAttentionCount,
      formattedValue: needsAttentionCount.toLocaleString('en-IN'),
      badge: 'ACTION REQUIRED',
      icon: <PriorityHighIcon sx={{ fontSize: 16 }} />,
      theme: {
        iconBg: 'bg-gradient-to-tr from-amber-500 to-amber-400 text-white',
        valueColor: 'text-amber-600',
        badgeBg: 'bg-amber-100/80 text-amber-700',
        border: 'border-amber-200/60',
        hoverShadow: 'hover:shadow-md hover:shadow-amber-500/20 hover:border-amber-300',
        dot: 'bg-amber-500',
      },
    },
    {
      id: 'completed',
      title: t('metrics.completed', { defaultValue: 'Completed' }),
      note: t('metrics.completedNote', { defaultValue: 'Calls resolved' }),
      value: completedCount,
      formattedValue: completedCount.toLocaleString('en-IN'),
      badge: 'COMPLETED',
      icon: <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />,
      theme: {
        iconBg: 'bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white',
        valueColor: 'text-emerald-600',
        badgeBg: 'bg-emerald-100/80 text-emerald-700',
        border: 'border-emerald-200/60',
        hoverShadow: 'hover:shadow-md hover:shadow-emerald-500/20 hover:border-emerald-300',
        dot: 'bg-emerald-500',
      },
    },
  ];

  return (
    <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mb-4 sm:mb-6'>
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onCardClick?.(card.id)}
          className={`relative bg-white border ${card.theme.border} ${card.theme.hoverShadow} rounded-xl sm:rounded-2xl shadow-xs overflow-hidden flex flex-col transition-all duration-200 ${
            onCardClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
          }`}
        >
          {/* Mobile compact view */}
          <div className='flex sm:hidden items-center gap-2.5 p-3'>
            <div className={`w-7 h-7 rounded-lg ${card.theme.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
              {card.icon}
            </div>
            <div className='flex-1 min-w-0'>
              <div 
                className={`font-black leading-none ${card.theme.valueColor} ${
                  card.formattedValue.length > 7 ? 'text-[14px]' : 
                  card.formattedValue.length > 5 ? 'text-[16px]' : 
                  'text-xl'
                }`}
              >
                {card.formattedValue}
              </div>
              <div className='text-[10px] font-bold text-slate-600 truncate mt-0.5'>{card.title}</div>
            </div>
            <span className={`text-[8px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full shrink-0 ${card.theme.badgeBg}`}>
              {card.badge}
            </span>
          </div>

          {/* Desktop full view */}
          <div className='hidden sm:flex flex-col justify-between p-5'>
            <div className='flex items-center justify-between gap-2 mb-3'>
              <div className={`w-10 h-10 rounded-xl ${card.theme.iconBg} flex items-center justify-center shadow-md shadow-slate-200`}>
                <span className='scale-[1.25]'>{card.icon}</span>
              </div>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${card.theme.badgeBg}`}>
                {card.badge}
              </span>
            </div>
            <div>
              <div className='flex items-baseline gap-2 mb-1'>
                <span 
                  className={`font-black tracking-tight ${card.theme.valueColor} ${
                    card.formattedValue.length > 7 ? 'text-xl' : 
                    card.formattedValue.length > 5 ? 'text-2xl' : 
                    'text-3xl'
                  }`}
                >
                  {card.formattedValue}
                </span>
              </div>
              <h3 className='text-xs font-bold text-slate-800 tracking-tight mb-0.5'>{card.title}</h3>
              <p className='text-[11px] font-semibold text-slate-400 truncate'>{card.note}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OpsSummaryCards;
