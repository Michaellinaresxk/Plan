import { format } from 'date-fns/format';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

// Format date range display
export const formatDateRange = (dateRange) => {
  if (!dateRange?.from || !dateRange?.to) return '';
  return `${format(new Date(dateRange.from), 'MMM d')} - ${format(
    new Date(dateRange.to),
    'MMM d, yyyy'
  )}`;
};
