import { motion } from 'framer-motion';
import { Star, ArrowRight, Heart } from 'lucide-react';
// Service Selection Grid - CON TODOS LOS MASAJES DE SPA_SERVICES
const ServiceSelectionGrid = ({ services, onServiceSelect }) => {
  const IntensityBadge = ({ intensity }) => {
    const styles = {
      gentle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      strong: 'bg-red-50 text-red-700 border-red-200',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[intensity]}`}
      >
        {intensity}
      </span>
    );
  };

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-semibold text-stone-800 mb-4'>
          Choose Your Perfect Massage Experience
        </h2>
        <p className='text-xl text-stone-600'>
          Select from our complete range of therapeutic treatments
        </p>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-4'>
        {services.map((service) => {
          const minPrice = Math.min(...service.durations.map((d) => d.price));
          const maxPrice = Math.max(...service.durations.map((d) => d.price));
          const priceDisplay =
            minPrice === maxPrice
              ? `$${minPrice}`
              : `$${minPrice} - $${maxPrice}`;

          return (
            <motion.div
              key={service.id}
              className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group'
              onClick={() => onServiceSelect(service)}
              whileHover={{ y: -4 }}
            >
              <div className='aspect-[4/3] relative overflow-hidden'>
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

                {service.isPremium && (
                  <div className='absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1'>
                    <Star className='w-3 h-3' />
                    Premium
                  </div>
                )}

                <div className='absolute bottom-4 left-4 right-4 text-white'>
                  <div className='flex items-center gap-3 mb-2'>
                    <span className='text-2xl'>{service.emoji}</span>
                    <div>
                      <h3 className='text-lg font-semibold'>{service.name}</h3>
                      <p className='text-sm text-white/90'>{priceDisplay}</p>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className='absolute inset-0 bg-stone-800/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                  <div className='text-white text-center'>
                    <div className='text-4xl mb-4'>{service.emoji}</div>
                    <div className='text-xl font-light mb-3'>Book Now</div>
                    <div className='flex items-center justify-center gap-2'>
                      <Heart className='w-5 h-5' />
                      <span>Click to continue</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='p-6'>
                <p className='text-stone-600 text-sm mb-4 line-clamp-2'>
                  {service.description}
                </p>

                <div className='flex items-center gap-2 mb-4'>
                  <IntensityBadge intensity={service.intensity} />
                  <span className='text-xs text-stone-500'>•</span>
                  <span className='text-xs text-stone-500'>
                    Max {service.maxPersons} people
                  </span>
                </div>

                <div className='flex flex-wrap gap-1 mb-4'>
                  {service.benefits.slice(0, 2).map((benefit, idx) => (
                    <span
                      key={idx}
                      className='text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100'
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                <button className='w-full bg-stone-800 text-white py-3 px-4 rounded-xl hover:bg-stone-700 transition-colors font-medium flex items-center justify-center gap-2 group/btn'>
                  <span>Select Treatment</span>
                  <ArrowRight className='w-4 h-4 group-hover/btn:translate-x-1 transition-transform' />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelectionGrid;
