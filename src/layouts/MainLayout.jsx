import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import useAuth from '@/hooks/useAuth';
import useAuthMutations from '@/hooks/queries/useAuthQueries';
import { useSummaryCardsQuery } from '@/hooks/queries/useDashboardQuery';
import PATHS from '@/routes/paths';
import NotificationsPopover from '@/components/dashboard/NotificationsPopover';
import { userInitials } from '@/utils/formatters';
import { isMasterScheduler, getRoleLabel } from '@/utils/roles';

export const MainLayout = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSidebarMenuOpen, setIsSidebarMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sidebarMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const isMaster = isMasterScheduler(user?.role);
  const effectiveSchedulerId = !isMaster
    ? user?.id || user?.userId
    : undefined;

  // TanStack Queries & Mutations
  const { data: summaryCardsData = {} } = useSummaryCardsQuery({
    scheduler_id: effectiveSchedulerId,
  });
  const { logoutMutation } = useAuthMutations();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarMenuRef.current &&
        !sidebarMenuRef.current.contains(event.target)
      ) {
        setIsSidebarMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    logout();
    navigate(PATHS.LOGIN);
  };

  const currentNav = location.pathname;

  return (
    <div className='min-h-screen bg-[#f8fafc] text-slate-900 flex'>
      {/* Expandable Sidebar Navigation (Desktop) */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-slate-200/80 p-3 z-40 transition-all duration-300 ease-in-out group overflow-hidden shadow-xs hover:shadow-xl ${
          isSidebarMenuOpen ? 'is-open w-60' : 'w-18.5 hover:w-60'
        }`}
      >
        {/* Brand */}
        <div className='flex items-center gap-3 px-1.5 py-3 mb-4 min-w-0'>
          <div className='w-10 h-10 flex items-center justify-center shrink-0'>
            <img
              src='/assets/logo.svg'
              alt='Curatal Logo'
              className='w-full h-full object-contain'
            />
          </div>
          <div className='hidden group-hover:flex group-[.is-open]:flex flex-col min-w-0 transition-opacity duration-200'>
            <span className='font-black text-sm text-slate-900 tracking-tight leading-none'>
              CURATAL
            </span>
            <span className='text-[10px] font-bold text-[#007cc2] uppercase tracking-wider mt-0.5'>
              Automation Hub
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className='flex flex-col gap-1.5 flex-1 mt-2'>
          {/* Dashboard / Home */}
          <button
            type='button'
            onClick={() => navigate(PATHS.DASHBOARD)}
            className={`w-full h-10 px-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-all cursor-pointer ${
              currentNav === PATHS.DASHBOARD
                ? 'bg-linear-to-r from-[#007cc2] to-[#0095e8] text-white shadow-md shadow-[#007cc2]/20'
                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
            }`}
          >
            <DashboardOutlinedIcon sx={{ fontSize: 20 }} className='shrink-0' />
            <span className='hidden group-hover:inline group-[.is-open]:inline truncate'>
              {t('nav.dashboard')}
            </span>
          </button>

          {/* Schedulers (Master only) */}
          {isMaster && (
            <button
              type='button'
              onClick={() => navigate(PATHS.SCHEDULERS)}
              className={`w-full h-10 px-3 rounded-xl flex items-center gap-3 text-xs font-bold transition-all cursor-pointer ${
                currentNav === PATHS.SCHEDULERS
                  ? 'bg-linear-to-r from-[#007cc2] to-[#0095e8] text-white shadow-md shadow-[#007cc2]/20'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <GroupOutlinedIcon sx={{ fontSize: 20 }} className='shrink-0' />
              <span className='hidden group-hover:inline group-[.is-open]:inline truncate'>
                {t('nav.schedulerAccounts')}
              </span>
            </button>
          )}
        </nav>

        {/* User Account / Profile Button */}
        <div
          className='relative mt-auto pt-3 border-t border-slate-100'
          ref={sidebarMenuRef}
        >
          {isSidebarMenuOpen && (
            <div className='absolute bottom-16 left-0 right-0 glass-dropdown rounded-2xl p-1.5 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150'>
              <button
                type='button'
                onClick={() => {
                  setIsSidebarMenuOpen(false);
                  navigate(PATHS.ACCOUNT);
                }}
                className='w-full h-9 px-3 text-left rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 cursor-pointer transition-colors'
              >
                <PersonOutlinedIcon sx={{ fontSize: 17, color: '#64748b' }} />
                <span>{t('nav.accountManagement')}</span>
              </button>
              <button
                type='button'
                onClick={handleLogout}
                className='w-full h-9 px-3 text-left rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer transition-colors'
              >
                <LogoutOutlinedIcon sx={{ fontSize: 17, color: '#f43f5e' }} />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          )}

          <button
            type='button'
            onClick={() => setIsSidebarMenuOpen(!isSidebarMenuOpen)}
            className='w-full p-1.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 flex items-center gap-2.5 text-left transition-all cursor-pointer bg-white shadow-2xs'
          >
            <div className='w-8 h-8 rounded-lg bg-linear-to-tr from-[#007cc2] to-[#38bdf8] text-white font-black text-xs grid place-items-center shrink-0 shadow-xs'>
              {userInitials(user?.name)}
            </div>
            <div className='hidden group-hover:block group-[.is-open]:block min-w-0 flex-1'>
              <div className='text-xs font-bold text-slate-800 truncate'>
                {user?.name || 'User'}
              </div>
              <div className='text-[10px] text-slate-400 font-semibold truncate capitalize'>
                {getRoleLabel(user?.role)}
              </div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Workspace Wrapper */}
      <div className='flex-1 flex flex-col md:pl-18.5 min-w-0'>
        {/* Topbar */}
        <header className='sticky top-0 z-30 h-16 glass-panel border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-2xs'>
          {/* Mobile brand & breadcrumb */}
          <div className='flex items-center gap-3'>
            <div className='md:hidden flex items-center gap-2'
              onClick={() => navigate(PATHS.DASHBOARD)}
              style={{ cursor: 'pointer' }}
            >
              <div className='w-8 h-8 flex items-center justify-center shrink-0'>
                <img
                  src='/assets/logo.svg'
                  alt='Curatal Logo'
                  className='w-full h-full object-contain'
                />
              </div>
              <span className='font-black text-sm text-slate-900'>Curatal</span>
            </div>

            {/* Breadcrumb / Title */}
            <div className='hidden sm:flex items-center gap-2 text-xs'>
              <span className='font-bold text-slate-400'>Portal</span>
              <span className='text-slate-300 font-bold'>/</span>
              <span className='font-extrabold text-slate-800'>
                {currentNav === PATHS.SCHEDULERS
                  ? t('nav.schedulerAccounts')
                  : t('nav.dashboard')}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className='flex items-center gap-3 ml-auto'>
            {/* User role pill */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
                isMaster
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-sky-50 text-sky-800 border-sky-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isMaster ? 'bg-amber-500' : 'bg-sky-500'}`}
              />
              <span>{getRoleLabel(user?.role)}</span>
            </div>

            {/* Notifications Popover */}
            <NotificationsPopover
              isOpen={isNotificationOpen}
              onToggle={() => setIsNotificationOpen(!isNotificationOpen)}
              onClose={() => setIsNotificationOpen(false)}
              count={summaryCardsData?.needsAttentionCount ?? 0}
              onActionClick={() => {
                navigate(PATHS.DASHBOARD, {
                  state: { tab: 'needs_attention', _ts: Date.now() },
                });
              }}
            />

            {/* Mobile User Avatar & Account Menu Dropdown */}
            <div className='relative md:hidden' ref={mobileMenuRef}>
              <button
                type='button'
                id='mobile-user-menu-btn'
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className='w-9 h-9 rounded-xl bg-linear-to-tr from-[#007cc2] to-[#38bdf8] text-white font-extrabold text-xs flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-[#007cc2]/30 transition-all'
                aria-expanded={isMobileMenuOpen}
                aria-haspopup='true'
              >
                {userInitials(user?.name)}
              </button>

              {isMobileMenuOpen && (
                <div className='absolute right-0 top-12 w-60 bg-white border border-slate-200/90 rounded-2xl p-2 z-50 shadow-xl flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150'>
                  {/* User info banner */}
                  <div className='px-3 py-2.5 border-b border-slate-100 mb-1 bg-slate-50/60 rounded-xl'>
                    <div className='text-xs font-bold text-slate-900 truncate'>
                      {user?.name || 'User'}
                    </div>
                    <div className='text-[10px] text-slate-500 font-semibold truncate capitalize mt-0.5'>
                      {getRoleLabel(user?.role)}
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className='flex flex-col gap-0.5 pb-1 border-b border-slate-100 mb-1'>
                    <button
                      type='button'
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate(PATHS.DASHBOARD);
                      }}
                      className={`w-full h-9 px-3 text-left rounded-xl text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${
                        currentNav === PATHS.DASHBOARD
                          ? 'bg-[#007cc2]/10 text-[#007cc2]'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <DashboardOutlinedIcon sx={{ fontSize: 17 }} />
                      <span>{t('nav.dashboard')}</span>
                    </button>

                    {isMaster && (
                      <button
                        type='button'
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate(PATHS.SCHEDULERS);
                        }}
                        className={`w-full h-9 px-3 text-left rounded-xl text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-colors ${
                          currentNav === PATHS.SCHEDULERS
                            ? 'bg-[#007cc2]/10 text-[#007cc2]'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <GroupOutlinedIcon sx={{ fontSize: 17 }} />
                        <span>{t('nav.schedulerAccounts')}</span>
                      </button>
                    )}
                  </div>

                  {/* Account Management */}
                  <button
                    type='button'
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(PATHS.ACCOUNT);
                    }}
                    className='w-full h-9 px-3 text-left rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 cursor-pointer transition-colors'
                  >
                    <PersonOutlinedIcon sx={{ fontSize: 17, color: '#64748b' }} />
                    <span>{t('nav.accountManagement')}</span>
                  </button>

                  {/* Logout Button */}
                  <button
                    type='button'
                    onClick={handleLogout}
                    className='w-full h-9 px-3 text-left rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer transition-colors'
                  >
                    <LogoutOutlinedIcon sx={{ fontSize: 17, color: '#f43f5e' }} />
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Workspace */}
        <main className='flex-1 p-3 sm:p-6 lg:p-8 min-w-0'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
