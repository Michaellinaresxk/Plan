// views/KaraokeModals.tsx

import React from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  setCurrentIndex,
}) => {
  // Function to navigate through gallery images
  const navigateGallery = (direction: number) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className='absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300'
            onClick={onClose}
          >
            <X className='h-6 w-6' />
          </button>

          <div className='relative w-full h-full max-w-6xl mx-auto flex flex-col items-center justify-center p-8'>
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className='object-contain max-h-[80vh]'
              width={1200}
              height={800}
            />

            <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3'>
              <p className='text-white text-center'>
                {images[currentIndex].caption}
              </p>
            </div>

            <div className='absolute inset-x-0 flex items-center justify-between px-4 top-1/2 transform -translate-y-1/2'>
              <button
                onClick={() => navigateGallery(-1)}
                disabled={currentIndex === 0}
                className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  currentIndex === 0
                    ? 'bg-gray-700/30 text-gray-400'
                    : 'bg-black/50 text-white hover:bg-white hover:text-black'
                } transition-all duration-300`}
              >
                <ChevronLeft className='h-6 w-6' />
              </button>

              <button
                onClick={() => navigateGallery(1)}
                disabled={currentIndex === images.length - 1}
                className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  currentIndex === images.length - 1
                    ? 'bg-gray-700/30 text-gray-400'
                    : 'bg-black/50 text-white hover:bg-white hover:text-black'
                } transition-all duration-300`}
              >
                <ChevronRight className='h-6 w-6' />
              </button>
            </div>

            <div className='flex gap-2 mt-4'>
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-10 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className='absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300'
            onClick={onClose}
          >
            <X className='h-6 w-6' />
          </button>

          <div className='relative w-full h-full max-w-6xl mx-auto flex items-center justify-center p-8'>
            <div className='aspect-video w-full bg-black rounded-lg overflow-hidden'>
              <iframe
                width='100%'
                height='100%'
                src='https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'
                title='Karaoke Experience Preview'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
