import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutlineOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import useAuth from '@/hooks/useAuth';
import useNotification from '@/hooks/useNotification';
import { loginApi } from '@/services/api/authService';
import PATHS from '@/routes/paths';
import { normalizeUser } from '@/utils/roles';

export const LoginPage = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { showSuccess } = useNotification();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('auth.errors.invalidEmail'))
      .required(t('auth.errors.emailRequired')),
    password: Yup.string()
      .min(6, t('auth.errors.passwordMin'))
      .required(t('auth.errors.passwordRequired')),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setErrorMsg('');
      try {
        const authResult = await loginApi(values);

        // Extract user and token from response
        const userObj = authResult?.user || authResult?.data?.user;
        const token = authResult?.token || authResult?.data?.token;

        if (!token || !userObj) {
          throw new Error(authResult?.message || t('auth.errors.loginFailed'));
        }

        const normalizedUser = normalizeUser(userObj);
        login(normalizedUser, token);
        showSuccess(t('common.welcome') + ` ${normalizedUser.name || normalizedUser.email}!`);
        navigate(PATHS.DASHBOARD);
      } catch (err) {
        const message =
          err.normalizedMessage ||
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          t('auth.errors.loginFailed');
        setErrorMsg(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className='flex flex-col animate-in fade-in duration-500 delay-150 fill-mode-both'>
      {/* Brand header */}
      <div className='flex items-center gap-2 mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both'>
        <span className='h-2 w-2 rounded-full bg-[#10b981] animate-pulse'></span>
        <span className='text-[#059669] text-xs font-black tracking-wider uppercase'>
          {t('auth.portalEyebrow')}
        </span>
      </div>

      <h1 className='text-2xl font-black text-slate-900 tracking-tight mb-1 animate-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both'>
        {t('auth.welcome')}
      </h1>
      <p className='text-xs text-slate-500 font-medium mb-6 animate-in slide-in-from-bottom-2 duration-500 delay-[400ms] fill-mode-both'>
        {t('auth.signInSubtitle')}
      </p>

      {/* Error alert */}
      {errorMsg && (
        <div className='flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl mb-5 shadow-xs animate-in fade-in duration-200'>
          <ErrorOutlineIcon
            sx={{ fontSize: 18, color: '#e11d48' }}
            className='shrink-0 mt-0.5'
          />
          <div className='flex-1'>{errorMsg}</div>
        </div>
      )}

      <form
        onSubmit={formik.handleSubmit}
        noValidate
        className='flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-500 delay-[500ms] fill-mode-both'
      >
        {/* Email */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='email'
            className='text-xs font-bold text-slate-700 uppercase tracking-wider'
          >
            {t('auth.email')}
          </label>
          <div className='relative flex items-center'>
            <MailOutlineIcon
              sx={{ fontSize: 18 }}
              className='absolute left-3.5 text-slate-400 pointer-events-none'
            />
            <input
              id='email'
              name='email'
              type='email'
              placeholder={t('auth.emailPlaceholder')}
              autoComplete='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full h-11 pl-10 pr-3.5 border rounded-xl text-xs font-semibold text-slate-800 outline-none transition-all duration-300 ${
                formik.touched.email && formik.errors.email
                  ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                  : 'border-slate-200 focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10 bg-slate-50 hover:bg-white focus:bg-white'
              }`}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <span className='text-[11px] text-rose-600 font-bold'>
              {formik.errors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='password'
            className='text-xs font-bold text-slate-700 uppercase tracking-wider'
          >
            {t('auth.password')}
          </label>
          <div className='relative flex items-center'>
            <LockOutlinedIcon
              sx={{ fontSize: 18 }}
              className='absolute left-3.5 text-slate-400 pointer-events-none'
            />
            <input
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.passwordPlaceholder')}
              autoComplete='current-password'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full h-11 pl-10 pr-10 border rounded-xl text-xs font-semibold text-slate-800 outline-none transition-all duration-300 ${
                formik.touched.password && formik.errors.password
                  ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                  : 'border-slate-200 focus:border-[#10b981] focus:ring-4 focus:ring-[#10b981]/10 bg-slate-50 hover:bg-white focus:bg-white'
              }`}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer flex items-center p-1 rounded-md transition-colors'
            >
              {showPassword ? (
                <VisibilityOff sx={{ fontSize: 18 }} />
              ) : (
                <Visibility sx={{ fontSize: 18 }} />
              )}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <span className='text-[11px] text-rose-600 font-bold'>
              {formik.errors.password}
            </span>
          )}
        </div>

        {/* Submit button */}
        <button
          type='submit'
          disabled={formik.isSubmitting}
          className='h-11 mt-2 bg-[#1e3a34] hover:bg-[#152e29] active:scale-[0.98] disabled:opacity-60 text-white font-extrabold text-xs rounded-xl shadow-[0_8px_20px_-4px_rgba(30,58,52,0.35)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2'
        >
          {formik.isSubmitting ? (
            <>
              <span className='inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin'></span>
              <span>{t('auth.signingIn')}</span>
            </>
          ) : (
            t('auth.signIn')
          )}
        </button>
      </form>

      {/* Forgot Password Link */}
      <div className='mt-3.5 text-right animate-in fade-in duration-500 delay-[600ms] fill-mode-both'>
        <Link
          to={PATHS.FORGOT_PASSWORD}
          className='text-xs font-bold text-[#059669] hover:text-[#047857] hover:underline'
        >
          {t('auth.forgotPassword')}
        </Link>
      </div>

      {/* Info Notice */}
      <div className='mt-6 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-[11px] font-medium text-emerald-800 leading-relaxed animate-in fade-in duration-500 delay-[700ms] fill-mode-both'>
        {t('auth.loginNoticeAuthorized')}
      </div>
    </div>
  );
};

export default LoginPage;
