import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LuxuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isPremium?: boolean;
}

const LuxuryModal: React.FC<LuxuryModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isPremium = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Only add the event listener if the modal is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Only add the event listener if the modal is open
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className='fixed inset-0 z-40 bg-black bg-opacity-60 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Modal */}
          <div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 md:p-10'>
            <motion.div
              ref={modalRef}
              className={`relative w-full max-w-4xl mx-auto overflow-hidden ${
                isPremium ? 'bg-gray-900' : 'bg-white'
              } ${
                isPremium ? 'text-white' : 'text-gray-900'
              } rounded-xl shadow-2xl`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                type: 'spring',
                damping: 30,
                stiffness: 300,
              }}
            >
              {/* Premium gradient border for luxury effect */}
              {isPremium && (
                <div className='absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-amber-300/20 to-amber-600/10 z-0 pointer-events-none' />
              )}

              {/* Modal Header */}
              <div
                className={`flex items-center justify-between px-6 pt-6 pb-3 border-b ${
                  isPremium ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <motion.h2
                  className={`text-2xl font-bold flex items-center ${
                    isPremium ? 'text-amber-400' : 'text-blue-600'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {/* Luxury sparkle effect */}
                  {isPremium && (
                    <div className='relative w-6 h-6 mr-2'>
                      <div className='absolute animate-ping w-5 h-5 rounded-full bg-amber-600 opacity-30'></div>
                      <div className='relative flex items-center justify-center w-6 h-6 rounded-full bg-amber-500'>
                        <span className='text-xs'>✨</span>
                      </div>
                    </div>
                  )}
                  {title}
                </motion.h2>

                <button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors ${
                    isPremium
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body - with elegant scrollbar */}
              <div
                className={`p-6 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar ${
                  isPremium ? 'scrollbar-dark' : 'scrollbar-light'
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {children}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LuxuryModal;
