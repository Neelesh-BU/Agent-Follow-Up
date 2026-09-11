import { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SelectDropdown from '@/components/common/SelectDropdown';
import { useSchedulersQuery } from '@/hooks/queries/useSchedulerQueries';

export const UploadCandidateModal = ({
  isOpen = false,
  onClose,
  onUpload, // ({ file, schedulerId }) => Promise<void>
  schedulers = [],
  isMaster = false,
  defaultSchedulerId = '',
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  // Reliable query fallback for schedulers
  const { data: schedulersQueryData } = useSchedulersQuery({
    enabled: Boolean(isMaster && isOpen),
  });

  const availableSchedulers = useMemo(() => {
    if (schedulers && schedulers.length > 0) return schedulers;
    if (
      schedulersQueryData?.schedulers &&
      schedulersQueryData.schedulers.length > 0
    ) {
      return schedulersQueryData.schedulers;
    }
    return [];
  }, [schedulers, schedulersQueryData?.schedulers]);

  const schedulerOptions = useMemo(() => {
    return availableSchedulers.map((sch) => {
      const id = sch.id || sch._id || sch.user_id || '';
      const name = sch.name || sch.full_name || sch.username || 'Scheduler';
      const email = sch.email || sch.emailId || '';
      return {
        value: id,
        name: name,
        label: name,
        subLabel: email,
        email: email,
      };
    });
  }, [availableSchedulers]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedScheduler, setSelectedScheduler] = useState(() => {
    return (
      defaultSchedulerId ||
      schedulers[0]?.id ||
      schedulerOptions[0]?.value ||
      ''
    );
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setErrorMsg('');

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    setErrorMsg('');
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const validExtensions = ['.csv'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setErrorMsg(
        t('modals.invalidFileFormat', {
          defaultValue: 'Please upload a valid CSV (.csv) file.',
        }),
      );
      setSelectedFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(
        t('modals.fileTooLarge', {
          defaultValue: 'File size exceeds 10MB limit.',
        }),
      );
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg(
        t('modals.selectFileRequired', {
          defaultValue: 'Please select a spreadsheet file to upload.',
        }),
      );
      return;
    }

    if (isMaster && !selectedScheduler && schedulerOptions.length > 0) {
      setErrorMsg(
        t('modals.selectSchedulerRequired', {
          defaultValue: 'Please choose which scheduler to assign this file to.',
        }),
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      await onUpload?.({
        file: selectedFile,
        schedulerId: selectedScheduler,
      });
      setSelectedFile(null);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150'>
      <div className='bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/70'>
          <div className='flex items-center gap-2.5'>
            <div className='w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-[#059669] flex items-center justify-center shrink-0'>
              <CloudUploadOutlinedIcon sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h2 className='text-base font-black text-slate-900 tracking-tight'>
                {t('dashboard.uploadCandidate', {
                  defaultValue: 'Upload Candidates',
                })}
              </h2>
              <p className='text-[11px] text-slate-500 font-medium'>
                {t('modals.uploadRosterSubtitle', {
                  defaultValue:
                    'Upload spreadsheet roster to schedule automated calls',
                })}
              </p>
            </div>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors font-bold text-sm cursor-pointer'
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className='p-6 flex flex-col gap-4.5'>
          {/* Error Banner */}
          {errorMsg && (
            <div className='flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl animate-in fade-in duration-150'>
              <ErrorOutlineIcon sx={{ fontSize: 16 }} className='shrink-0 mt-0.5' />
              <div className='flex-1'>{errorMsg}</div>
            </div>
          )}

          {/* Master Scheduler: Assign Scheduler Dropdown */}
          {isMaster && (
            <div className='flex flex-col gap-1.5'>
              <label className='text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between'>
                <span>
                  {t('modals.assignScheduler', {
                    defaultValue: 'Assign Scheduler',
                  })}{' '}
                  *
                </span>
                <span className='text-[10px] text-slate-400 font-normal normal-case'>
                  (Uploaded by / assigned to)
                </span>
              </label>
              <SelectDropdown
                value={selectedScheduler}
                onChange={(val) => {
                  setSelectedScheduler(val);
                  setErrorMsg('');
                }}
                options={schedulerOptions}
                placeholder={t('dashboard.chooseSchedulerForUpload', {
                  defaultValue: '-- Choose scheduler for uploaded records --',
                })}
                variant='form'
                className='w-full'
              />
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div className='flex flex-col gap-1.5'>
            <label className='text-xs font-bold text-slate-700 uppercase tracking-wide'>
              {t('modals.candidateSpreadsheet', {
                defaultValue: 'Candidate Spreadsheet',
              })}{' '}
              *
            </label>

            {!selectedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
                  isDragging
                    ? 'border-[#10b981] bg-emerald-50/60 scale-[0.99]'
                    : 'border-slate-300 hover:border-[#10b981] hover:bg-emerald-50/30 bg-slate-50/30'
                }`}
              >
                <div className='w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-[#059669]'>
                  <CloudUploadOutlinedIcon sx={{ fontSize: 28 }} />
                </div>
                <div>
                  <span className='text-xs font-bold text-[#059669] hover:underline'>
                    Click to browse
                  </span>{' '}
                  <span className='text-xs text-slate-500 font-medium'>
                    or drag and drop your spreadsheet
                  </span>
                </div>
                <div className='flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold'>
                  <span className='px-2 py-0.5 bg-slate-100 rounded-md'>.csv</span>
                  <span>(Max 10 MB)</span>
                </div>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='.csv'
                  onChange={handleFileChange}
                  className='hidden'
                />
              </div>
            ) : (
              /* Selected File Preview Box */
              <div className='p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in zoom-in-95 duration-150'>
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='w-10 h-10 rounded-xl bg-linear-to-tr from-[#10b981] to-[#059669] text-white flex items-center justify-center shrink-0 shadow-xs'>
                    <InsertDriveFileOutlinedIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div className='min-w-0'>
                    <div className='text-xs font-extrabold text-slate-800 truncate'>
                      {selectedFile.name}
                    </div>
                    <div className='text-[11px] font-semibold text-slate-500 flex items-center gap-2 mt-0.5'>
                      <span>{formatFileSize(selectedFile.size)}</span>
                      <span>•</span>
                      <span className='inline-flex items-center gap-1 text-emerald-600 font-bold'>
                        <CheckCircleOutlineIcon sx={{ fontSize: 13 }} /> Ready
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type='button'
                  onClick={handleRemoveFile}
                  className='p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0'
                  title='Remove file'
                >
                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            )}
          </div>

          {/* Quick Guidance Card */}
          <div className='p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-500 font-medium leading-relaxed'>
            <span className='font-bold text-slate-700 block mb-0.5'>
              Supported Column Headers:
            </span>
            <span>
              Candidate Name, Phone Number, Interview Date, Interview Time, Company, Job Role
            </span>
          </div>

          {/* Modal Footer */}
          <div className='flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100'>
            <button
              type='button'
              onClick={onClose}
              disabled={isSubmitting}
              className='px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer'
            >
              {t('common.cancel', { defaultValue: 'Cancel' })}
            </button>
            <button
              type='submit'
              disabled={isSubmitting || !selectedFile}
              className='px-5 py-2.5 bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md shadow-[#10b981]/25 transition-all cursor-pointer inline-flex items-center gap-2'
            >
              {isSubmitting ? (
                <>
                  <span className='w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin'></span>
                  <span>{t('common.submitting', { defaultValue: 'Uploading...' })}</span>
                </>
              ) : (
                <>
                  <CloudUploadOutlinedIcon sx={{ fontSize: 16 }} />
                  <span>
                    {t('modals.uploadAndAssign', {
                      defaultValue: 'Upload Candidates',
                    })}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadCandidateModal;
