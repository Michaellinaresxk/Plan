import { CHEF_SERVICE_TYPES } from '@/constants/chef/chefInfo';
import { cn } from '@/utils/chefFormUtils';
import { animations, motion } from 'framer-motion';
import { Check, ChefHat, Crown, DollarSign } from 'lucide-react';

const ChefServiceTypesSection: React.FC<{
  selectedServiceType: string;
  onServiceTypeSelect: (id: string) => void;
}> = ({ selectedServiceType, onServiceTypeSelect }) => (
  <motion.div
    className='px-4'
    initial='hidden'
    animate='visible'
    variants={animations.stagger}
  >
    <div className='text-center mb-16'>
      <motion.h2
        className='text-5xl font-bold text-gray-800 mb-6'
        variants={animations.fadeInUp}
      >
        Choose Your Chef Service
      </motion.h2>
      <motion.p
        className='text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed'
        variants={animations.fadeInUp}
      >
        Select between our regular chef service and professional chef service
        based on your needs and budget
      </motion.p>
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto'>
      {CHEF_SERVICE_TYPES.map((serviceType) => (
        <motion.div
          key={serviceType.id}
          className={cn(
            'relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer group border-2',
            selectedServiceType === serviceType.id
              ? 'border-orange-500 ring-4 ring-orange-500/20 scale-105'
              : 'border-gray-200 hover:border-orange-300'
          )}
          onClick={() =>
            onServiceTypeSelect(
              selectedServiceType === serviceType.id ? '' : serviceType.id
            )
          }
          variants={animations.fadeInUp}
          whileHover={{ y: -4 }}
        >
          {serviceType.isPopular && (
            <div className='absolute -top-4 left-1/2 transform -translate-x-1/2'>
              <div className='bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-full text-sm font-bold'>
                Most Popular
              </div>
            </div>
          )}

          <div className='flex items-center mb-6'>
            <div
              className={cn(
                'w-16 h-16 rounded-2xl flex items-center justify-center text-white mr-4 group-hover:scale-110 transition-transform',
                serviceType.type === 'professional'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600'
                  : 'bg-gradient-to-r from-orange-500 to-orange-400'
              )}
            >
              {serviceType.type === 'professional' ? (
                <Crown className='w-8 h-8' />
              ) : (
                <ChefHat className='w-8 h-8' />
              )}
            </div>
            <div>
              <h3 className='text-2xl font-bold text-gray-800 mb-1'>
                {serviceType.title}
              </h3>
              <div className='flex items-center text-orange-600 font-bold text-lg'>
                <DollarSign className='w-5 h-5 mr-1' />
                {serviceType.price}
              </div>
            </div>
          </div>

          <p className='text-gray-600 mb-6 leading-relaxed'>
            {serviceType.description}
          </p>

          <div className='space-y-3'>
            {serviceType.features.map((feature, idx) => (
              <div key={idx} className='flex items-center'>
                <Check className='w-5 h-5 text-orange-500 mr-3 flex-shrink-0' />
                <span className='text-gray-700'>{feature}</span>
              </div>
            ))}
          </div>

          {selectedServiceType === serviceType.id && (
            <motion.div
              className='absolute inset-0 bg-orange-500/5 border-2 border-orange-500 rounded-3xl'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default ChefServiceTypesSection;
