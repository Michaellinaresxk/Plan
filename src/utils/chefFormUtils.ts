// formUtils.js
export const serviceTypes = [
  {
    id: 'single',
    name: 'Single Day Service',
    description: 'A one-time chef service for a special occasion',
    icon: 'Calendar',
  },
  {
    id: 'multiple',
    name: 'Multiple Days Service',
    description: 'Chef service on multiple days during your stay',
    icon: 'CalendarRange',
  },
];

// Helper function to format date
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper function to get minimum date (tomorrow) for the date picker
export const getMinDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

// Helper function to get maximum date (1 year from now) for the date picker
export const getMaxDate = () => {
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  return maxDate.toISOString().split('T')[0];
};

// Format date range for display
export const formatDateRange = (dates) => {
  if (!dates || dates.length === 0) return '';

  // Sort dates
  const sortedDates = [...dates].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  if (sortedDates.length === 1) {
    return formatDate(sortedDates[0]);
  }

  return `${formatDate(sortedDates[0])} - ${formatDate(
    sortedDates[sortedDates.length - 1]
  )}`;
};
