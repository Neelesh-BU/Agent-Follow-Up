import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HistoryIcon from '@mui/icons-material/History';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { getUploadHistoryApi, getUploadFailuresApi } from '@/services/api/uploadHistoryService';

const UploadHistoryModal = ({ isOpen, onClose, schedulerId }) => {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [expandedUploadId, setExpandedUploadId] = useState(null);
  const [failures, setFailures] = useState({});
  const [loadingFailures, setLoadingFailures] = useState({});
  const [failureErrors, setFailureErrors] = useState({});
  const [expandedFailures, setExpandedFailures] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    let ignore = false;
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        const data = await getUploadHistoryApi(schedulerId);
        if (!ignore) {
          setHistory(data || []);
          setCurrentPage(1);
        }
      } catch (err) {
        if (!ignore) {
          setErrorMsg(err.message || 'Failed to load upload history.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      fetchHistory();
    }
    return () => {
      ignore = true;
    };
  }, [isOpen, schedulerId]);

  const fetchFailuresForUpload = async (uploadId) => {
    try {
      setLoadingFailures(prev => ({ ...prev, [uploadId]: true }));
      setFailureErrors(prev => ({ ...prev, [uploadId]: null }));
      const data = await getUploadFailuresApi(uploadId);
      setFailures(prev => ({ ...prev, [uploadId]: data || [] }));
    } catch (err) {
      console.error('Failed to load failures:', err);
      setFailureErrors(prev => ({ ...prev, [uploadId]: err.message || 'Failed to load details' }));
    } finally {
      setLoadingFailures(prev => ({ ...prev, [uploadId]: false }));
    }
  };

  const toggleExpand = (uploadId) => {
    if (expandedUploadId === uploadId) {
      setExpandedUploadId(null);
      return;
    }
    
    setExpandedUploadId(uploadId);
    
    // Fetch failures if we haven't already
    if (!failures[uploadId] && !failureErrors[uploadId]) {
      fetchFailuresForUpload(uploadId);
    }
  };

  const toggleFailureExpand = (failId) => {
    setExpandedFailures(prev => ({ ...prev, [failId]: !prev[failId] }));
  };

  if (!isOpen) return null;

  const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const paginatedHistory = history.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className='fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto'>
      <div className='bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200 my-auto overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-5 border-b rounded-t-2xl border-slate-100 bg-slate-50/70 shrink-0'>
          <div className='flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2'>
            <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner shrink-0'>
              <HistoryIcon sx={{ fontSize: 20 }} />
            </div>
            <div className='min-w-0'>
              <h2 className='text-base sm:text-lg font-black text-slate-800 tracking-tight truncate'>
                Upload History
              </h2>
              <p className='text-[11px] sm:text-[12px] text-slate-500 font-medium line-clamp-1'>
                Review past 50 CSV uploads and check detailed error reports.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className='w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors font-bold text-sm cursor-pointer shrink-0'
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className='p-3 sm:p-6 overflow-y-auto flex-1 bg-slate-50/30'>
          {errorMsg && (
            <div className='mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2'>
              <ErrorOutlineIcon sx={{ fontSize: 18 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {loading ? (
            <div className='flex items-center justify-center py-12'>
              <div className='w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin'></div>
            </div>
          ) : history.length === 0 ? (
            <div className='text-center py-12 text-slate-500 text-sm font-medium'>
              No upload history found.
            </div>
          ) : (
            <div className='flex flex-col gap-2.5 sm:gap-3'>
              {paginatedHistory.map((upload) => (
                <div key={upload.id} className='bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs'>
                  {/* Upload Row */}
                  <button 
                    type="button"
                    className={`w-full text-left flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 gap-3 cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-inset focus:ring-indigo-500 ${upload.failed_count > 0 ? 'hover:bg-rose-50/30' : 'hover:bg-slate-50'}`}
                    onClick={() => toggleExpand(upload.id)}
                  >
                    {/* Left: Filename & Metadata */}
                    <div className='flex flex-col gap-1 min-w-0 flex-1'>
                      <div className='font-bold text-slate-800 text-xs sm:text-sm break-all sm:break-normal leading-snug'>
                        {upload.filename}
                      </div>
                      <div className='text-[11px] sm:text-xs text-slate-500 font-medium flex flex-wrap items-center gap-x-2 gap-y-0.5'>
                        <span>{new Date(upload.createdAt).toLocaleString()}</span>
                        {upload.scheduler && (
                          <>
                            <span className='text-slate-300 hidden sm:inline'>•</span>
                            <span className='text-slate-600 font-semibold'>
                              Scheduler: {upload.scheduler.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Right: Badges & Expand Indicator */}
                    <div className='flex items-center justify-between sm:justify-end gap-2.5 sm:gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100'>
                      <div className='flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold flex-wrap'>
                        <div className='inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 text-[11px] sm:text-xs'>
                          <CheckCircleIcon sx={{ fontSize: 14 }} />
                          <span>{upload.success_count} Success</span>
                        </div>
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] sm:text-xs ${upload.failed_count > 0 ? 'text-rose-700 bg-rose-50 border-rose-200/60' : 'text-slate-500 bg-slate-50 border-slate-200/60'}`}>
                          <ErrorOutlineIcon sx={{ fontSize: 14 }} />
                          <span>{upload.failed_count} Failed</span>
                        </div>
                        <div className='text-slate-500 text-[11px] sm:text-xs font-medium sm:border-l sm:border-slate-200 sm:pl-3'>
                          {upload.total_records} Total
                        </div>
                      </div>
                      
                      <div className='text-slate-400 shrink-0 ml-1'>
                        {expandedUploadId === upload.id ? <ExpandLessIcon sx={{ fontSize: 20 }} /> : <ExpandMoreIcon sx={{ fontSize: 20 }} />}
                      </div>
                    </div>
                  </button>
                  
                  {/* Expanded Failures Section */}
                  {expandedUploadId === upload.id && (
                    <div className='border-t border-slate-100 bg-slate-50 p-3 sm:p-4'>
                      <h4 className='text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5'>
                        Failed Records Details
                      </h4>
                      
                      {upload.failed_count === 0 ? (
                        <div className='text-xs sm:text-sm text-emerald-600 font-medium py-2 flex items-center gap-2'>
                          <CheckCircleIcon sx={{ fontSize: 18 }} />
                          All records in this file were processed successfully!
                        </div>
                      ) : loadingFailures[upload.id] ? (
                        <div className='flex items-center gap-2 text-xs sm:text-sm text-slate-500 py-2'>
                          <div className='w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin'></div>
                          Loading details...
                        </div>
                      ) : failureErrors[upload.id] ? (
                        <div className='flex items-center gap-3 text-xs sm:text-sm text-rose-600 py-2 bg-rose-50/50 px-3 rounded-lg border border-rose-100'>
                          <ErrorOutlineIcon sx={{ fontSize: 18 }} />
                          <span className='break-all'>{failureErrors[upload.id]}</span>
                          <button
                            type='button'
                            onClick={() => fetchFailuresForUpload(upload.id)}
                            className='ml-auto text-xs font-bold px-3 py-1.5 bg-white border border-rose-200 rounded text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 shrink-0'
                          >
                            Retry
                          </button>
                        </div>
                      ) : failures[upload.id]?.length > 0 ? (
                        <div className='overflow-x-auto border border-slate-200 rounded-lg'>
                          <table className='w-full text-left text-xs sm:text-sm'>
                            <thead className='bg-slate-100 text-slate-600 text-[10px] sm:text-xs uppercase font-bold'>
                              <tr>
                                <th className='px-3 sm:px-4 py-2 w-14 sm:w-16'>Row</th>
                                <th className='px-3 sm:px-4 py-2'>Failure Reason</th>
                                <th className='px-3 sm:px-4 py-2 w-28 sm:w-1/3'>Raw Data</th>
                              </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-200 bg-white'>
                              {failures[upload.id].map((fail) => (
                                <React.Fragment key={fail.id}>
                                  <tr className='hover:bg-slate-50/50'>
                                    <td className='px-3 sm:px-4 py-2 sm:py-2.5 font-semibold text-slate-700'>{fail.row_number}</td>
                                    <td className='px-3 sm:px-4 py-2 sm:py-2.5 text-rose-600 font-medium break-words'>{fail.reason}</td>
                                    <td className='px-3 sm:px-4 py-2 sm:py-2.5'>
                                      <button 
                                        type="button"
                                        onClick={() => toggleFailureExpand(fail.id)}
                                        className='text-[10px] sm:text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg'
                                      >
                                        {expandedFailures[fail.id] ? 'Hide Data' : 'View Data'}
                                      </button>
                                    </td>
                                  </tr>
                                  {expandedFailures[fail.id] && (
                                    <tr className='bg-slate-50 border-t border-slate-100'>
                                      <td colSpan={3} className='px-4 sm:px-6 py-3 sm:py-4'>
                                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3'>
                                          {Object.entries(fail.row_data).filter(([_, v]) => v !== undefined && v !== null && v !== '').map(([key, val]) => (
                                            <div key={key} className='flex flex-col'>
                                              <span className='font-bold text-slate-400 uppercase text-[9px] tracking-wider mb-0.5'>{key}</span>
                                              <span className='text-slate-700 text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200 truncate'>{val}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className='text-xs sm:text-sm text-slate-500 py-2'>
                          No detailed records found.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className='flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t rounded-b-2xl border-slate-100 bg-white shrink-0 flex-wrap gap-2'>
          {totalPages > 1 ? (
            <div className='flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm'>
              <button
                type='button'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className='px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                Prev
              </button>
              <span className='font-medium text-slate-500 px-1 sm:px-2'>
                {currentPage} / {totalPages}
              </span>
              <button
                type='button'
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className='px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                Next
              </button>
            </div>
          ) : (
            <div></div>
          )}
          <button
            onClick={onClose}
            className='px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors ml-auto cursor-pointer'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadHistoryModal;
