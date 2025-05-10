// src/UI/components/blocks/GalleryBlock.tsx
import React, { useState } from 'react';
import { Service } from '@/types/type';
import { ServiceData, ServiceExtendedDetails } from '@/types/services';
import { BlockConfig } from '../ServiceContentOrchestrator';
import Image from 'next/image';
import { Camera } from 'lucide-react';

interface GalleryBlockProps {
  service: Service;
  serviceData?: ServiceData;
  extendedDetails?: ServiceExtendedDetails;
  primaryColor: string;
  blockConfig: BlockConfig;
  t: any;
  viewContext?: 'standard-view' | 'premium-view';
}

const GalleryBlock: React.FC<GalleryBlockProps> = ({
  service,
  serviceData,
  extendedDetails,
  primaryColor,
  blockConfig,
  t,
  viewContext,
}) => {
  // Get gallery data from extendedDetails
  const gallery = extendedDetails?.gallery;
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  // If no gallery data or no images, don't render the block
  if (!gallery?.images || gallery.images.length === 0) {
    return null;
  }

  // Limit to maximum 3 images
  const displayImages = gallery.images.slice(0, 3);

  return (
    <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
      <div className='p-6 md:p-8'>
        <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
          <Camera className={`mr-2 text-${primaryColor}-500`} size={20} />
          {blockConfig.title ||
            gallery.title ||
            t('serviceDetails.gallery', { fallback: 'Experience Gallery' })}
        </h3>

        {/* Gallery Grid */}
        <div
          className={`grid ${
            displayImages.length === 1
              ? 'grid-cols-1'
              : displayImages.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-3'
          } gap-4`}
        >
          {displayImages.map((image, index) => (
            <div
              key={index}
              className='relative aspect-video rounded-lg overflow-hidden group'
            >
              <Image
                src={image.src}
                alt={image.alt || `${service.name} gallery image ${index + 1}`}
                fill
                className='object-cover transition-transform duration-300 group-hover:scale-105'
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              />

              {/* Overlay with caption on hover */}
              {image.caption && (
                <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
                  <p className='text-white text-sm'>{image.caption}</p>
                </div>
              )}

              {/* Premium badge for premium services */}
              {viewContext === 'premium-view' && index === 0 && (
                <div className='absolute top-2 right-2 bg-amber-500/90 text-white text-xs font-medium px-2.5 py-0.5 rounded-full'>
                  Premium Experience
                </div>
              )}
            </div>
          ))}

          {/* Modal for full-screen image */}
          {selectedImage !== null && (
            <div
              className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center'
              onClick={() => setSelectedImage(null)}
            >
              <button
                className='absolute top-4 right-4 text-white hover:text-gray-300'
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>

              <div className='relative max-w-7xl max-h-[90vh] w-full h-full'>
                <Image
                  src={displayImages[selectedImage].src}
                  alt={displayImages[selectedImage].alt || ''}
                  fill
                  className='object-contain'
                  sizes='100vw'
                />

                {displayImages[selectedImage].caption && (
                  <div className='absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4'>
                    <p>{displayImages[selectedImage].caption}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Optional gallery disclaimer */}
        {gallery.images.length > 3 && (
          <p className='text-sm text-gray-500 mt-4 text-center'>
            {t('serviceDetails.moreImagesAvailable', {
              fallback: 'Showing a selection of images from this experience.',
            })}
          </p>
        )}
      </div>
    </div>
  );
};

export default GalleryBlock;
