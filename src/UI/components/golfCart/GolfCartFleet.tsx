import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Users,
  Battery,
  Zap,
  Crown,
  Diamond,
  Star,
  Heart,
  Share2,
  Eye,
  ArrowRight,
  Filter,
  Route,
} from 'lucide-react';

// Types (redefining needed types for this component)
interface GolfCartSpecification {
  seats: number;
  maxSpeed: string;
  batteryLife: string;
  range: string;
  features: string[];
  type: 'electric' | 'gas';
}

interface GolfCartFeature {
  icon: React.ReactNode;
  name: string;
  description: string;
}

interface GolfCart {
  id: string;
  name: string;
  category: 'standard' | 'premium' | 'luxury';
  price: number;
  priceUnit: 'day' | 'hour';
  description: string;
  shortDescription: string;
  mainImage: string;
  gallery: string[];
  specifications: GolfCartSpecification;
  features: GolfCartFeature[];
  highlights: string[];
  isPremium: boolean;
  isAvailable: boolean;
  rating: number;
  gradient: string;
}

interface FleetSectionProps {
  golfCarts: GolfCart[];
  onCartSelect: (cart: GolfCart) => void;
}

// Golf Cart Card Component
const GolfCartCard: React.FC<{ cart: GolfCart; onSelect: () => void }> = ({
  cart,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className='group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden cursor-pointer border border-gray-100'
      onClick={onSelect}
    >
      {/* Image Container */}
      <div className='relative h-72 overflow-hidden'>
        <motion.img
          src={cart.mainImage}
          alt={cart.name}
          className='w-full h-full object-cover'
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.7 }}
        />

        {/* Overlay Gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />

        {/* Premium Badge */}
        {cart.isPremium && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className='absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2'
          >
            <Crown className='w-4 h-4' />
            <span>Premium</span>
          </motion.div>
        )}

        {/* Actions */}
        <div className='absolute top-4 right-4 flex space-x-2'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all'
          >
            <Heart className='w-5 h-5' />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all'
          >
            <Share2 className='w-5 h-5' />
          </motion.button>
        </div>

        {/* Rating */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className='absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center space-x-1'
        >
          <Star className='w-4 h-4 text-amber-500 fill-current' />
          <span className='text-sm font-bold text-gray-900'>{cart.rating}</span>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className='absolute bottom-4 left-4 bg-white/10 backdrop-blur-md rounded-2xl p-3 text-white border border-white/20'
        >
          <div className='grid grid-cols-3 gap-3 text-center'>
            <div className='flex flex-col items-center'>
              <Users className='w-4 h-4 mb-1' />
              <span className='text-xs font-medium'>
                {cart.specifications.seats}
              </span>
            </div>
            <div className='flex flex-col items-center'>
              <Battery className='w-4 h-4 mb-1' />
              <span className='text-xs font-medium'>
                {cart.specifications.batteryLife}
              </span>
            </div>
            <div className='flex flex-col items-center'>
              <Zap className='w-4 h-4 mb-1' />
              <span className='text-xs font-medium'>
                {cart.specifications.maxSpeed}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className='p-6'>
        <div className='flex justify-between items-start mb-4'>
          <div>
            <h3 className='text-2xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors'>
              {cart.name}
            </h3>
            <p className='text-gray-500 text-sm font-medium uppercase tracking-wider'>
              {cart.category} • {cart.specifications.seats} seats
            </p>
          </div>
          <div className='text-right'>
            <div className='text-2xl font-bold text-gray-900'>
              ${cart.price}
            </div>
            <div className='text-sm text-gray-500'>per {cart.priceUnit}</div>
          </div>
        </div>

        <p className='text-gray-600 mb-6 line-clamp-2'>
          {cart.shortDescription}
        </p>

        {/* Features */}
        <div className='grid grid-cols-2 gap-3 mb-6'>
          {[
            {
              icon: <Users className='w-4 h-4' />,
              text: `${cart.specifications.seats} seats`,
            },
            {
              icon: <Battery className='w-4 h-4' />,
              text: `${cart.specifications.batteryLife}`,
            },
          ].map((feature, index) => (
            <div
              key={index}
              className='flex items-center space-x-2 text-sm text-gray-600'
            >
              <div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-blue-600'>
                {feature.icon}
              </div>
              <span className='font-medium'>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 bg-gradient-to-r ${cart.gradient} text-white hover:shadow-lg relative overflow-hidden group`}
        >
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000' />
          <Eye className='w-5 h-5' />
          <span>View Details</span>
          <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
        </motion.button>
      </div>
    </motion.div>
  );
};

// Golf Cart List Item Component
const GolfCartListItem: React.FC<{ cart: GolfCart; onSelect: () => void }> = ({
  cart,
  onSelect,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01, x: 5 }}
      className='bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100'
      onClick={onSelect}
    >
      <div className='flex'>
        {/* Image */}
        <div className='w-80 h-48 relative overflow-hidden'>
          <motion.img
            src={cart.mainImage}
            alt={cart.name}
            className='w-full h-full object-cover'
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
          {cart.isPremium && (
            <div className='absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1'>
              <Crown className='w-3 h-3' />
              <span>Premium</span>
            </div>
          )}
          <div className='absolute top-4 right-4 bg-white/90 rounded-lg px-2 py-1 flex items-center space-x-1'>
            <Star className='w-3 h-3 text-amber-500 fill-current' />
            <span className='text-xs font-bold'>{cart.rating}</span>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 p-8 flex justify-between'>
          <div>
            <div className='flex items-center space-x-3 mb-2'>
              <h3 className='text-3xl font-bold text-gray-900'>{cart.name}</h3>
              <span className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium uppercase'>
                {cart.category}
              </span>
            </div>

            <p className='text-gray-600 mb-4 text-lg max-w-2xl'>
              {cart.description.slice(0, 150)}...
            </p>

            {/* Specs Grid */}
            <div className='grid grid-cols-4 gap-6'>
              {[
                {
                  icon: <Users className='w-5 h-5' />,
                  label: 'Seats',
                  value: cart.specifications.seats,
                },
                {
                  icon: <Battery className='w-5 h-5' />,
                  label: 'Battery',
                  value: cart.specifications.batteryLife,
                },
                {
                  icon: <Zap className='w-5 h-5' />,
                  label: 'Speed',
                  value: cart.specifications.maxSpeed,
                },
                {
                  icon: <Route className='w-5 h-5' />,
                  label: 'Range',
                  value: cart.specifications.range,
                },
              ].map((spec, index) => (
                <div key={index} className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600'>
                    {spec.icon}
                  </div>
                  <div>
                    <div className='font-bold text-gray-900'>{spec.value}</div>
                    <div className='text-sm text-gray-500'>{spec.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price & CTA */}
          <div className='text-right flex flex-col justify-between'>
            <div>
              <div className='text-4xl font-bold text-gray-900 mb-1'>
                ${cart.price}
              </div>
              <div className='text-gray-500 mb-6'>per {cart.priceUnit}</div>
            </div>

            <div className='space-y-3'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${cart.gradient} hover:shadow-lg transition-all duration-300`}
              >
                View Details
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='px-8 py-3 rounded-2xl font-bold text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300'
              >
                Quick Book
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Fleet Section Component
const GolfCartFleet: React.FC<FleetSectionProps> = ({
  golfCarts,
  onCartSelect,
}) => {
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredCarts =
    filter === 'all'
      ? golfCarts
      : golfCarts.filter((cart) => cart.category === filter);

  return (
    <section
      id='fleet'
      className='py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden'
    >
      {/* Background Elements */}
      <div className='absolute inset-0'>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
            scale: { duration: 8, repeat: Infinity },
          }}
          className='absolute top-20 right-20 w-64 h-64 border border-blue-200/30 rounded-full'
        />
        <motion.div
          animate={{ rotate: -360, opacity: [0.1, 0.3, 0.1] }}
          transition={{
            rotate: { duration: 80, repeat: Infinity, ease: 'linear' },
            opacity: { duration: 6, repeat: Infinity },
          }}
          className='absolute bottom-20 left-20 w-48 h-48 border-2 border-cyan-200/20 rounded-full'
        />
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className='inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-6 py-3 mb-8'
          >
            <Car className='w-5 h-5 text-blue-600' />
            <span className='text-blue-900 font-semibold'>PREMIUM FLEET</span>
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-thin text-gray-900 mb-6'>
            Luxury{' '}
            <span className='font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
              Mobility
            </span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Every golf cart in our fleet represents comfort, style, and
            reliability
          </p>
        </motion.div>

        {/* Filter & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='flex flex-col lg:flex-row justify-between items-center mb-12 gap-6'
        >
          {/* Filter Pills */}
          <div className='flex flex-wrap gap-3'>
            {[
              {
                id: 'all',
                name: 'All Carts',
                icon: <Car className='w-4 h-4' />,
              },
              {
                id: 'standard',
                name: 'Standard',
                icon: <Users className='w-4 h-4' />,
              },
              {
                id: 'premium',
                name: 'Premium',
                icon: <Crown className='w-4 h-4' />,
              },
              {
                id: 'luxury',
                name: 'Luxury',
                icon: <Diamond className='w-4 h-4' />,
              },
            ].map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  filter === category.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>

          {/* View Controls */}
          <div className='flex items-center space-x-4'>
            <div className='flex bg-gray-100 rounded-2xl p-1'>
              {[
                {
                  mode: 'grid',
                  icon: (
                    <div className='grid grid-cols-2 gap-1'>
                      <div className='w-1 h-1 bg-current rounded-full'></div>
                      <div className='w-1 h-1 bg-current rounded-full'></div>
                      <div className='w-1 h-1 bg-current rounded-full'></div>
                      <div className='w-1 h-1 bg-current rounded-full'></div>
                    </div>
                  ),
                },
                {
                  mode: 'list',
                  icon: (
                    <div className='space-y-1'>
                      <div className='h-1 w-4 bg-current rounded'></div>
                      <div className='h-1 w-4 bg-current rounded'></div>
                      <div className='h-1 w-4 bg-current rounded'></div>
                    </div>
                  ),
                },
              ].map((view) => (
                <motion.button
                  key={view.mode}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(view.mode as any)}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    viewMode === view.mode
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {view.icon}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='flex items-center space-x-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-700 hover:bg-gray-50 transition-all duration-300'
            >
              <Filter className='w-4 h-4' />
              <span className='hidden sm:inline'>Advanced Filters</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Cart Grid */}
        <motion.div
          layout
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8'
              : 'space-y-6'
          }
        >
          <AnimatePresence>
            {filteredCarts.map((cart, index) => (
              <motion.div
                key={cart.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {viewMode === 'grid' ? (
                  <GolfCartCard
                    cart={cart}
                    onSelect={() => onCartSelect(cart)}
                  />
                ) : (
                  <GolfCartListItem
                    cart={cart}
                    onSelect={() => onCartSelect(cart)}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default GolfCartFleet;
