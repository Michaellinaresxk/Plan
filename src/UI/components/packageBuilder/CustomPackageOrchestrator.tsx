'use client';

import React, { useCallback } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import DayByDayPlanner from './DayByDayPlanner';

interface SimplifiedPackageOrchestratorProps {
  services: Service[];
  onComplete: () => void;
}

// Simplified orchestrator for package planning
const CustomPackageOrchestrator: React.FC<
  SimplifiedPackageOrchestratorProps
> = ({ services, onComplete }) => {
  const { packageType } = useBooking();
  const { t } = useTranslation();

  // Handle completion of the planning process
  const handlePlanningComplete = useCallback(() => {
    // You can add any additional logic here if needed
    onComplete();
  }, [onComplete]);

  return (
    <div className='w-full'>
      <DayByDayPlanner
        services={services}
        onComplete={handlePlanningComplete}
      />
    </div>
  );
};

export default CustomPackageOrchestrator;
