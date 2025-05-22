import { useState, useCallback } from 'react';

interface UseDateSelectionProps {
  initialDates?: string[];
  onChange?: (dates: string[]) => void;
}

export const useDateSelection = ({
  initialDates = [], onChange,
}: UseDateSelectionProps = {}, onDateSelect: any) => {
  const [selectedDates, setSelectedDates] = useState<Set<string>>(
    new Set(initialDates)
  );

  const toggleDate = useCallback(
    (dateStr: string) => {
      setSelectedDates((prev) => {
        const newDates = new Set(prev);

        if (newDates.has(dateStr)) {
          newDates.delete(dateStr);
        } else {
          newDates.add(dateStr);
        }

        // Call onChange callback with array of dates
        if (onChange) {
          onChange(Array.from(newDates));
        }

        return newDates;
      });
    },
    [onChange]
  );

  const removeDate = useCallback(
    (dateStr: string) => {
      setSelectedDates((prev) => {
        const newDates = new Set(prev);
        newDates.delete(dateStr);

        if (onChange) {
          onChange(Array.from(newDates));
        }

        return newDates;
      });
    },
    [onChange]
  );

  const clearAllDates = useCallback(() => {
    setSelectedDates(new Set());
    if (onChange) {
      onChange([]);
    }
  }, [onChange]);

  const addDate = useCallback(
    (dateStr: string) => {
      setSelectedDates((prev) => {
        const newDates = new Set(prev);
        newDates.add(dateStr);

        if (onChange) {
          onChange(Array.from(newDates));
        }

        return newDates;
      });
    },
    [onChange]
  );

  return {
    selectedDates,
    toggleDate,
    removeDate,
    clearAllDates,
    addDate,
    selectedDatesArray: Array.from(selectedDates),
    hasSelectedDates: selectedDates.size > 0,
  };
};
