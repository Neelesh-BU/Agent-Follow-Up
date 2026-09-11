import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TagOutlinedIcon from '@mui/icons-material/TagOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import useNotification from '@/hooks/useNotification';
import {
  useCreateJobMutation,
  useNextJobIdQuery,
  useCompaniesQuery,
} from '@/hooks/queries/useJobQueries';
import SelectDropdown from '@/components/common/SelectDropdown';
import RichTextEditor from '@/components/common/RichTextEditor';

export const AddJobDrawer = ({ isOpen = false, onClose, onJobCreated }) => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();

  const { data: nextIdData, isLoading: isLoadingNextId } = useNextJobIdQuery({
    enabled: isOpen,
  });

  const { data: companiesData } = useCompaniesQuery();
  const companyOptions = companiesData?.data || [];

  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    department: '',
    location: 'Remote',
    job_type: 'full-time',
    status: 'active',
    job_description: '',
  });

  const [useCustomId, setUseCustomId] = useState(false);
  const [customJobId, setCustomJobId] = useState('');

  const nextId = nextIdData?.next_job_id || 1;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        job_title: '',
        company_name: '',
        department: '',
        location: 'Remote',
        job_type: 'full-time',
        status: 'active',
        job_description: '',
      });
      setUseCustomId(false);
      setCustomJobId('');
    }
  }, [isOpen]);

  const createJobMutation = useCreateJobMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.job_title.trim()) {
      showError(t('jobs.titleRequired', { defaultValue: 'Job title is required' }));
      return;
    }
    if (!formData.company_name.trim()) {
      showError(t('jobs.companyRequired', { defaultValue: 'Company name is required' }));
      return;
    }

    const payload = {
      job_title: formData.job_title.trim(),
      company_name: formData.company_name.trim(),
      department: formData.department.trim() || undefined,
      location: formData.location.trim() || undefined,
      job_type: formData.job_type,
      status: formData.status,
      job_description: formData.job_description.trim() || undefined,
    };

    if (useCustomId && customJobId) {
      const parsedId = parseInt(customJobId, 10);
      if (isNaN(parsedId) || parsedId <= 0) {
        showError(t('jobs.invalidJobId', { defaultValue: 'Job ID must be a positive integer' }));
        return;
      }
      payload.job_id = parsedId;
    }

    try {
      const res = await createJobMutation.mutateAsync(payload);
      showSuccess(
        res.message ||
          t('jobs.createdSuccess', {
            defaultValue: `Job #${res.job?.job_id || ''} created successfully!`,
          }),
      );
      if (onJobCreated) onJobCreated(res.job);
      onClose();
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'Failed to create job';
      showError(errorMsg);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity'
        onClick={onClose}
      />

      {/* Slide-over Side Panel */}
      <div className='relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 animate-in slide-in-from-right duration-300'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-linear-to-r from-slate-50 to-white'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-linear-to-br from-[#10b981]/15 to-[#059669]/25 text-[#059669] flex items-center justify-center shadow-xs border border-[#10b981]/30'>
              <WorkOutlineOutlinedIcon sx={{ fontSize: 22 }} />
            </div>
            <div>
              <h2 className='text-base font-extrabold text-slate-900 leading-none'>
                {t('jobs.addJobSidePanelTitle', { defaultValue: 'Create New Job' })}
              </h2>
              <p className='text-xs font-semibold text-slate-500 mt-1'>
                {t('jobs.addJobSidePanelSubtitle', {
                  defaultValue: 'Add a new job opening with a unique integer ID',
                })}
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer'
          >
            <CloseOutlinedIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Form Body */}
        <form
          id='create-job-form'
          onSubmit={handleSubmit}
          className='flex-1 overflow-y-auto p-6 space-y-5 text-xs'
        >
          {/* Job ID Banner / Selector */}
          <div className='p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col gap-2.5'>
            <div className='flex items-center justify-between'>
              <span className='flex items-center gap-1.5 font-bold text-slate-700 text-xs'>
                <TagOutlinedIcon sx={{ fontSize: 16 }} className='text-slate-500' />
                {t('jobs.jobIdLabel', { defaultValue: 'Unique Job ID' })}
              </span>
              <label className='flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-semibold text-slate-600'>
                <input
                  type='checkbox'
                  checked={useCustomId}
                  onChange={(e) => setUseCustomId(e.target.checked)}
                  className='rounded border-slate-300 text-[#10b981] focus:ring-[#10b981]'
                />
                {t('jobs.customIdToggle', { defaultValue: 'Manual ID' })}
              </label>
            </div>

            {!useCustomId ? (
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md font-mono font-bold text-xs'>
                  {isLoadingNextId ? '...' : `#${nextId}`}
                </span>
                <span className='text-[11px] text-slate-500 font-medium'>
                  {t('jobs.autoAssignedHint', {
                    defaultValue: 'Next integer ID will be assigned automatically',
                  })}
                </span>
              </div>
            ) : (
              <div className='flex flex-col gap-1'>
                <input
                  type='number'
                  min='1'
                  step='1'
                  required
                  placeholder={String(nextId)}
                  value={customJobId}
                  onChange={(e) => setCustomJobId(e.target.value)}
                  className='h-9 px-3 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]'
                />
                <span className='text-[10px] text-amber-600 font-medium'>
                  {t('jobs.customIdWarning', {
                    defaultValue: 'Must be a unique integer not already in use',
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Job Title */}
          <div className='flex flex-col gap-1.5'>
            <label className='font-bold text-slate-700 tracking-wide'>
              {t('jobs.jobTitle', { defaultValue: 'Job Title' })} *
            </label>
            <div className='relative'>
              <input
                type='text'
                required
                placeholder='e.g. Senior Frontend Engineer'
                value={formData.job_title}
                onChange={(e) =>
                  setFormData({ ...formData, job_title: e.target.value })
                }
                className='w-full h-10 px-3.5 border border-slate-300 rounded-xl font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all'
              />
            </div>
          </div>

          {/* Company Name & Department */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-slate-700 tracking-wide flex items-center gap-1'>
                <BusinessOutlinedIcon sx={{ fontSize: 14 }} className='text-slate-400' />
                {t('jobs.companyName', { defaultValue: 'Company Name' })} *
              </label>
              <input
                type='text'
                required
                list='company-suggestions'
                placeholder='e.g. Acme Corp'
                value={formData.company_name}
                onChange={(e) =>
                  setFormData({ ...formData, company_name: e.target.value })
                }
                className='h-10 px-3 border border-slate-300 rounded-xl font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all'
              />
              <datalist id='company-suggestions'>
                {companyOptions.map((comp) => (
                  <option key={comp} value={comp} />
                ))}
              </datalist>
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-slate-700 tracking-wide flex items-center gap-1'>
                <CategoryOutlinedIcon sx={{ fontSize: 14 }} className='text-slate-400' />
                {t('jobs.department', { defaultValue: 'Department' })}
              </label>
              <input
                type='text'
                placeholder='e.g. Engineering, Sales'
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className='h-10 px-3 border border-slate-300 rounded-xl font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all'
              />
            </div>
          </div>

          {/* Location & Job Type */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-slate-700 tracking-wide flex items-center gap-1'>
                <LocationOnOutlinedIcon sx={{ fontSize: 14 }} className='text-slate-400' />
                {t('jobs.location', { defaultValue: 'Location' })}
              </label>
              <input
                type='text'
                placeholder='e.g. Remote / New York, NY'
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className='h-10 px-3 border border-slate-300 rounded-xl font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all'
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <label className='font-bold text-slate-700 tracking-wide'>
                {t('jobs.jobType', { defaultValue: 'Employment Type' })}
              </label>
              <SelectDropdown
                value={formData.job_type}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, job_type: val }))
                }
                options={[
                  { value: 'full-time', label: 'Full-time' },
                  { value: 'part-time', label: 'Part-time' },
                  { value: 'contract', label: 'Contract' },
                  { value: 'internship', label: 'Internship' },
                ]}
                variant='form'
                theme='emerald'
              />
            </div>
          </div>

          {/* Status */}
          <div className='flex flex-col gap-1.5'>
            <label className='font-bold text-slate-700 tracking-wide'>
              {t('jobs.status', { defaultValue: 'Initial Status' })}
            </label>
            <div className='flex items-center gap-3'>
              {[
                { value: 'active', label: 'Active', color: 'emerald' },
                { value: 'draft', label: 'Draft', color: 'slate' },
                { value: 'closed', label: 'Closed', color: 'rose' },
              ].map((st) => (
                <button
                  key={st.value}
                  type='button'
                  onClick={() => setFormData({ ...formData, status: st.value })}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    formData.status === st.value
                      ? 'border-[#10b981] bg-emerald-50/70 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div className='flex flex-col gap-1.5'>
            <label className='font-bold text-slate-700 tracking-wide flex items-center gap-1'>
              <DescriptionOutlinedIcon sx={{ fontSize: 14 }} className='text-slate-400' />
              {t('jobs.description', { defaultValue: 'Job Description / Notes' })}
            </label>
            <RichTextEditor
              value={formData.job_description}
              onChange={(html) =>
                setFormData((prev) => ({ ...prev, job_description: html }))
              }
              placeholder='Add role requirements, qualifications, or key responsibilities...'
              minHeight='130px'
            />
          </div>
        </form>

        {/* Footer Actions */}
        <div className='p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3'>
          <button
            type='button'
            onClick={onClose}
            disabled={createJobMutation.isPending}
            className='px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50'
          >
            {t('common.cancel', { defaultValue: 'Cancel' })}
          </button>
          <button
            type='submit'
            form='create-job-form'
            disabled={createJobMutation.isPending}
            className='px-6 py-2.5 rounded-xl bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-xs shadow-md shadow-[#10b981]/25 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60'
          >
            {createJobMutation.isPending ? (
              <>
                <span className='w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                <span>{t('common.saving', { defaultValue: 'Saving...' })}</span>
              </>
            ) : (
              <span>{t('jobs.saveJob', { defaultValue: 'Create Job' })}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddJobDrawer;
