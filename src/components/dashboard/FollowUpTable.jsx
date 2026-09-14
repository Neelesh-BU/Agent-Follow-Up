import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CallIcon from '@mui/icons-material/Call';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BusinessIcon from '@mui/icons-material/Business';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import EditCalendarOutlinedIcon from '@mui/icons-material/EditCalendarOutlined';
import StatusBadge from '@/components/common/StatusBadge';
import AudioPlayerModal from './AudioPlayerModal';
import { plainDate, userInitials } from '@/utils/formatters';

// Avatar color hash generator
const getAvatarGradient = (name = '') => {
  const gradients = [
    'from-blue-600 to-cyan-500',
    'from-indigo-600 to-purple-500',
    'from-emerald-600 to-teal-500',
    'from-rose-600 to-pink-500',
    'from-amber-600 to-orange-500',
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) {
    sum += name.charCodeAt(i);
  }
  return gradients[sum % gradients.length];
};

// Custom White Card Tooltip
const CustomTooltip = ({
  title,
  children,
  placement = 'bottom-start',
  ...props
}) => {
  if (!title) return children;
  return (
    <Tooltip
      title={title}
      placement={placement}
      arrow={false}
      enterDelay={150}
      leaveDelay={100}
      slotProps={{
        tooltip: {
          sx: {
            bgcolor: '#ffffff',
            color: '#1e293b',
            fontSize: '12px',
            fontWeight: 700,
            lineHeight: 1.45,
            boxShadow:
              '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            py: 1.25,
            px: 1.75,
            maxWidth: 340,
          },
        },
      }}
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export const FollowUpTable = ({
  rows = [],
  schedulers = [],
  isMaster = false,
  onView,
  onCallNow,
  onMarkCompleted,
  onDelete,
  viewOnly = false,
}) => {
  const { t } = useTranslation();

  const [audioModal, setAudioModal] = useState({
    isOpen: false,
    url: '',
    candidateName: '',
  });

  const schedulerMap = useMemo(() => {
    const map = {};
    schedulers.forEach((s) => {
      const id = s.id || s._id || s.user_id;
      if (id) {
        map[id] = s.name || s.full_name || s.username || s.email;
      }
    });
    return map;
  }, [schedulers]);

  if (!rows.length) {
    return (
      <div className='py-16 px-4 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center'>
        <div className='w-14 h-14 rounded-2xl bg-slate-100/80 text-slate-400 flex items-center justify-center mb-3'>
          <AssignmentOutlinedIcon sx={{ fontSize: 32 }} />
        </div>
        <strong className='block text-sm font-extrabold text-slate-800 tracking-tight'>
          {t('dashboard.emptyRecordsTitle')}
        </strong>
        <p className='text-xs text-slate-400 font-medium max-w-sm mt-1'>
          {t('dashboard.emptyRecordsSubtitle')}
        </p>
      </div>
    );
  }

  return (
    <TableContainer className='relative bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs custom-scrollbar'>
      <Table sx={{ minWidth: 1280 }} aria-label='pipeline detail table'>
        <TableHead className='bg-slate-50/90'>
          <TableRow className='border-b border-slate-200/80'>
            <TableCell
              align='left'
              sx={{
                py: 1.75,
                pl: 3,
                pr: 2,
                fontSize: '10px',
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
                minWidth: 200,
              }}
            >
              {t('table.candidateName')}
            </TableCell>

            <TableCell
              align='center'
              sx={{
                py: 1.75,
                px: 2,
                fontSize: '10px',
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
                minWidth: 150,
              }}
            >
              {t('table.scheduler')}
            </TableCell>

            <TableCell
              align='left'
              sx={{
                py: 1.75,
                px: 2,
                fontSize: '10px',
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
                minWidth: 180,
              }}
            >
              {t('table.interviewCompany')}
            </TableCell>

            <TableCell
              align='left'
              sx={{
                py: 1.75,
                px: 2,
                fontSize: '10px',
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
                minWidth: 180,
              }}
            >
              Job Details
            </TableCell>

            <TableCell
              align='center'
              sx={{
                py: 1.75,
                px: 2,
                fontSize: '10px',
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
                minWidth: 130,
              }}
            >
              {t('table.interviewTime')}
            </TableCell>

            <TableCell
              align='center'
              sx={{
                py: 1.75,
                px: 2,
                fontSize: '10px',
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
                minWidth: 140,
              }}
            >
              {t('table.whatsappResponded')}
            </TableCell>

            <TableCell
              align='center'
              sx={{
                py: 1.75,
                px: 2,
                fontSize: '10px',
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
                minWidth: 150,
              }}
            >
              {t('table.whatsappResponseType')}
            </TableCell>

            <TableCell
              align='center'
              sx={{
                py: 1.75,
                px: 2,
                fontSize: '10px',
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
                minWidth: 130,
              }}
            >
              {t('table.callPipeline')}
            </TableCell>

            <TableCell
              align='center'
              sx={{
                py: 1.75,
                px: 2,
                fontSize: '10px',
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
                minWidth: 150,
              }}
            >
              {t('table.callResponseType')}
            </TableCell>

            <TableCell
              align='center'
              sx={{
                py: 1.75,
                px: 2,
                fontSize: '10px',
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
                minWidth: 110,
              }}
            >
              {t('table.recording')}
            </TableCell>

            <TableCell
              align='center'
              sx={{
                py: 1.75,
                pl: 2,
                pr: 3,
                fontSize: '10px',
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                borderBottom: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
                minWidth: 160,
              }}
            >
              {t('table.actions')}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody className='divide-y divide-slate-100'>
          {rows.map((item, idx) => {
            const statusNorm = String(
              item.call_pipeline || item.status || '',
            ).toLowerCase();
            const isCompleted = [
              'joining_confirmed',
              'recruiter_completed',
              'completed',
            ].includes(statusNorm);
            const locked = viewOnly || isCompleted;

            const candidatePhone =
              item.candidate_phone || item.phone || item.phone_number || '';

            const scheduledAt = item.call_scheduled_at;
            const scheduledTime = scheduledAt
              ? new Date(scheduledAt).getTime()
              : NaN;
            const hasFutureCall =
              Number.isFinite(scheduledTime) && scheduledTime > Date.now();

            // Resolve scheduler name
            const schedulerDisplayName =
              item.scheduler_name ||
              item.scheduler?.name ||
              schedulerMap[item.scheduler_id] ||
              '-';

            // WhatsApp Responded status
            const rawWaStatus = String(
              item.whatsapp_responded ||
                item.candidate_whatsapp_response_status ||
                item.whatsapp_response_status ||
                item.whatsapp_status ||
                '',
            ).trim();

            const isWaResponded = [
              'responded',
              'confirmed',
              'delivered',
              'replied',
              'yes',
            ].includes(rawWaStatus.toLowerCase());

            const isWaSent = ['sent', 'queued'].includes(
              rawWaStatus.toLowerCase(),
            );

            const waRespondedLabel = rawWaStatus || '-';

            // WhatsApp Response Type
            const waResponseType =
              item.whatsapp_response_type ||
              item.candidate_whatsapp_response_type ||
              item.whatsapp_response ||
              item.button_response ||
              '-';

            // Call Response Type
            const rawCallResponse =
              item.candidateCallResponseType ||
              item.call_response_type ||
              item.candidate_call_response_type ||
              item.candidate_respond_type ||
              item.response ||
              '';

            const callResponseTypeLabel = rawCallResponse || '-';

            const isRescheduleRequested = [
              'reschedule requested',
              'reschedule_requested',
              'reschedule',
            ].includes(String(rawCallResponse).toLowerCase().trim());

            // Recording URL
            const recordingUrl =
              item.candidate_call_recording ||
              item.recording_url ||
              (typeof item.candidateCallResponse === 'string'
                ? item.candidateCallResponse
                : item.candidateCallResponse?.recording_url) ||
              (typeof item.recording === 'string'
                ? item.recording
                : item.recording?.recording_url) ||
              item.latest_call_recording_url ||
              item.audio_url ||
              '';

            const rowRecordId =
              item.id ||
              item.record_id ||
              `${item.candidate_name}-${idx}`;

            const avatarGrad = getAvatarGradient(
              item.candidate_name || 'Candidate',
            );

            return (
              <TableRow
                key={rowRecordId}
                hover
                sx={{
                  '&:hover': { backgroundColor: '#f8fafc' },
                  transition: 'background-color 0.15s ease',
                }}
              >
                {/* 1 - Candidate Info with Avatar */}
                <TableCell
                  align='left'
                  sx={{
                    py: 1.75,
                    pl: 3,
                    pr: 2,
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle',
                  }}
                >
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-8 h-8 rounded-xl bg-linear-to-tr ${avatarGrad} text-white font-black text-xs grid place-items-center shrink-0 shadow-2xs`}
                    >
                      {userInitials(item.candidate_name)}
                    </div>
                    <div className='min-w-0'>
                      <CustomTooltip
                        title={item.candidate_name || ''}
                        placement='bottom-start'
                      >
                        <div className='font-bold text-slate-900 text-xs truncate max-w-44 cursor-pointer'>
                          {item.candidate_name}
                        </div>
                      </CustomTooltip>
                      {candidatePhone && (
                        <div className='flex items-center gap-1 mt-0.5 text-[11px] text-slate-500 font-medium select-text'>
                          <PhoneOutlinedIcon sx={{ fontSize: 11, color: '#94a3b8' }} />
                          <span>{candidatePhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>

                {/* 2 - Scheduler (Centered) */}
                <TableCell
                  align='center'
                  sx={{
                    py: 1.75,
                    px: 2,
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle',
                  }}
                >
                  <CustomTooltip
                    title={schedulerDisplayName}
                    placement='bottom'
                  >
                    <span className='inline-flex items-center justify-center px-2.5 py-1 bg-slate-100/90 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200/60 max-w-35 truncate cursor-default'>
                      {schedulerDisplayName}
                    </span>
                  </CustomTooltip>
                </TableCell>

                {/* 3 - Interview Company with Custom Tooltip */}
                <TableCell
                  align='left'
                  sx={{
                    py: 1.75,
                    px: 2,
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle',
                  }}
                >
                  <CustomTooltip
                    title={item.interview_company || 'No Company'}
                    placement='bottom-start'
                  >
                    <div className='flex items-center gap-1.5 font-bold text-slate-800 text-xs max-w-48 cursor-pointer'>
                      <BusinessIcon
                        sx={{ fontSize: 14, color: '#94a3b8', flexShrink: 0 }}
                      />
                      <span className='truncate'>
                        {item.interview_company || '-'}
                      </span>
                    </div>
                  </CustomTooltip>
                </TableCell>

                {/* 3.5 - Job Details with Custom Tooltip */}
                <TableCell
                  align='left'
                  sx={{
                    py: 1.75,
                    px: 2,
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle',
                  }}
                >
                  <CustomTooltip
                    title={
                      item.job_title
                        ? `${item.job_title} ${item.job_id ? `(#${item.job_id})` : ''}`
                        : item.job_id || 'No Job Details'
                    }
                    placement='bottom-start'
                  >
                    <div className='flex items-start gap-1.5 cursor-pointer max-w-48'>
                      <WorkOutlineOutlinedIcon
                        sx={{ fontSize: 14, color: '#94a3b8', flexShrink: 0, mt: '1px' }}
                      />
                      <div className='min-w-0'>
                        <div className='font-bold text-slate-800 text-xs truncate'>
                          {item.job_title || item.job_id || '-'}
                        </div>
                        {item.job_id && item.job_title && (
                          <div className='text-[10px] font-semibold text-slate-400 truncate'>
                            ID: {item.job_id}
                          </div>
                        )}
                      </div>
                    </div>
                  </CustomTooltip>
                </TableCell>

                {/* 4 - Interview Time */}
                <TableCell
                  align='center'
                  sx={{
                    py: 1.75,
                    px: 2,
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle',
                  }}
                >
                  <div className='inline-flex flex-col items-center justify-center'>
                    {item.interview_date && (
                      <span className='font-bold text-slate-800 text-xs whitespace-nowrap'>
                        {item.interview_date}
                      </span>
                    )}
                    {item.interview_time && (
                      <span className='text-[11px] text-slate-500 font-medium whitespace-nowrap mt-0.5'>
                        {item.interview_time}
                      </span>
                    )}
                    {!item.interview_date && !item.interview_time && (
                      <span className='text-slate-400 text-xs font-medium'>
                        -
                      </span>
                    )}
                    {hasFutureCall && (
                      <span className='text-[10px] text-sky-600 font-extrabold mt-0.5 bg-sky-50 px-1.5 py-0.5 rounded'>
                        {t('table.nextCall', { time: plainDate(scheduledAt) })}
                      </span>
                    )}
                  </div>
                </TableCell>

                {/* 5 - Whatsapp Responded */}
                <TableCell
                  align='center'
                  sx={{
                    py: 1.75,
                    px: 2,
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle',
                  }}
                >
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      isWaResponded
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                        : isWaSent
                          ? 'bg-sky-50 text-sky-700 border-sky-200/80'
                          : 'bg-slate-100 text-slate-600 border-slate-200/60'
                    }`}
                  >
                    {waRespondedLabel}
                  </span>
                </TableCell>

                {/* 6 - Whatsapp Response Type */}
                <TableCell
                  align='center'
                  sx={{
                    py: 1.75,
                    px: 2,
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle',
                  }}
                >
                  <span className='font-bold text-slate-700 text-xs'>
                    {waResponseType}
                  </span>
                </TableCell>

                {/* 7 - Call Pipeline */}
                <TableCell
                  align='center'
                  sx={{
                    py: 1.75,
                    px: 2,
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle',
                  }}
                >
                  <div className='inline-flex justify-center'>
                    <StatusBadge
                      status={item.call_pipeline || item.status || '-'}
                    />
                  </div>
                </TableCell>

                {/* 8 - Call Response Type */}
                <TableCell
                  align='center'
                  sx={{
                    py: 1.75,
                    px: 2,
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle',
                  }}
                >
                  <CustomTooltip
                    title={callResponseTypeLabel}
                    placement='bottom'
                  >
                    <div className='font-bold text-slate-800 text-xs truncate max-w-35 mx-auto cursor-default'>
                      {callResponseTypeLabel}
                    </div>
                  </CustomTooltip>
                </TableCell>

                {/* 9 - Audio Recording */}
                <TableCell
                  align='center'
                  sx={{
                    py: 1.75,
                    px: 2,
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle',
                  }}
                >
                  {recordingUrl ? (
                    <button
                      type='button'
                      onClick={() =>
                        setAudioModal({
                          isOpen: true,
                          url: recordingUrl,
                          candidateName: item.candidate_name,
                        })
                      }
                      className='inline-flex items-center justify-center gap-1.5 px-3 py-1 font-bold text-[11px] rounded-lg transition-all border shadow-2xs cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-[#059669] border-emerald-200/80 hover:border-emerald-300 active:scale-95'
                      title={t('common.recording', { defaultValue: 'Play call recording' })}
                    >
                      <GraphicEqIcon sx={{ fontSize: 15 }} />
                      <span>{t('table.play', { defaultValue: 'Listen' })}</span>
                    </button>
                  ) : (
                    <span className='text-slate-400 text-xs font-medium'>
                      {t('common.noAudio')}
                    </span>
                  )}
                </TableCell>

                {/* 10 - Actions */}
                <TableCell
                  align='center'
                  sx={{
                    py: 1.75,
                    pl: 2,
                    pr: 3,
                    borderBottom: '1px solid #f1f5f9',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div className='inline-flex items-center justify-center gap-1.5'>
                    {!locked && item.status === 'not_joining' && (
                      <button
                        type='button'
                        onClick={() =>
                          onMarkCompleted(item.id || item.record_id || item)
                        }
                        className='px-2.5 py-1 bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-[11px] font-extrabold rounded-lg shadow-xs inline-flex items-center gap-1 cursor-pointer transition-all shrink-0'
                      >
                        <CheckCircleOutlineIcon sx={{ fontSize: 13 }} />
                        <span>{t('table.markCompleted')}</span>
                      </button>
                    )}

                    {!locked && (
                      <button
                        type='button'
                        onClick={() => onCallNow(item.id || item.record_id || item)}
                        className='px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold rounded-lg shadow-xs hover:shadow-md inline-flex items-center gap-1 cursor-pointer transition-all shrink-0'
                      >
                        <CallIcon sx={{ fontSize: 12 }} />
                        <span>{t('table.callNow')}</span>
                      </button>
                    )}

                    {isRescheduleRequested ? (
                      <button
                        type='button'
                        onClick={() => onView(item)}
                        className='px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-extrabold rounded-lg shadow-xs hover:shadow-md inline-flex items-center gap-1 cursor-pointer transition-all shrink-0'
                      >
                        <EditCalendarOutlinedIcon sx={{ fontSize: 13 }} />
                        <span>{t('table.reschedule', { defaultValue: 'Reschedule' })}</span>
                      </button>
                    ) : (
                      <button
                        type='button'
                        onClick={() => onView(item)}
                        className='px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-extrabold rounded-lg inline-flex items-center gap-1 cursor-pointer transition-colors shrink-0'
                      >
                        <VisibilityOutlinedIcon sx={{ fontSize: 13 }} />
                        <span>{t('common.view')}</span>
                      </button>
                    )}

                    {!locked && isMaster && (
                      <button
                        type='button'
                        onClick={() => onDelete(item)}
                        className='p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors shrink-0'
                        title={t('common.delete')}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Audio Player Dialog */}
      <AudioPlayerModal
        isOpen={audioModal.isOpen}
        onClose={() =>
          setAudioModal({ isOpen: false, url: '', candidateName: '' })
        }
        audioUrl={audioModal.url}
        candidateName={audioModal.candidateName}
      />
    </TableContainer>
  );
};

export default FollowUpTable;
