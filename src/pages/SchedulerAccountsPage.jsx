import { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import useNotification from '@/hooks/useNotification';
import {
  useSchedulersQuery,
  useSchedulerMutations,
} from '@/hooks/queries/useSchedulerQueries';
import AddSchedulerModal from '@/components/schedulers/AddSchedulerModal';
import DeactivateSchedulerModal from '@/components/schedulers/DeactivateSchedulerModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PaginationBar from '@/components/common/PaginationBar';
import { plainDate } from '@/utils/formatters';
import { isDeactivated } from '@/utils/roles';
import { MaterialReactTable } from 'material-react-table';

export const SchedulerAccountsPage = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const location = useLocation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [schedulerToDeactivate, setSchedulerToDeactivate] = useState(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // TanStack Queries with Server-Side Pagination & Mutations
  const {
    data = { schedulers: [], totalResults: 0, totalPages: 1 },
    isLoading,
    isFetching,
    refetch,
  } = useSchedulersQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const {
    addSchedulerMutation,
    resendInviteMutation,
    deactivateSchedulerMutation,
    activateSchedulerMutation,
  } = useSchedulerMutations();

  // Auto-refetch fresh data whenever user navigates or switches to this page
  useEffect(() => {
    refetch();
  }, [location.key, refetch]);

  const schedulers = data.schedulers || [];
  const totalRowCount = data.totalResults ?? schedulers.length;

  const handleAddScheduler = async (formData) => {
    try {
      const res = await addSchedulerMutation.mutateAsync(formData);
      showSuccess(res.message || t('schedulers.schedulerAddedSuccess'));
    } catch (err) {
      showError(err.message || 'Unable to add scheduler');
      throw err;
    }
  };

  const handleResendInvite = useCallback(
    async (id) => {
      try {
        const res = await resendInviteMutation.mutateAsync(id);
        showSuccess(res.message || t('schedulers.linkSentSuccess'));
      } catch (err) {
        showError(err.message || 'Unable to send link');
      }
    },
    [resendInviteMutation, showSuccess, showError, t],
  );

  const handleDeactivateScheduler = useCallback(
    async (id) => {
      try {
        const res = await deactivateSchedulerMutation.mutateAsync(id);
        showSuccess(
          res.message ||
            t('schedulers.schedulerDeactivatedSuccess', {
              defaultValue: 'Scheduler account deactivated successfully',
            }),
        );
      } catch (err) {
        showError(err.message || 'Unable to deactivate scheduler');
        throw err;
      }
    },
    [deactivateSchedulerMutation, showSuccess, showError, t],
  );

  const handleActivateScheduler = useCallback(
    async (id) => {
      try {
        const res = await activateSchedulerMutation.mutateAsync(id);
        showSuccess(
          res.message ||
            t('schedulers.schedulerActivatedSuccess', {
              defaultValue: 'Scheduler account activated successfully',
            }),
        );
      } catch (err) {
        showError(err.message || 'Unable to activate scheduler');
      }
    },
    [activateSchedulerMutation, showSuccess, showError, t],
  );

  const columns = useMemo(
    () => [
      {
        id: 'sNo',
        header: t('schedulers.sNo', { defaultValue: 'SL. NO' }),
        size: 80,
        Cell: ({ row }) => (
          <div className='font-bold text-slate-500 text-xs'>
            {pagination.pageIndex * pagination.pageSize + row.index + 1}
          </div>
        ),
      },
      {
        id: 'createdAt',
        accessorFn: (row) =>
          row.createdAt || row.created_at || row.createdDate || '',
        header: t('schedulers.createdDate', { defaultValue: 'CREATED DATE' }),
        size: 150,
        Cell: ({ row }) => (
          <div className='text-slate-700 font-semibold text-xs'>
            {plainDate(
              row.original.createdAt ||
                row.original.created_at ||
                row.original.createdDate,
              true,
            )}
          </div>
        ),
      },
      {
        id: 'name',
        accessorFn: (row) => row.name || row.full_name || '',
        header: t('schedulers.name', { defaultValue: 'NAME' }),
        size: 180,
        Cell: ({ row }) => {
          const name = row.original.name || row.original.full_name || '-';
          return <div className='font-bold text-slate-900 text-xs'>{name}</div>;
        },
      },
      {
        id: 'phoneNumber',
        accessorFn: (row) =>
          row.phone || row.phoneNumber || row.phone_number || '',
        header: t('schedulers.phoneNumber', { defaultValue: 'PHONE NUMBER' }),
        size: 160,
        Cell: ({ row }) => (
          <div className='text-slate-800 font-semibold text-xs'>
            {row.original.phone ||
              row.original.phoneNumber ||
              row.original.phone_number ||
              '-'}
          </div>
        ),
      },
      {
        id: 'emailId',
        accessorFn: (row) => row.email || row.emailId || '',
        header: t('schedulers.emailId', { defaultValue: 'EMAIL ID' }),
        Cell: ({ row }) => (
          <div className='text-[#059669] font-semibold text-xs truncate'>
            {row.original.email || row.original.emailId || '-'}
          </div>
        ),
      },
      {
        id: 'status',
        header: t('schedulers.status', { defaultValue: 'STATUS' }),
        size: 130,
        Cell: ({ row }) => {
          const deactivated = isDeactivated(row.original);
          return (
            <div className='flex items-center'>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                  deactivated
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    deactivated ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                />
                <span>
                  {deactivated
                    ? t('schedulers.deactivated', { defaultValue: 'Deactivated' })
                    : t('schedulers.active', { defaultValue: 'Active' })}
                </span>
              </span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: t('table.actions', { defaultValue: 'ACTION' }),
        size: 210,
        muiTableHeadCellProps: { align: 'right' },
        muiTableBodyCellProps: { align: 'right' },
        Cell: ({ row }) => {
          const rowId = row.original.id || row.original._id;
          const deactivated = isDeactivated(row.original);

          return (
            <div className='inline-flex items-center justify-end gap-2 w-full'>
              {!deactivated ? (
                <>
                  <button
                    type='button'
                    onClick={() => handleResendInvite(rowId)}
                    className='px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#059669] border border-emerald-200 text-[11px] font-bold rounded-lg transition-colors cursor-pointer'
                  >
                    {t('schedulers.resendLink', { defaultValue: 'Resend Link' })}
                  </button>
                  <button
                    type='button'
                    onClick={() => setSchedulerToDeactivate(row.original)}
                    className='px-3 py-1 border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 text-[11px] font-bold rounded-lg transition-colors cursor-pointer'
                  >
                    {t('schedulers.deactivate', { defaultValue: 'Deactivate' })}
                  </button>
                </>
              ) : (
                <button
                  type='button'
                  onClick={() => handleActivateScheduler(rowId)}
                  className='px-3.5 py-1 border border-emerald-500 text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 hover:border-emerald-600 text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-2xs'
                >
                  {t('schedulers.activate', { defaultValue: 'Activate' })}
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [t, pagination, handleResendInvite, handleActivateScheduler],
  );

  if (isLoading) {
    return <LoadingSpinner message='Loading scheduler accounts...' />;
  }

  return (
    <div className='max-w-6xl mx-auto flex flex-col gap-5'>
      {/* Header */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-black text-slate-900 tracking-tight'>
            {t('schedulers.pageTitle', { defaultValue: 'Scheduler Accounts' })}
          </h1>
          <p className='text-xs text-slate-500 font-semibold mt-1'>
            {t('schedulers.pageSubtitle', {
              defaultValue:
                'Add scheduler accounts, resend setup links, and manage active and deactivated schedulers.',
            })}
          </p>
        </div>

        <button
          type='button'
          onClick={() => setIsAddModalOpen(true)}
          className='px-4 py-2.5 bg-linear-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs font-black rounded-xl inline-flex items-center gap-2 shadow-md shadow-[#10b981]/25 transition-all cursor-pointer'
        >
          <PersonAddOutlinedIcon sx={{ fontSize: 18 }} />
          <span>{t('schedulers.addUser', { defaultValue: 'Add User' })}</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div className='bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs'>
        <MaterialReactTable
          columns={columns}
          data={schedulers}
          enableTopToolbar={false}
          enableBottomToolbar={false}
          enableColumnActions={false}
          enableColumnFilters={false}
          enableSorting={false}
          enableDensityToggle={false}
          enableHiding={false}
          enableGlobalFilter={false}
          manualPagination={true}
          rowCount={totalRowCount}
          state={{
            pagination,
            isLoading: isLoading || isFetching,
          }}
          onPaginationChange={setPagination}
          muiTablePaperProps={{
            elevation: 0,
            sx: {
              border: 'none',
              boxShadow: 'none',
            },
          }}
          muiTableProps={{
            sx: {
              borderCollapse: 'separate',
              borderSpacing: '0',
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              backgroundColor: '#f8fafc',
              color: '#475569',
              fontWeight: 800,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '12px 16px',
              borderBottom: '1px solid #e2e8f0',
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              padding: '14px 16px',
              borderBottom: '1px solid #f1f5f9',
              fontSize: '12px',
            },
          }}
          muiTableBodyRowProps={{
            sx: {
              '&:hover': {
                backgroundColor: '#f8fafc',
              },
            },
          }}
        />

        {/* Pagination Bar */}
        {totalRowCount > 0 && (
          <div className='border-t border-slate-100 mt-2 -mx-4 -mb-4 rounded-b-2xl overflow-hidden'>
            <PaginationBar
              page={pagination.pageIndex + 1}
              pageSize={pagination.pageSize}
              totalRows={totalRowCount}
              pageSizeOptions={[5, 6, 10, 20, 50]}
              onPageChange={(newPage) =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.max(0, newPage - 1),
                }))
              }
              onPageSizeChange={(newSize) =>
                setPagination({
                  pageIndex: 0,
                  pageSize: Number(newSize),
                })
              }
            />
          </div>
        )}
      </div>

      {/* Add Scheduler Modal */}
      <AddSchedulerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddScheduler}
        onSubmit={handleAddScheduler}
      />

      {/* Deactivate Scheduler Modal */}
      <DeactivateSchedulerModal
        isOpen={Boolean(schedulerToDeactivate)}
        scheduler={schedulerToDeactivate}
        onClose={() => setSchedulerToDeactivate(null)}
        onConfirm={handleDeactivateScheduler}
      />
    </div>
  );
};

export default SchedulerAccountsPage;
