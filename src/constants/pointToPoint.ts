import {
  Baby,
  Coffee,
  Luggage,
  MapPin,
  Route,
  UserCheck,
  Wifi,
} from 'lucide-react';

export const TRANSFER_GALLERY = [
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756210032/6_skprwd.jpg',
    alt: 'Luxury sedan transfer',
    caption: 'Professional drivers with luxury vehicles',
  },
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1756210030/4_f3ola3.jpg',
    alt: 'SUV family transport',
    caption: 'Spacious SUVs perfect for families and groups',
  },
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1757095752/4_ttcztv.jpg',
    alt: 'Scenic route in Punta Cana',
    caption: 'Enjoy beautiful scenery during your journey',
  },
  {
    src: 'https://res.cloudinary.com/ddg92xar5/image/upload/v1757095743/6_p5eoq4.jpg',
    alt: 'Resort destination',
    caption: 'For big groups',
  },
];

export const WHATS_INCLUDED = [
  'Professional driver service',
  'Door-to-door pickup & dropoff',
  'Air-conditioned vehicle',
  'Luggage assistance',
  'Route planning & navigation',
  'Real-time trip tracking',
];

export const WHATS_NOT_INCLUDED = [
  'Gratuity (optional, appreciated)',
  'Waiting time beyond 15 minutes',
  'Additional stops (can be arranged)',
];

export const TRANSFER_PROCESS = [
  {
    step: 1,
    icon: UserCheck,
    title: 'Driver arrives',
    description: 'At your specified pickup location and time',
  },
  {
    step: 2,
    icon: Luggage,
    title: 'Assistance provided',
    description: 'Help with luggage and comfortable boarding',
  },
  {
    step: 3,
    icon: Route,
    title: 'Efficient route',
    description: 'Direct journey with optimal route planning',
  },
  {
    step: 4,
    icon: MapPin,
    title: 'Safe arrival',
    description: 'Smooth drop-off at your exact destination',
  },
];

export const POPULAR_ROUTES = [
  {
    from: 'Punta Cana Village',
    to: 'Cap Cana',
    time: '25-30 min',
    price: 35,
    description: 'Popular route to luxury resort area',
  },
  {
    from: 'Bavaro',
    to: 'Saona Island Port',
    time: '1.5-2 hours',
    price: 90,
    description: 'Perfect for Saona Island excursions',
  },
  {
    from: 'Punta Cana Center',
    to: 'La Romana',
    time: '1.5-2 hours',
    price: 85,
    description: 'Historic town and Casa de Campo',
  },
];

export const VEHICLE_FEATURES = [
  { icon: Wifi, label: 'WiFi Available' },
  { icon: Coffee, label: 'Refreshments' },
  { icon: Baby, label: 'Child Seats' },
  { icon: Luggage, label: 'Luggage Space' },
];
