// src/components/dayplanner/EmptyState.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  icon: LucideIcon;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  icon: Icon,
  action,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='text-center py-12'
    >
      <Icon size={48} className='mx-auto mb-4 text-gray-300' />
      <p className='text-gray-500 mb-4'>{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
