import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LuxuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const LuxuryModal: React.FC<LuxuryModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40'
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
          >
            <div className='relative w-full max-w-4xl max-h-[90vh] overflow-hidden'>
              {/* ✅ ESTILO ESTÁNDAR UNIFICADO - Sin variaciones premium */}
              <div className='bg-white rounded-2xl shadow-2xl border border-gray-200'>
                {/* Header */}
                <div className='bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between'>
                  <h2 className='text-xl font-semibold text-white'>{title}</h2>
                  <button
                    onClick={onClose}
                    className='p-2 hover:bg-white/10 rounded-full transition-colors'
                  >
                    <X className='w-5 h-5 text-white' />
                  </button>
                </div>

                {/* Content */}
                <div className='max-h-[calc(90vh-80px)] overflow-y-auto'>
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LuxuryModal;

// ✅ ALTERNATIVA: Si quieres mantener la funcionalidad premium pero deshabilitarla
const LuxuryModalWithDisabledPremium: React.FC<LuxuryModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isPremium = false, // Mantener la prop pero no usarla
}) => {
  // Forzar siempre estilo estándar
  const forceStandard = true;
  const useStandardStyle = forceStandard || !isPremium;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40'
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
          >
            <div className='relative w-full max-w-4xl max-h-[90vh] overflow-hidden'>
              {/* Siempre usar estilo estándar */}
              <div className='bg-white rounded-2xl shadow-2xl border border-gray-200'>
                <div className='bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between'>
                  <h2 className='text-xl font-semibold text-white'>{title}</h2>
                  <button
                    onClick={onClose}
                    className='p-2 hover:bg-white/10 rounded-full transition-colors'
                  >
                    <X className='w-5 h-5 text-white' />
                  </button>
                </div>

                <div className='max-h-[calc(90vh-80px)] overflow-y-auto'>
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
