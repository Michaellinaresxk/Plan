import { cn } from '@/utils/chefFormUtils';
import { animations, motion } from 'framer-motion';
import { Check, Clock, Heart, Trophy, Users } from 'lucide-react';

const DINING_EXPERIENCES = [
  {
    id: 'intimate-dinner',
    name: 'Intimate Dinner',
    description: 'Perfect for romantic occasions or special celebrations',
    guests: '2-4 guests',
    duration: '3-4 hours',
    icon: <Heart className='w-5 h-5' />,
    features: ['Personalized menu', 'Romantic ambiance', 'Wine pairing'],
  },
  {
    id: 'family-feast',
    name: 'Family Feast',
    description: 'Bring the family together with a memorable dining experience',
    guests: '5-8 guests',
    duration: '2-3 hours',
    icon: <Users className='w-5 h-5' />,
    features: [
      'Family-style service',
      'Interactive cooking',
      'Kid-friendly options',
    ],
  },
  {
    id: 'dinner-party',
    name: 'Dinner Party',
    description: 'Impress your guests with a sophisticated evening',
    guests: '6-12 guests',
    duration: '4-5 hours',
    icon: <Trophy className='w-5 h-5' />,
    features: ['Multi-course menu', 'Professional service', 'Custom cocktails'],
  },
];

const ChefExperiencesSection: React.FC<{
  selectedExperience: string;
  onExperienceSelect: (id: string) => void;
}> = ({ selectedExperience, onExperienceSelect }) => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={animations.fadeInUp}
  >
    <div className='bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-12'>
      <div className='text-center mb-16'>
        <h2 className='text-5xl font-bold text-gray-800 mb-6'>
          Tailored Experiences
        </h2>
        <p className='text-2xl text-gray-600 max-w-3xl mx-auto'>
          Choose the perfect dining experience for your occasion and group size
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {DINING_EXPERIENCES.map((experience) => (
          <motion.div
            key={experience.id}
            className={cn(
              'relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group',
              selectedExperience === experience.id && 'ring-4 ring-orange-500'
            )}
            onClick={() =>
              onExperienceSelect(
                selectedExperience === experience.id ? '' : experience.id
              )
            }
            variants={animations.fadeInUp}
            whileHover={{ y: -4 }}
          >
            <div className='flex items-center mb-6'>
              <div className='w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform'>
                {experience.icon}
              </div>
              <div>
                <h3 className='text-2xl font-bold text-gray-800'>
                  {experience.name}
                </h3>
                <div className='flex items-center space-x-4 text-sm text-gray-500 mt-1'>
                  <span className='flex items-center'>
                    <Users className='w-4 h-4 mr-1' />
                    {experience.guests}
                  </span>
                  <span className='flex items-center'>
                    <Clock className='w-4 h-4 mr-1' />
                    {experience.duration}
                  </span>
                </div>
              </div>
            </div>

            <p className='text-gray-600 mb-6 leading-relaxed'>
              {experience.description}
            </p>

            <div className='space-y-3'>
              {experience.features.map((feature, idx) => (
                <div key={idx} className='flex items-center'>
                  <Check className='w-5 h-5 text-orange-500 mr-3' />
                  <span className='text-gray-700'>{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default ChefExperiencesSection;
