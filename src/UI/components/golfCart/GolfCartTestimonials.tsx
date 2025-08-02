import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Compass,
  Clock,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Heart,
  Star,
  Car,
} from 'lucide-react';

// Types
interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  highlights: string[];
  price: number;
}

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image: string;
  cartType: string;
}

// Data
const EXPERIENCES: Experience[] = [
  {
    id: '1',
    title: 'Resort Explorer',
    description: 'Discover every corner of your resort with ease and comfort.',
    image:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    duration: 'Full day',
    highlights: ['All resort areas', 'Restaurant hopping', 'Beach access'],
    price: 45,
  },
  {
    id: '2',
    title: 'Beach Adventure',
    description: 'Cruise along beautiful beach towns and hidden coastal gems.',
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    duration: 'Half day',
    highlights: [
      'Scenic coastal routes',
      'Local beach spots',
      'Photo opportunities',
    ],
    price: 65,
  },
  {
    id: '3',
    title: 'Villa Community Tour',
    description: 'Explore luxury villa communities and private neighborhoods.',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
    duration: '4 hours',
    highlights: ['Private communities', 'Luxury amenities', 'Exclusive areas'],
    price: 95,
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah & Mike Johnson',
    location: 'Cap Cana Resort',
    rating: 5,
    comment:
      'Amazing service! The golf cart was delivered right to our resort room. Made exploring so much easier and fun!',
    image:
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=100&h=100&fit=crop&crop=face',
    cartType: 'Premium 6-Seater',
  },
  {
    id: '2',
    name: 'Carlos Rodriguez',
    location: 'Bavaro Beach',
    rating: 5,
    comment:
      'Perfect for our family vacation! The kids loved riding around the resort. Excellent condition and service.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    cartType: 'Classic 4-Seater',
  },
];

// Experiences Section Component
const ExperiencesSection: React.FC = () => {
  const [activeExperience, setActiveExperience] = useState(0);

  return (
    <section
      id='experiences'
      className='py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden'
    >
      {/* Background Image */}
      <div className='absolute inset-0'>
        <div
          className='w-full h-full bg-cover bg-center opacity-20'
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop)',
          }}
        />
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-20'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className='inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8'
          >
            <Compass className='w-5 h-5 text-cyan-400' />
            <span className='font-semibold'>CURATED EXPERIENCES</span>
            <Compass className='w-5 h-5 text-cyan-400' />
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-thin mb-6'>
            Explore{' '}
            <span className='font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
              Paradise
            </span>
          </h2>
          <p className='text-xl text-blue-100 max-w-3xl mx-auto'>
            Discover Punta Cana's hidden gems and popular destinations with our
            curated experiences
          </p>
        </motion.div>

        {/* Experience Cards */}
        <div className='grid lg:grid-cols-3 gap-8'>
          {EXPERIENCES.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative cursor-pointer transition-all duration-500 ${
                activeExperience === index ? 'scale-105' : ''
              }`}
              onClick={() => setActiveExperience(index)}
            >
              <div className='bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden group'>
                {/* Image */}
                <div className='relative h-64 overflow-hidden'>
                  <motion.img
                    src={experience.image}
                    alt={experience.title}
                    className='w-full h-full object-cover'
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7 }}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />

                  {/* Duration Badge */}
                  <div className='absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30'>
                    <Clock className='w-4 h-4 inline mr-2' />
                    <span className='font-semibold'>{experience.duration}</span>
                  </div>

                  {/* Price Badge */}
                  <div className='absolute top-4 right-4 bg-cyan-500/80 backdrop-blur-sm px-4 py-2 rounded-full'>
                    <span className='font-bold'>${experience.price}/day</span>
                  </div>

                  {/* Sparkle Effect */}
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className='absolute bottom-4 right-4'
                  >
                    <Sparkles className='w-6 h-6 text-cyan-400' />
                  </motion.div>
                </div>

                {/* Content */}
                <div className='p-8'>
                  <h3 className='text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors'>
                    {experience.title}
                  </h3>
                  <p className='text-blue-100 mb-6 leading-relaxed'>
                    {experience.description}
                  </p>

                  {/* Highlights */}
                  <div className='space-y-3 mb-8'>
                    {experience.highlights.map((highlight, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + idx * 0.1 }}
                        className='flex items-center space-x-3'
                      >
                        <CheckCircle className='w-5 h-5 text-emerald-400 flex-shrink-0' />
                        <span className='text-blue-100'>{highlight}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 relative overflow-hidden group'
                  >
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000' />
                    <span>Book Experience</span>
                    <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection: React.FC = () => {
  return (
    <section className='py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-20'
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className='inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 rounded-full px-6 py-3 mb-8'
          >
            <Heart className='w-5 h-5 text-amber-600' />
            <span className='text-amber-900 font-semibold'>CLIENT STORIES</span>
          </motion.div>

          <h2 className='text-5xl lg:text-6xl font-thin text-gray-900 mb-6'>
            Happy{' '}
            <span className='font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent'>
              Adventures
            </span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Discover why travelers choose our premium golf cart service for
            their Punta Cana adventures
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-8'>
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className='bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100'
            >
              <div className='p-8'>
                <div className='flex items-center mb-6'>
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={testimonial.image}
                    alt={testimonial.name}
                    className='w-16 h-16 rounded-full object-cover mr-4 border-4 border-gray-100'
                  />
                  <div>
                    <h4 className='text-xl font-bold text-gray-900'>
                      {testimonial.name}
                    </h4>
                    <p className='text-gray-500'>{testimonial.location}</p>
                    <div className='flex items-center mt-2'>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + i * 0.1 }}
                        >
                          <Star className='w-4 h-4 text-amber-500 fill-current' />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <blockquote className='text-gray-700 text-lg leading-relaxed mb-6 italic'>
                  "{testimonial.comment}"
                </blockquote>

                <div className='bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100'>
                  <div className='flex items-center space-x-2'>
                    <Car className='w-5 h-5 text-blue-600' />
                    <span className='text-blue-900 font-semibold'>
                      Experience: {testimonial.cartType}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Combined Component
const GolfCartTestimonials: React.FC = () => {
  return (
    <div>
      <ExperiencesSection />
      <TestimonialsSection />
    </div>
  );
};

export default GolfCartTestimonials;
