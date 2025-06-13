import { ServiceData } from '@/types/services';
import { Service } from './formFields';
import {
  CheckCircle,
  Clock,
  Gift,
  Music,
  Play,
  Settings,
  Users,
  Volume2,
} from 'lucide-react';

export interface LiveMusicServiceViewProps {
  service: Service;
  serviceData?: ServiceData;
  primaryColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

export const MUSIC_STYLES = [
  {
    id: 'acoustic',
    name: 'Smooth Acoustic',
    description: 'Gentle, soothing melodies perfect for intimate atmospheres',
    vibe: 'Relaxed & Romantic',
  },
  {
    id: 'tropical',
    name: 'Tropical Beats',
    description: 'Island-inspired rhythms that capture the Caribbean spirit',
    vibe: 'Upbeat & Tropical',
  },
  {
    id: 'jazz',
    name: 'Jazz Standards',
    description: 'Classic jazz selections for sophisticated elegance',
    vibe: 'Sophisticated & Classy',
  },
  {
    id: 'contemporary',
    name: 'Contemporary Hits',
    description: 'Popular songs everyone knows and loves',
    vibe: 'Familiar & Engaging',
  },
  {
    id: 'classical',
    name: 'Classical Elegance',
    description: 'Timeless classical pieces for refined occasions',
    vibe: 'Elegant & Refined',
  },
  {
    id: 'latin',
    name: 'Latin Rhythms',
    description: 'Energetic Latin music perfect for dancing',
    vibe: 'Energetic & Danceable',
  },
];

export const WHATS_INCLUDED = [
  {
    icon: Users,
    text: 'Professional Musicians',
    desc: 'Experienced performers with extensive repertoires',
  },
  {
    icon: Music,
    text: 'Personalized Music Selection',
    desc: 'Curated playlist tailored to your event',
  },
  {
    icon: Volume2,
    text: 'Sound Equipment (if needed)',
    desc: 'Professional audio setup when required',
  },
  {
    icon: Settings,
    text: 'Setup & Breakdown on Site',
    desc: 'Complete installation and removal service',
  },
  {
    icon: Clock,
    text: 'Coordination with Event Timeline',
    desc: 'Seamless integration with your schedule',
  },
];

export const NOT_INCLUDED = [
  { icon: Gift, text: 'Gratuity (optional, appreciated)' },
];

export const WHAT_TO_EXPECT_STEPS = [
  {
    step: '1',
    title: 'Consultation to select your style and vibe',
    description: 'We discuss your preferences and event requirements',
    icon: Music,
  },
  {
    step: '2',
    title: 'Musicians arrive early for setup & soundcheck',
    description: 'Professional preparation ensures perfect performance',
    icon: Settings,
  },
  {
    step: '3',
    title: 'Live performance during your event',
    description: 'Enjoy professional music tailored to your celebration',
    icon: Play,
  },
  {
    step: '4',
    title: 'Professional breakdown and departure after performance',
    description: 'Clean, efficient conclusion to the musical experience',
    icon: CheckCircle,
  },
];

export const GOOD_TO_KNOW_INFO = {
  bookingTime: 'Minimum 72 hours in advance',
  duration: 'Standard sets of 60–90 minutes (customizable)',
  setupRequirements: 'Electricity access for amplified sets (110V)',
  customization: 'Special requests for song lists or first dances available',
};

export const TESTIMONIALS = [
  {
    text: 'The acoustic duo created the perfect ambiance for our anniversary dinner. Every song was beautifully performed and matched the romantic atmosphere we wanted.',
    author: 'Elena & Carlos M.',
    event: 'Anniversary Celebration',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616b612b593?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    ensemble: 'Acoustic Duo',
  },
  {
    text: 'The jazz trio elevated our corporate event to something truly special. Professional, talented, and they read the room perfectly throughout the evening.',
    author: 'Michael Rodriguez',
    event: 'Corporate Dinner',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    ensemble: 'Jazz Trio',
  },
  {
    text: 'Our wedding reception was magical thanks to the quintet. They played during dinner and got everyone dancing later. Absolutely perfect!',
    author: 'Sarah & James Wilson',
    event: 'Wedding Reception',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    ensemble: 'Wedding Quintet',
  },
];

// Animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

export const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};
