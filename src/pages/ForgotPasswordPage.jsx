import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PATHS from '@/routes/paths';
import useAuthMutations from '@/hooks/queries/useAuthQueries';

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { forgotPasswordMutation } = useAuthMutations();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');

    try {
      const res = await forgotPasswordMutation.mutateAsync(email);
      setMessage(
        res.message ||
          'If the email is authorized, a reset link has been sent.',
      );
    } catch (err) {
      setErrorMsg(err.message || t('auth.errors.resetFailed'));
    }
  };

  const isSubmitting = forgotPasswordMutation.isPending;

  return (
    <div className='flex flex-col'>
      <h1 className='text-2xl font-extrabold text-slate-900 tracking-tight mb-1'>
        {t('auth.forgotPasswordTitle')}
      </h1>
      <p className='text-xs text-slate-500 font-semibold mb-6'>
        {t('auth.forgotPasswordSubtitle')}
      </p>

      {message && (
        <div className='p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl mb-4'>
          {message}
        </div>
      )}

      {errorMsg && (
        <div className='p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl mb-4'>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1.5'>
          <label className='text-xs font-bold text-slate-700 uppercase tracking-wide'>
            {t('auth.email')}
          </label>
          <input
            id='email'
            type='email'
            required
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='h-11 px-3.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#007cc2]'
          />
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='h-11 mt-2 bg-[#007cc2] hover:bg-[#006ca9] disabled:opacity-60 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer'
        >
          {isSubmitting ? t('auth.sending') : t('auth.sendResetLink')}
        </button>
      </form>

      <div className='mt-4 text-center'>
        <Link
          to={PATHS.LOGIN}
          className='text-xs font-bold text-[#007cc2] hover:underline'
        >
          {t('auth.backToLogin')}
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
