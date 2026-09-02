/**
 * Role Constants and Utilities
 * DB Enum mapping:
 * - 1 -> Master Scheduler ('master_scheduler')
 * - 2 -> Scheduler ('scheduler')
 *
 * DB Status Enum mapping:
 * - '0' -> Inactive
 * - '1' -> Active
 * - '2' -> Deactivated
 */

export const ROLE_ENUM = {
  MASTER_SCHEDULER: 1,
  SCHEDULER: 2,
};

export const ROLE_NAMES = {
  MASTER_SCHEDULER: 'master_scheduler',
  SCHEDULER: 'scheduler',
};

export const ROLE_LABELS = {
  [ROLE_ENUM.MASTER_SCHEDULER]: 'Master Scheduler',
  [ROLE_ENUM.SCHEDULER]: 'Scheduler',
  [ROLE_NAMES.MASTER_SCHEDULER]: 'Master Scheduler',
  [ROLE_NAMES.SCHEDULER]: 'Scheduler',
};

export const STATUS_ENUM = {
  INACTIVE: '0',
  ACTIVE: '1',
  DEACTIVATED: '2',
};

export const STATUS_LABELS = {
  '0': 'Inactive',
  '1': 'Active',
  '2': 'Deactivated',
  inactive: 'Inactive',
  active: 'Active',
  deactivated: 'Deactivated',
};

/**
 * Check if an account is deactivated based ONLY on its status field
 * ('2' -> Deactivated, '0' -> Inactive)
 */
export const isDeactivated = (userOrStatus) => {
  if (userOrStatus === undefined || userOrStatus === null) return false;
  const rawStatus =
    typeof userOrStatus === 'object' ? userOrStatus.status : userOrStatus;
  const statusStr = String(rawStatus ?? '').trim().toLowerCase();

  return (
    statusStr === '2' ||
    statusStr === '0' ||
    rawStatus === 2 ||
    rawStatus === 0 ||
    statusStr === 'deactivated' ||
    statusStr === 'inactive' ||
    statusStr === 'deactive'
  );
};

/**
 * Check if an account is active based on its status field
 */
export const isActive = (userOrStatus) => {
  return !isDeactivated(userOrStatus);
};

/**
 * Normalizes role to string identifier ('master_scheduler' | 'scheduler')
 */
export const normalizeRole = (role) => {
  if (role === 1 || role === '1' || role === ROLE_NAMES.MASTER_SCHEDULER) {
    return ROLE_NAMES.MASTER_SCHEDULER;
  }
  if (role === 2 || role === '2' || role === ROLE_NAMES.SCHEDULER) {
    return ROLE_NAMES.SCHEDULER;
  }
  return role ? String(role).toLowerCase() : ROLE_NAMES.SCHEDULER;
};

/**
 * Returns user object with normalized role and status
 */
export const normalizeUser = (user) => {
  if (!user) return null;
  const rawRole = user.role;
  const normalizedRole = normalizeRole(rawRole);
  const deactivated = isDeactivated(user);

  return {
    ...user,
    role: normalizedRole,
    raw_role: rawRole,
    is_deactivated: deactivated,
    status: String(user.status ?? (deactivated ? '2' : '1')),
  };
};

/**
 * Check if role is Master Scheduler (role 1)
 */
export const isMasterScheduler = (roleOrUser) => {
  const role =
    typeof roleOrUser === 'object' && roleOrUser !== null
      ? roleOrUser.role
      : roleOrUser;
  return role === 1 || role === '1' || role === ROLE_NAMES.MASTER_SCHEDULER;
};

/**
 * Check if role is Scheduler (role 2)
 */
export const isScheduler = (roleOrUser) => {
  const role =
    typeof roleOrUser === 'object' && roleOrUser !== null
      ? roleOrUser.role
      : roleOrUser;
  return role === 2 || role === '2' || role === ROLE_NAMES.SCHEDULER;
};

/**
 * Get human-readable role label ('Master Scheduler' | 'Scheduler')
 */
export const getRoleLabel = (roleOrUser) => {
  if (isMasterScheduler(roleOrUser)) {
    return 'Master Scheduler';
  }
  return 'Scheduler';
};

/**
 * Get human-readable status label ('Active' | 'Deactivated' | 'Inactive')
 */
export const getStatusLabel = (userOrStatus) => {
  if (isDeactivated(userOrStatus)) {
    return 'Deactivated';
  }
  return 'Active';
};

export default {
  ROLE_ENUM,
  ROLE_NAMES,
  ROLE_LABELS,
  STATUS_ENUM,
  STATUS_LABELS,
  isDeactivated,
  isActive,
  normalizeRole,
  normalizeUser,
  isMasterScheduler,
  isScheduler,
  getRoleLabel,
  getStatusLabel,
};
