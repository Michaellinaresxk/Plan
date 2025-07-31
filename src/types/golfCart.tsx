// Types and Data
import React from 'react';

import { Users, Zap, Shield, Battery, Navigation, Crown } from 'lucide-react';

// Types
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

interface BookingFormData {
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  duration: number;
  specialRequests: string;
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

interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  highlights: string[];
  price: number;
}

// Data
const GOLF_CART_DATA: GolfCart[] = [
  {
    id: 'standard-4-seater',
    name: 'Classic 4-Seater',
    category: 'standard',
    price: 45,
    priceUnit: 'day',
    description:
      'Perfect for couples or small families. Our standard 4-seater golf cart offers comfort and reliability for exploring your resort or local area.',
    shortDescription: 'Comfortable 4-seater for resort exploration',
    mainImage:
      'https://images.unsplash.com/photo-1551058622-5d7b4f0c6e6a?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1551058622-5d7b4f0c6e6a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612838006830-bf35ed6ba7f6?w=800&h=600&fit=crop',
    ],
    specifications: {
      seats: 4,
      maxSpeed: '25 mph',
      batteryLife: '8-10 hours',
      range: '40-50 miles',
      features: [
        'LED headlights',
        'USB charging ports',
        'Weather protection',
        'Storage compartment',
      ],
      type: 'electric',
    },
    features: [
      {
        icon: <Battery className='w-5 h-5' />,
        name: 'Long Battery Life',
        description: 'Up to 10 hours of continuous use',
      },
      {
        icon: <Shield className='w-5 h-5' />,
        name: 'Safety First',
        description: 'Full safety equipment included',
      },
    ],
    highlights: [
      'Fully charged delivery',
      'Free pickup & drop-off',
      '24/7 support included',
    ],
    isPremium: false,
    isAvailable: true,
    rating: 4.8,
    gradient: 'from-blue-600 via-cyan-600 to-teal-700',
  },
  {
    id: 'premium-6-seater',
    name: 'Premium 6-Seater',
    category: 'premium',
    price: 65,
    priceUnit: 'day',
    description:
      'Ideal for larger groups and families. Our premium 6-seater offers extra space, enhanced comfort, and premium features for the ultimate golf cart experience.',
    shortDescription: 'Spacious premium cart for larger groups',
    mainImage:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1612838006830-bf35ed6ba7f6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551058622-5d7b4f0c6e6a?w=800&h=600&fit=crop',
    ],
    specifications: {
      seats: 6,
      maxSpeed: '25 mph',
      batteryLife: '8-12 hours',
      range: '50-60 miles',
      features: [
        'Premium sound system',
        'Cooler included',
        'GPS navigation',
        'Custom seating',
        'All-weather canopy',
      ],
      type: 'electric',
    },
    features: [
      {
        icon: <Users className='w-5 h-5' />,
        name: 'Group Friendly',
        description: 'Comfortable seating for 6 people',
      },
      {
        icon: <Navigation className='w-5 h-5' />,
        name: 'GPS Navigation',
        description: 'Never get lost exploring',
      },
    ],
    highlights: [
      'Premium sound system',
      'Complimentary cooler',
      'Priority support',
    ],
    isPremium: true,
    isAvailable: true,
    rating: 4.9,
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
  },
  {
    id: 'luxury-executive',
    name: 'Executive Luxury',
    category: 'luxury',
    price: 95,
    priceUnit: 'day',
    description:
      'The ultimate in golf cart luxury. Features leather seating, advanced technology, and premium amenities for the most discerning guests.',
    shortDescription: 'Ultimate luxury with premium amenities',
    mainImage:
      'https://images.unsplash.com/photo-1612838006830-bf35ed6ba7f6?w=800&h=600&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1612838006830-bf35ed6ba7f6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551058622-5d7b4f0c6e6a?w=800&h=600&fit=crop',
    ],
    specifications: {
      seats: 4,
      maxSpeed: '25 mph',
      batteryLife: '10-12 hours',
      range: '60-70 miles',
      features: [
        'Leather seats',
        'Climate control',
        'Premium audio',
        'Phone charging',
        'LED package',
        'Luxury finishes',
      ],
      type: 'electric',
    },
    features: [
      {
        icon: <Crown className='w-5 h-5' />,
        name: 'Luxury Interior',
        description: 'Premium leather and finishes',
      },
      {
        icon: <Zap className='w-5 h-5' />,
        name: 'Advanced Tech',
        description: 'Latest technology features',
      },
    ],
    highlights: ['Leather seating', 'Climate control', 'VIP concierge service'],
    isPremium: true,
    isAvailable: true,
    rating: 5.0,
    gradient: 'from-amber-500 via-orange-600 to-red-600',
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

export {
  GOLF_CART_DATA,
  TESTIMONIALS,
  EXPERIENCES,
  type GolfCart,
  type BookingFormData,
  type Testimonial,
  type Experience,
};
