import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PATHS from '@/routes/paths';

export const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center min-h-screen p-4 bg-[#f4f6f9]'>
      <div className='max-w-md w-full p-8 text-center rounded-2xl shadow-xl bg-white border border-slate-200'>
        <div className='text-5xl font-black text-[#007cc2] mb-2 tracking-tight'>
          404
        </div>
        <h2 className='text-xl font-extrabold text-slate-800 mb-2'>
          {t('errors.pageNotFound', { defaultValue: 'Page Not Found' })}
        </h2>
        <p className='text-xs text-slate-500 font-medium mb-6'>
          The page you are looking for does not exist or has been moved.
        </p>
        <button
          type='button'
          onClick={() => navigate(PATHS.DASHBOARD)}
          className='px-6 py-2.5 bg-[#007cc2] hover:bg-[#006ca9] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer'
        >
          {t('nav.dashboard')}
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
