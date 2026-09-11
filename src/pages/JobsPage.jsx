import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import useNotification from '@/hooks/useNotification';
import {
  useJobsQuery,
  useCompaniesQuery,
  useDeleteJobMutation,
  useUpdateJobMutation,
} from '@/hooks/queries/useJobQueries';
import AddJobDrawer from '@/components/jobs/AddJobDrawer';
import DeleteJobModal from '@/components/jobs/DeleteJobModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PaginationBar from '@/components/common/PaginationBar';
import SelectDropdown from '@/components/common/SelectDropdown';
import { plainDate } from '@/utils/formatters';

export const JobsPage = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedJobForView, setSelectedJobForView] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const queryParams = useMemo(() => {
    const p = { page, limit: pageSize };
    if (search.trim()) p.search = search.trim();
    if (selectedCompany) p.company_name = selectedCompany;
    if (selectedStatus) p.status = selectedStatus;
    return p;
  }, [page, pageSize, search, selectedCompany, selectedStatus]);

  const { data: jobsResponse, isLoading, isFetching } = useJobsQuery(queryParams);
  const { data: companiesResponse } = useCompaniesQuery();

  const deleteJobMutation = useDeleteJobMutation();
  const updateJobMutation = useUpdateJobMutation();

  const jobsList = jobsResponse?.data || [];
  const pagination = jobsResponse?.pagination || {
    page: 1,
    limit: pageSize,
    totalPages: 1,
    totalResults: jobsList.length,
  };
  const companiesList = companiesResponse?.data || [];

  // Summary counts
  const totalJobsCount = pagination.totalResults || jobsList.length;
  const activeJobsCount = jobsList.filter((j) => j.status?.toLowerCase() === 'active').length;

  const handleConfirmDelete = async (jobId) => {
    try {
      await deleteJobMutation.mutateAsync(jobId);
      showSuccess(`Job #${jobId} deleted successfully`);
    } catch (err) {
      showError(err.response?.data?.message || err.message || 'Failed to delete job');
      throw err;
    }
  };

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      await updateJobMutation.mutateAsync({
        jobId: job.job_id,
        data: { status: nextStatus },
      });
      showSuccess(`Job #${job.job_id} is now ${nextStatus}`);
    } catch (err) {
      showError(err.response?.data?.message || err.message || 'Failed to update job status');
    }
  };

  return (
    <div className='p-6 md:p-8 max-w-7xl mx-auto space-y-6'>
      {/* Top Header / Banner */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs'>
        <div className='flex items-center gap-4'>
          <div className='w-12 h-12 rounded-2xl bg-linear-to-br from-[#10b981] to-[#059669] text-white flex items-center justify-center shadow-md shadow-[#10b981]/25'>
            <WorkOutlineOutlinedIcon sx={{ fontSize: 26 }} />
          </div>
          <div>
            <h1 className='text-xl font-black text-slate-900 tracking-tight'>
              {t('jobs.pageTitle', { defaultValue: 'Job Openings & Roles' })}
            </h1>
            <p className='text-xs font-semibold text-slate-500 mt-0.5'>
              {t('jobs.pageSubtitle', {
                defaultValue:
                  'Manage master job IDs, company roles, and follow-up templates',
              })}
            </p>
          </div>
        </div>

        {/* Top Action Button to open Side Panel */}
        <button
          type='button'
          onClick={() => setIsDrawerOpen(true)}
          className='px-5 py-2.5 rounded-xl bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold text-xs shadow-md shadow-[#10b981]/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0'
        >
          <AddOutlinedIcon sx={{ fontSize: 18 }} />
          <span>{t('jobs.addJobBtn', { defaultValue: 'Add New Job' })}</span>
        </button>
      </div>

      {/* Quick Metrics Bar */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between'>
          <div>
            <span className='text-[11px] font-bold text-slate-500 uppercase tracking-wider'>
              Total Jobs
            </span>
            <div className='text-xl font-black text-slate-900 mt-0.5'>
              {totalJobsCount}
            </div>
          </div>
          <div className='w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs'>
            #
          </div>
        </div>

        <div className='bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between'>
          <div>
            <span className='text-[11px] font-bold text-slate-500 uppercase tracking-wider'>
              Active Positions
            </span>
            <div className='text-xl font-black text-[#10b981] mt-0.5'>
              {activeJobsCount}
            </div>
          </div>
          <div className='w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center'>
            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
          </div>
        </div>

        <div className='bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-between'>
          <div>
            <span className='text-[11px] font-bold text-slate-500 uppercase tracking-wider'>
              Companies
            </span>
            <div className='text-xl font-black text-blue-600 mt-0.5'>
              {companiesList.length}
            </div>
          </div>
          <div className='w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center'>
            <BusinessOutlinedIcon sx={{ fontSize: 18 }} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className='bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3'>
        {/* Search */}
        <div className='relative flex-1'>
          <SearchOutlinedIcon
            sx={{ fontSize: 18 }}
            className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          />
          <input
            type='text'
            placeholder='Search by Job ID, Title, or Company...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className='w-full h-10 pl-9 pr-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all'
          />
        </div>

        {/* Company Filter */}
        <div className='flex flex-wrap items-center gap-2'>
          <FilterListOutlinedIcon sx={{ fontSize: 16 }} className='text-slate-400 hidden sm:block' />
          <SelectDropdown
            value={selectedCompany}
            onChange={(val) => {
              setSelectedCompany(val);
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Companies' },
              ...companiesList.map((comp) => ({ value: comp, label: comp })),
            ]}
            variant='default'
            theme='emerald'
            className='min-w-44'
          />

          {/* Status Filter */}
          <SelectDropdown
            value={selectedStatus}
            onChange={(val) => {
              setSelectedStatus(val);
              setPage(1);
            }}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'draft', label: 'Draft' },
              { value: 'closed', label: 'Closed' },
            ]}
            variant='default'
            theme='emerald'
            className='min-w-36'
          />
        </div>
      </div>

      {/* Table Container */}
      <div className='bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden'>
        {isLoading ? (
          <div className='p-16 flex items-center justify-center'>
            <LoadingSpinner />
          </div>
        ) : jobsList.length === 0 ? (
          <div className='py-20 px-6 flex flex-col items-center justify-center text-center'>
            <div className='w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 border border-emerald-100'>
              <WorkOutlineOutlinedIcon sx={{ fontSize: 32 }} />
            </div>
            <h3 className='text-base font-extrabold text-slate-900'>No jobs found</h3>
            <p className='text-xs font-semibold text-slate-500 max-w-sm mt-1 mb-5'>
              {search || selectedCompany || selectedStatus
                ? 'Try adjusting your search query or filters to find what you are looking for.'
                : 'No job openings have been created yet. Open the side panel to add your first job!'}
            </p>
            <button
              type='button'
              onClick={() => setIsDrawerOpen(true)}
              className='px-5 py-2.5 rounded-xl bg-linear-to-r from-[#10b981] to-[#059669] text-white font-bold text-xs shadow-md shadow-[#10b981]/25 hover:opacity-95 transition-opacity flex items-center gap-1.5 cursor-pointer'
            >
              <AddOutlinedIcon sx={{ fontSize: 16 }} />
              <span>Add First Job</span>
            </button>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='border-b border-slate-200 bg-slate-50/70 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider'>
                  <th className='py-3.5 px-4'>Job ID</th>
                  <th className='py-3.5 px-4'>Job Title & Role</th>
                  <th className='py-3.5 px-4'>Company</th>
                  <th className='py-3.5 px-4'>Location / Type</th>
                  <th className='py-3.5 px-4'>Status</th>
                  <th className='py-3.5 px-4'>Created Date</th>
                  <th className='py-3.5 px-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 text-xs'>
                {jobsList.map((job) => {
                  const isActive = job.status?.toLowerCase() === 'active';
                  const isClosed = job.status?.toLowerCase() === 'closed';

                  return (
                    <tr
                      key={job.job_id}
                      className='hover:bg-slate-50/80 transition-colors group'
                    >
                      {/* Job ID */}
                      <td className='py-3.5 px-4 font-mono font-bold text-slate-900'>
                        <span className='px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-xs'>
                          #{job.job_id}
                        </span>
                      </td>

                      {/* Job Title & Department */}
                      <td className='py-3.5 px-4'>
                        <div className='font-bold text-slate-900 leading-tight'>
                          {job.job_title}
                        </div>
                        {job.department && (
                          <div className='text-[11px] font-semibold text-slate-500 mt-0.5'>
                            {job.department}
                          </div>
                        )}
                      </td>

                      {/* Company Name */}
                      <td className='py-3.5 px-4'>
                        <span className='inline-flex items-center gap-1 font-semibold text-slate-800'>
                          <BusinessOutlinedIcon
                            sx={{ fontSize: 14 }}
                            className='text-slate-400'
                          />
                          {job.company_name}
                        </span>
                      </td>

                      {/* Location & Type */}
                      <td className='py-3.5 px-4'>
                        <div className='font-semibold text-slate-700'>
                          {job.location || 'Remote'}
                        </div>
                        <div className='text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5'>
                          {job.job_type || 'Full-time'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className='py-3.5 px-4'>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold capitalize ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isClosed
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive
                                ? 'bg-emerald-500'
                                : isClosed
                                ? 'bg-rose-500'
                                : 'bg-slate-400'
                            }`}
                          />
                          {job.status || 'Active'}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className='py-3.5 px-4 text-slate-600 font-medium text-[11px]'>
                        {job.createdAt ? plainDate(job.createdAt) : '-'}
                      </td>

                      {/* Actions */}
                      <td className='py-3.5 px-4 text-right'>
                        <div className='inline-flex items-center gap-1.5'>
                          <button
                            type='button'
                            onClick={() => setSelectedJobForView(job)}
                            title='View Job Details'
                            className='p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer'
                          >
                            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                          </button>
                          <button
                            type='button'
                            onClick={() => handleToggleStatus(job)}
                            title={isActive ? 'Deactivate Job' : 'Activate Job'}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                              isActive
                                ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            {isActive ? (
                              <PauseCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                            ) : (
                              <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                            )}
                          </button>
                          <button
                            type='button'
                            onClick={() => setJobToDelete(job)}
                            title='Delete Job'
                            className='p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer'
                          >
                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className='p-4 border-t border-slate-100 bg-slate-50/50'>
            <PaginationBar
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              isLoading={isFetching}
            />
          </div>
        )}
      </div>

      {/* Side Panel for Adding New Jobs */}
      <AddJobDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* View Job Details Modal */}
      {selectedJobForView && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150'>
          <div className='bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200'>
            {/* Modal Header */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80'>
              <div className='flex items-center gap-3'>
                <span className='px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold text-xs'>
                  #{selectedJobForView.job_id}
                </span>
                <div>
                  <h3 className='text-base font-extrabold text-slate-900 leading-none'>
                    {selectedJobForView.job_title}
                  </h3>
                  <span className='text-xs font-semibold text-slate-500 mt-1 inline-block'>
                    {selectedJobForView.company_name} {selectedJobForView.department ? `• ${selectedJobForView.department}` : ''}
                  </span>
                </div>
              </div>
              <button
                type='button'
                onClick={() => setSelectedJobForView(null)}
                className='w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer'
              >
                <CloseOutlinedIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            {/* Modal Content */}
            <div className='p-6 overflow-y-auto space-y-4'>
              {/* Badges */}
              <div className='flex flex-wrap items-center gap-2 text-xs'>
                <span className='px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold'>
                  📍 {selectedJobForView.location || 'Remote'}
                </span>
                <span className='px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold uppercase'>
                  💼 {selectedJobForView.job_type || 'Full-time'}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg font-bold capitalize ${
                    selectedJobForView.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {selectedJobForView.status}
                </span>
              </div>

              {/* Formatted Description */}
              <div className='mt-2'>
                <h4 className='text-xs font-bold text-slate-700 uppercase tracking-wider mb-2'>
                  Job Description & Requirements
                </h4>
                {selectedJobForView.job_description ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedJobForView.job_description,
                    }}
                    className='p-4 rounded-xl bg-slate-50/60 border border-slate-200/80 text-xs text-slate-800 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-1 [&_strong]:font-bold [&_strong]:text-slate-900 [&_em]:italic [&_u]:underline'
                  />
                ) : (
                  <div className='p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400 italic'>
                    No description provided for this position.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className='px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-end'>
              <button
                type='button'
                onClick={() => setSelectedJobForView(null)}
                className='px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Job Confirmation Modal */}
      <DeleteJobModal
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleConfirmDelete}
        job={jobToDelete}
        isLoading={deleteJobMutation.isPending}
      />
    </div>
  );
};

export default JobsPage;
