import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoginBanner from '@/assets/Login-Banner.png';
import DotMatrixIcon from '@/assets/dot-matrix.svg';
import FeatureEngagementIcon from '@/assets/feature-engagement.svg';
import FeatureTimeIcon from '@/assets/feature-time.svg';
import FeatureTrackIcon from '@/assets/feature-track.svg';

export const AuthLayout = () => {
  const { t } = useTranslation();

  return (
    <div className='min-h-screen flex items-center justify-center p-3 sm:p-4 lg:p-5 bg-linear-to-b from-[#f3f7fb] via-[#ecf3f9] to-[#e2edf7] text-[#161b2f]'>
      <section className='w-full max-w-[980px] grid grid-cols-1 lg:grid-cols-[1.2fr_minmax(340px,380px)] bg-white border border-[#e5eaf0] rounded-[22px] overflow-hidden shadow-[0_16px_50px_-12px_rgba(0,124,194,0.12),0_4px_16px_rgba(0,0,0,0.03)] animate-in fade-in zoom-in-[0.98] slide-in-from-bottom-4 duration-700 ease-out'>
        {/* Left Hero Brand Panel */}
        <div className='hidden lg:flex flex-col justify-between p-6 lg:p-7 bg-linear-to-b from-[#f8fbfe] via-[#f1f7fd] to-[#eaf2fb] border-r border-[#e8eff6] relative overflow-hidden'>
          {/* Decorative Dot Matrix in top-right */}
          <img
            src={DotMatrixIcon}
            alt=''
            aria-hidden='true'
            className='absolute top-5 right-5 w-24 h-24 pointer-events-none opacity-40 select-none'
          />

          {/* Top Logo & Headings */}
          <div className='relative z-10'>
            {/* Curatal Brand Logo */}
            <div className='mb-3.5'>
              <img
                src='/assets/curatal-logo.svg'
                alt='Curatal'
                className='h-7.5 w-auto object-contain block select-none'
              />
            </div>

            {/* Typography */}
            <h1 className='text-[24px] lg:text-[27px] font-black text-slate-900 tracking-tight leading-[1.15]'>
              {t('auth.heroTitle')}
              <span className='block text-[#007cc2] font-black mt-0.5'>
                {t('auth.heroSubtitleHighlight')}
              </span>
            </h1>

            <p className='text-xs lg:text-[12.5px] text-slate-600 font-medium mt-2 max-w-[360px] leading-relaxed'>
              {t('auth.heroDescription')}
            </p>
          </div>

          {/* Center 3D Pipeline Banner Mockup */}
          <div className='relative z-10 flex items-center justify-center my-1.5 lg:my-2.5'>
            <img
              src={LoginBanner}
              alt='Candidate Follow-up Pipeline Automation'
              className='w-full max-w-[320px] lg:max-w-[350px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(0,124,194,0.08)]'
            />
          </div>

          {/* Bottom 3-Feature Card */}
          <div className='relative z-10 bg-white rounded-xl p-2.5 sm:p-3 border border-slate-100/90 shadow-[0_3px_18px_rgba(0,124,194,0.06)]'>
            <div className='grid grid-cols-3 divide-x divide-slate-100'>
              {/* Feature 1: Better Engagement */}
              <div className='flex flex-col items-center text-center px-1.5'>
                <div className='mb-1 flex items-center justify-center'>
                  <img
                    src={FeatureEngagementIcon}
                    alt=''
                    aria-hidden='true'
                    className='w-5 h-5 object-contain'
                  />
                </div>
                <span className='text-[11.5px] font-extrabold text-slate-900 tracking-tight'>
                  {t('auth.featureEngagementTitle')}
                </span>
                <span className='text-[10px] text-slate-500 font-medium mt-0.5 leading-snug'>
                  {t('auth.featureEngagementSubtitle')}
                </span>
              </div>

              {/* Feature 2: Save Time */}
              <div className='flex flex-col items-center text-center px-1.5'>
                <div className='mb-1 flex items-center justify-center'>
                  <img
                    src={FeatureTimeIcon}
                    alt=''
                    aria-hidden='true'
                    className='w-5 h-5 object-contain'
                  />
                </div>
                <span className='text-[11.5px] font-extrabold text-slate-900 tracking-tight'>
                  {t('auth.featureSaveTimeTitle')}
                </span>
                <span className='text-[10px] text-slate-500 font-medium mt-0.5 leading-snug'>
                  {t('auth.featureSaveTimeSubtitle')}
                </span>
              </div>

              {/* Feature 3: Track & Optimize */}
              <div className='flex flex-col items-center text-center px-1.5'>
                <div className='mb-1 flex items-center justify-center'>
                  <img
                    src={FeatureTrackIcon}
                    alt=''
                    aria-hidden='true'
                    className='w-5 h-5 object-contain'
                  />
                </div>
                <span className='text-[11.5px] font-extrabold text-slate-900 tracking-tight'>
                  {t('auth.featureTrackOptimizeTitle')}
                </span>
                <span className='text-[10px] text-slate-500 font-medium mt-0.5 leading-snug'>
                  {t('auth.featureTrackOptimizeSubtitle')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Outlet */}
        <div className='p-6 sm:p-7 lg:p-8 flex flex-col justify-center'>
          <div className='lg:hidden mb-5 flex justify-center'>
            <img
              src='/assets/curatal-logo.svg'
              alt='Curatal'
              className='w-30 h-auto'
            />
          </div>
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default AuthLayout;

