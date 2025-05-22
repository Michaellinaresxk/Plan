import React from 'react';

interface SelectedDatesSummaryProps {
  selectedDates: Set<string>;
  onRemoveDate: (dateStr: string) => void;
  onClearAll?: () => void;
  className?: string;
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const SelectedDatesSummary: React.FC<SelectedDatesSummaryProps> = ({
  selectedDates,
  onRemoveDate,
  onClearAll,
  className = '',
}) => {
  if (selectedDates.size === 0) return null;

  const sortedDates = Array.from(selectedDates).sort();

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    } else {
      sortedDates.forEach(onRemoveDate);
    }
  };

  return (
    <div
      className={`mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200 ${className}`}
    >
      <div className='flex items-center justify-between mb-3'>
        <h4 className='text-sm font-semibold text-amber-800'>
          Selected Dates ({selectedDates.size})
        </h4>
        <button
          type='button'
          onClick={handleClearAll}
          className='text-xs text-amber-600 hover:text-amber-800 transition-colors focus:outline-none focus:underline'
          aria-label='Clear all selected dates'
        >
          Clear all
        </button>
      </div>

      <div className='flex flex-wrap gap-2 max-h-24 overflow-y-auto'>
        {sortedDates.map((dateStr) => (
          <div
            key={dateStr}
            className='flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-amber-300 text-sm'
          >
            <span className='text-amber-800'>{formatDate(dateStr)}</span>
            <button
              type='button'
              onClick={() => onRemoveDate(dateStr)}
              className='text-amber-600 hover:text-amber-800 font-bold text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-amber-500 rounded'
              aria-label={`Remove ${formatDate(dateStr)}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedDatesSummary;
