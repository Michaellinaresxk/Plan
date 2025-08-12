import {
  Camera,
  Fish,
  LifeBuoy,
  Play,
  Ship,
  Sun,
  Users,
  Utensils,
  Waves,
} from 'lucide-react';

// Gallery images - modern catamaran experience
export const galleryImages = [
  {
    src: 'https://prod-images.viravira.co/uploads/boats/11178/d10c6fb2-6866-4fe7-9e13-fb4f74fed055.jpg',
    alt: 'Luxury catamaran sailing',
    title: 'Sail in Paradise',
    subtitle: 'Experience the ultimate Caribbean adventure',
  },
  {
    src: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1200',
    alt: 'Catamaran deck experience',
    title: 'Spacious Comfort',
    subtitle: 'Relax on our Xclusive deck facilities',
  },
  {
    src: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=1200',
    alt: 'Snorkeling adventure',
    title: 'Underwater Exploration',
    subtitle: 'Discover vibrant marine life',
  },
  {
    src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200',
    alt: 'Beach paradise',
    title: 'Hidden Beaches',
    subtitle: 'Visit secluded tropical paradises',
  },
];

// Modern activity cards
export const activities = [
  { name: 'Snorkeling', icon: Fish, color: 'from-blue-400 to-cyan-400' },
  { name: 'Swimming', icon: Waves, color: 'from-cyan-400 to-teal-400' },
  { name: 'Beach Visits', icon: Sun, color: 'from-yellow-400 to-orange-400' },
  { name: 'Photography', icon: Camera, color: 'from-purple-400 to-pink-400' },
  {
    name: 'Open Bar',
    icon: Utensils,
    color: 'from-emerald-400 to-green-400',
  },
  { name: 'Music', icon: Play, color: 'from-indigo-400 to-purple-400' },
];

// Time slots with modern design
export const timeSlots = [
  {
    time: '8:30 AM',
    endTime: '11:30 AM',
    label: 'Morning Adventure',
    popular: false,
    icon: Sun,
    description: 'Perfect for early birds',
  },
  {
    time: '11:30 AM',
    endTime: '2:30 PM',
    label: 'Afternoon Escape',
    popular: false,
    icon: Waves,
    description: 'Ideal weather conditions',
  },
  {
    time: '2:30 PM',
    endTime: '5:00 PM',
    label: 'Sunset Experience',
    popular: true,
    icon: Camera,
    description: 'Golden hour magic',
  },
];
