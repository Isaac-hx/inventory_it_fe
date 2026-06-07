type AssetStatus = 'available' | 'assigned' | 'maintenance' | 'retired';
interface StatusBadgeProps {
  status: AssetStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Normalisasi string ke lowercase untuk mengantisipasi ketidaksesuaian casing data
  const normalizedStatus = status.toLowerCase() as AssetStatus;

  const statusConfig: Record<AssetStatus, { label: string; className: string }> = {
    available: {
      label: 'Available',
      className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    },
    assigned: {
      label: 'Assigned',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    },
    maintenance: {
      label: 'Maintenance',
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    },
    retired: {
      label: 'Retired',
      className: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    },
  };

  // Fallback seandainya ada status tak dikenal dari database
  const config = statusConfig[normalizedStatus] || {
    label: status,
    className: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  );
};
