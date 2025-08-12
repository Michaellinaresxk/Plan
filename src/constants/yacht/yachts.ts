import {
  Calendar,
  Camera,
  Clock,
  Navigation,
  Shirt,
  Sun,
  Users,
  Utensils,
  Waves,
  Wind,
} from 'lucide-react';

export const WHAT_TO_BRING = [
  {
    icon: Sun,
    title: 'Sun Protection',
    description: 'SPF 50+ sunscreen, hat, sunglasses',
  },
  {
    icon: Shirt,
    title: 'Comfortable Clothing',
    description: 'Light, quick-dry clothing and swimwear',
  },
  {
    icon: Camera,
    title: 'Camera/GoPro',
    description: 'Waterproof case recommended',
  },
  {
    icon: Wind,
    title: 'Light Jacket',
    description: 'For evening ocean breeze',
  },
];

export const PRIVATE_SERVICE_INFO = [
  {
    id: 1,
    icon: Clock,
    title: 'Flexible Schedule',
    time: '9:00 AM - 5:30 PM',
    description:
      'Your yacht is exclusively yours for 8.5 hours. Start anytime from 9 AM',
  },
  {
    id: 2,
    icon: Users,
    title: 'Private Service',
    time: 'Your Choice',
    description:
      'Completely private experience - you decide the itinerary and timing',
  },
  {
    id: 3,
    icon: Navigation,
    title: 'Custom Routes',
    time: 'As Desired',
    description:
      'Choose your destinations: Isla Saona, beaches, or island hopping',
  },
  {
    id: 4,
    icon: Utensils,
    title: 'Gourmet Service',
    time: 'Anytime',
    description: 'Professional chef and crew at your complete disposal',
  },
  {
    id: 5,
    icon: Waves,
    title: 'Water Activities',
    time: 'On Demand',
    description: 'Snorkeling, fishing, water sports - whenever you want',
  },
  {
    id: 6,
    icon: Calendar,
    title: 'Easy Booking',
    time: '12-24h Notice',
    description:
      'Book with minimum 12-24 hours advance notice (subject to availability)',
  },
];

export const ACTIVITY_OPTIONS = [
  { id: 'swimming', name: 'Swimming & Snorkeling' },
  { id: 'watersports', name: 'Water Sports' },
  { id: 'diving', name: 'Diving' },
  { id: 'relaxation', name: 'Pure Relaxation' },
  { id: 'sunset', name: 'Sunset Viewing' },
];

export const TIME_SLOTS = [
  { id: '09:00', name: '9:00 AM - Early Morning' },
  { id: '10:00', name: '10:00 AM - Mid Morning' },
  { id: '11:00', name: '11:00 AM - Late Morning' },
  { id: '12:00', name: '12:00 PM - Noon' },
  { id: '13:00', name: '1:00 PM - Early Afternoon' },
  { id: '14:00', name: '2:00 PM - Mid Afternoon' },
];
