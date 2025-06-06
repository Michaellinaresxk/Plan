import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Service } from '@/types/type';
import {
  Music,
  Calendar,
  Clock,
  CreditCard,
  AlertCircle,
  Check,
  MapPin,
  Youtube,
  MessageSquare,
  User,
  Users,
  X,
} from 'lucide-react';

interface LiveMusicFormProps {
  service: Service;
  onSubmit: (formData: any) => void;
  onCancel: () => void;
}

const LiveMusicForm: React.FC<LiveMusicFormProps> = ({
  service,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    venue: '',
    performerType: '',
    musicGenre: '',
    specialRequests: '',
    musicReferences: [''], // Array of YouTube/Spotify links
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Performer types with specific images
  const performerTypes = [
    {
      id: 'soloist-singer',
      name: 'Singer with Guitar',
      description: 'Acoustic performances with vocals and guitar',
      image:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&auto=format',
      price: 150,
      icon: <User className='w-5 h-5' />,
    },
    {
      id: 'soloist-instrumental',
      name: 'Solo Instrumentalist',
      description: 'Violin, saxophone, piano or other solo instruments',
      image:
        'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop&auto=format',
      price: 120,
      icon: <Music className='w-5 h-5' />,
    },
    {
      id: 'soloist-backing',
      name: 'Singer with Backing Tracks',
      description: 'Professional vocals with high-quality backing music',
      image:
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop&auto=format',
      price: 180,
      icon: <User className='w-5 h-5' />,
    },
    {
      id: 'duo',
      name: 'Musical Duo',
      description: 'Two musicians creating rich harmonies and melodies',
      image:
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop&auto=format',
      price: 280,
      icon: <Users className='w-5 h-5' />,
    },
    {
      id: 'trio',
      name: 'Musical Trio',
      description: 'Three-piece ensemble for fuller sound and variety',
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format',
      price: 420,
      icon: <Users className='w-5 h-5' />,
    },
    {
      id: 'band',
      name: 'Full Band',
      description: 'Complete band experience with drums, bass, and more',
      image:
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop&auto=format',
      price: 600,
      icon: <Users className='w-5 h-5' />,
    },
  ];

  // Music genres
  const musicGenres = [
    {
      id: 'pop',
      name: 'Pop & Commercial Hits',
      description: 'Popular songs everyone knows and loves',
    },
    {
      id: 'jazz',
      name: 'Jazz & Blues',
      description: 'Smooth jazz standards and blues classics',
    },
    {
      id: 'acoustic',
      name: 'Acoustic & Folk',
      description: 'Intimate acoustic performances',
    },
    {
      id: 'latin',
      name: 'Latin Music',
      description: 'Salsa, bachata, reggaeton, and Latin classics',
    },
    {
      id: 'rock',
      name: 'Rock & Classic Rock',
      description: 'Rock anthems and timeless classics',
    },
    {
      id: 'caribbean',
      name: 'Caribbean & Reggae',
      description: 'Island vibes and tropical rhythms',
    },
    {
      id: 'international',
      name: 'World Music',
      description: 'Diverse international music styles',
    },
    {
      id: 'custom',
      name: 'Custom Mix',
      description: 'Tell us your specific preferences',
    },
  ];

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle music reference links
  const addMusicReference = () => {
    setFormData((prev) => ({
      ...prev,
      musicReferences: [...prev.musicReferences, ''],
    }));
  };

  const removeMusicReference = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      musicReferences: prev.musicReferences.filter((_, i) => i !== index),
    }));
  };

  const updateMusicReference = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      musicReferences: prev.musicReferences.map((ref, i) =>
        i === index ? value : ref
      ),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.date) newErrors.date = 'Please select a date';
    if (!formData.startTime) newErrors.startTime = 'Please select a time';
    if (!formData.venue) newErrors.venue = 'Please provide the venue address';
    if (!formData.performerType)
      newErrors.performerType = 'Please select performer type';
    if (!formData.musicGenre)
      newErrors.musicGenre = 'Please select music style';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedPerformer = performerTypes.find(
        (p) => p.id === formData.performerType
      );
      const submissionData = {
        ...formData,
        // Filter out empty music references
        musicReferences: formData.musicReferences.filter(
          (ref) => ref.trim() !== ''
        ),
        calculatedPrice: selectedPerformer?.price || service.price,
        serviceId: service.id,
        serviceName: service.name,
      };
      onSubmit(submissionData);
    }
  };

  const selectedPerformer = performerTypes.find(
    (p) => p.id === formData.performerType
  );

  return (
    <form onSubmit={handleSubmit} className='w-full mx-auto overflow-hidden'>
      <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
        {/* Clean Header */}
        <div className='border-b border-gray-100 p-6'>
          <div className='text-center'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-2'>
              Live Music Booking
            </h2>
            <p className='text-gray-600'>
              Create the perfect musical atmosphere for your event
            </p>
          </div>
        </div>

        <div className='p-8 space-y-8'>
          {/* Event Details */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-900 flex items-center'>
              <Calendar className='w-5 h-5 mr-2 text-gray-700' />
              Event Details
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Date *
                </label>
                <input
                  type='date'
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className='text-red-500 text-sm mt-1 flex items-center'>
                    <AlertCircle className='w-4 h-4 mr-1' />
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Start Time *
                </label>
                <input
                  type='time'
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent ${
                    errors.startTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.startTime && (
                  <p className='text-red-500 text-sm mt-1 flex items-center'>
                    <AlertCircle className='w-4 h-4 mr-1' />
                    {errors.startTime}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                <MapPin className='w-4 h-4 inline mr-1' />
                Venue Address *
              </label>
              <textarea
                value={formData.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
                placeholder='Please provide the complete address where the performance will take place'
                rows={3}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none ${
                  errors.venue ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.venue && (
                <p className='text-red-500 text-sm mt-1 flex items-center'>
                  <AlertCircle className='w-4 h-4 mr-1' />
                  {errors.venue}
                </p>
              )}
            </div>
          </div>

          {/* Performer Selection */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-900 flex items-center'>
              <Music className='w-5 h-5 mr-2 text-gray-700' />
              Choose Your Musicians
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {performerTypes.map((performer) => (
                <div
                  key={performer.id}
                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${
                    formData.performerType === performer.id
                      ? 'border-gray-900 shadow-md'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleChange('performerType', performer.id)}
                >
                  <div className='relative h-32 overflow-hidden'>
                    <img
                      src={performer.image}
                      alt={performer.name}
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-black bg-opacity-20'></div>
                    <div className='absolute top-2 right-2'>
                      {formData.performerType === performer.id && (
                        <div className='w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center'>
                          <Check className='w-4 h-4 text-white' />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='p-4'>
                    <div className='flex items-center justify-between mb-2'>
                      <h4 className='font-medium text-gray-900 flex items-center'>
                        {performer.icon}
                        <span className='ml-2'>{performer.name}</span>
                      </h4>
                      <span className='text-sm font-semibold text-gray-700'>
                        ${performer.price}
                      </span>
                    </div>
                    <p className='text-sm text-gray-600'>
                      {performer.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {errors.performerType && (
              <p className='text-red-500 text-sm flex items-center'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {errors.performerType}
              </p>
            )}
          </div>

          {/* Music Style */}
          <div className='space-y-6'>
            <h3 className='text-lg font-medium text-gray-900'>
              Music Style Preference
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {musicGenres.map((genre) => (
                <div
                  key={genre.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                    formData.musicGenre === genre.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleChange('musicGenre', genre.id)}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-medium text-gray-900 mb-1'>
                        {genre.name}
                      </h4>
                      <p className='text-sm text-gray-600'>
                        {genre.description}
                      </p>
                    </div>
                    {formData.musicGenre === genre.id && (
                      <Check className='w-5 h-5 text-gray-900' />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {errors.musicGenre && (
              <p className='text-red-500 text-sm flex items-center'>
                <AlertCircle className='w-4 h-4 mr-1' />
                {errors.musicGenre}
              </p>
            )}
          </div>

          {/* Music Reference */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900 flex items-center'>
              <Youtube className='w-5 h-5 mr-2 text-gray-700' />
              Music References (Optional)
            </h3>

            <div className='space-y-4'>
              <p className='text-sm text-gray-600'>
                Share YouTube or Spotify links of songs that represent the style
                you're looking for
              </p>

              {formData.musicReferences.map((reference, index) => (
                <div key={index} className='flex gap-3'>
                  <div className='flex-1'>
                    <input
                      type='url'
                      value={reference}
                      onChange={(e) =>
                        updateMusicReference(index, e.target.value)
                      }
                      placeholder={`Music reference ${
                        index + 1
                      } (YouTube, Spotify, etc.)`}
                      className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent'
                    />
                  </div>
                  {formData.musicReferences.length > 1 && (
                    <button
                      type='button'
                      onClick={() => removeMusicReference(index)}
                      className='px-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors'
                      title='Remove this reference'
                    >
                      <X className='w-5 h-5' />
                    </button>
                  )}
                </div>
              ))}

              {formData.musicReferences.length < 5 && (
                <button
                  type='button'
                  onClick={addMusicReference}
                  className='flex items-center text-gray-600 hover:text-gray-800 transition-colors'
                >
                  <div className='w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mr-2 hover:border-gray-400'>
                    <span className='text-lg font-light'>+</span>
                  </div>
                  Add another music reference
                </button>
              )}
            </div>
          </div>

          {/* Special Requests */}
          <div className='space-y-4'>
            <h3 className='text-lg font-medium text-gray-900 flex items-center'>
              <MessageSquare className='w-5 h-5 mr-2 text-gray-700' />
              Special Requests
            </h3>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Additional Information
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) =>
                  handleChange('specialRequests', e.target.value)
                }
                placeholder='Any specific songs, special moments, or other requirements for your event...'
                rows={4}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none'
              />
            </div>
          </div>

          {/* Price Summary */}
          {selectedPerformer && (
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-6'>
              <h4 className='font-medium text-gray-900 mb-4'>
                Booking Summary
              </h4>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Selected:</span>
                  <span className='font-medium'>{selectedPerformer.name}</span>
                </div>
                {formData.musicGenre && (
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Music Style:</span>
                    <span className='font-medium'>
                      {
                        musicGenres.find((g) => g.id === formData.musicGenre)
                          ?.name
                      }
                    </span>
                  </div>
                )}
                <div className='border-t border-gray-200 pt-2 mt-4'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium text-gray-900'>
                      Total Price:
                    </span>
                    <span className='text-xl font-semibold text-gray-900'>
                      ${selectedPerformer.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='bg-gray-50 border-t border-gray-100 p-6 flex justify-between items-center'>
          <button
            type='button'
            onClick={onCancel}
            className='px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors'
          >
            Cancel
          </button>

          <button
            type='submit'
            className='px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors flex items-center font-medium'
          >
            <CreditCard className='w-4 h-4 mr-2' />
            Book Musicians
          </button>
        </div>
      </div>
    </form>
  );
};

export default LiveMusicForm;
