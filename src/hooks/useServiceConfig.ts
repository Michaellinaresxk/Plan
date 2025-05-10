// hooks/useServiceConfig.ts
import { ConfiguringService, DailyActivity } from '@/constants/dayplanner';
import { useState, useCallback } from 'react';

export const useServiceConfig = (
  dailyActivities: Record<string, DailyActivity[]>,
  setDailyActivities: React.Dispatch<
    React.SetStateAction<Record<string, DailyActivity[]>>
  >,
  currentDayStr: string
) => {
  const [configuringService, setConfiguringService] =
    useState<ConfiguringService | null>(null);

  // Start configuring a service
  const handleStartServiceConfig = useCallback(
    (serviceId: string, timeSlot: string) => {
      setConfiguringService({
        serviceId,
        timeSlot,
        guestCount: 2, // Default guests
      });
    },
    []
  );

  // Cancel service configuration
  const handleCancelServiceConfig = useCallback(() => {
    setConfiguringService(null);
  }, []);

  // Confirm service configuration
  const handleConfirmServiceConfig = useCallback(() => {
    if (!configuringService || !currentDayStr) return;

    setDailyActivities((prev) => {
      const dayActivities = prev[currentDayStr] || [];

      // Check if this service is already scheduled for this day
      const existingIndex = dayActivities.findIndex(
        (a) => a.serviceId === configuringService.serviceId
      );

      if (existingIndex >= 0) {
        // Update existing activity
        const updated = [...dayActivities];
        updated[existingIndex] = {
          ...configuringService,
        };
        return {
          ...prev,
          [currentDayStr]: updated,
        };
      } else {
        // Add new activity
        return {
          ...prev,
          [currentDayStr]: [...dayActivities, { ...configuringService }],
        };
      }
    });

    // Close configuration panel
    setConfiguringService(null);
  }, [configuringService, currentDayStr, setDailyActivities]);

  // Increment guest count
  const handleIncrementGuests = useCallback(() => {
    if (!configuringService) return;

    setConfiguringService((prev) => {
      if (!prev) return prev;
      const newCount = Math.min(prev.guestCount + 1, 10);
      return { ...prev, guestCount: newCount };
    });
  }, []);

  // Decrement guest count
  const handleDecrementGuests = useCallback(() => {
    if (!configuringService) return;

    setConfiguringService((prev) => {
      if (!prev) return prev;
      const newCount = Math.max(prev.guestCount - 1, 1);
      return { ...prev, guestCount: newCount };
    });
  }, []);

  return {
    configuringService,
    setConfiguringService,
    handleStartServiceConfig,
    handleCancelServiceConfig,
    handleConfirmServiceConfig,
    handleIncrementGuests,
    handleDecrementGuests,
  };
};
