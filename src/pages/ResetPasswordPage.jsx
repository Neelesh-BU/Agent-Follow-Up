import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PATHS from '@/routes/paths';
import useAuthMutations from '@/hooks/queries/useAuthQueries';

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { resetPasswordMutation } = useAuthMutations();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');

    if (password !== confirmPassword) {
      setErrorMsg(t('auth.errors.passwordsMustMatch'));
      return;
    }

    if (password.length < 6) {
      setErrorMsg(t('auth.errors.passwordMin'));
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync({ token, password });
      setMessage(t('auth.passwordUpdatedSuccess'));
    } catch (err) {
      setErrorMsg(err.message || 'Unable to reset password.');
    }
  };

  const isSubmitting = resetPasswordMutation.isPending;

  return (
    <div className='flex flex-col'>
      <h1 className='text-2xl font-extrabold text-slate-900 tracking-tight mb-1'>
        {t('auth.resetPasswordTitle')}
      </h1>
      <p className='text-xs text-slate-500 font-semibold mb-6'>
        {t('auth.resetPasswordSubtitle')}
      </p>

      {message ? (
        <div className='p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex flex-col gap-2'>
          <span>{message}</span>
          <Link
            to={PATHS.LOGIN}
            className='text-[#059669] hover:underline font-extrabold'
          >
            {t('auth.goToLogin')} →
          </Link>
        </div>
      ) : (
        <>
          {errorMsg && (
            <div className='p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl mb-4'>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-slate-700 uppercase tracking-wide'>
                {t('auth.newPassword')}
              </label>
              <input
                type='password'
                required
                placeholder={t('auth.newPasswordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='h-11 px-3.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#10b981]'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-slate-700 uppercase tracking-wide'>
                {t('auth.confirmPassword')}
              </label>
              <input
                type='password'
                required
                placeholder={t('auth.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='h-11 px-3.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#10b981]'
              />
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='h-11 mt-2 bg-[#1e3a34] hover:bg-[#152e29] disabled:opacity-60 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer'
            >
              {isSubmitting ? t('auth.updating') : t('auth.updatePassword')}
            </button>
          </form>

          <div className='mt-4 text-center'>
            <Link
              to={PATHS.LOGIN}
              className='text-xs font-bold text-[#059669] hover:underline'
            >
              {t('auth.backToLogin')}
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ResetPasswordPage;
