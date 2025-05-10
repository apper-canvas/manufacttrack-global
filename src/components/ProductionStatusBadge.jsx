function ProductionStatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'scheduled':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-800 dark:text-blue-300',
          label: 'Scheduled'
        };
      case 'in-progress':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-800 dark:text-yellow-300',
          label: 'In Progress'
        };
      case 'completed':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-800 dark:text-green-300',
          label: 'Completed'
        };
      case 'cancelled':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-800 dark:text-red-300',
          label: 'Cancelled'
        };
    }
  };

  const styles = getStatusStyles();
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles.bg} ${styles.text}`}>{styles.label}</span>;
}

export default ProductionStatusBadge;