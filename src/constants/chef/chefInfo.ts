import {
  ChefServiceType,
  ChefSpecialty,
  CuisineType,
  Testimonial,
} from '@/types/chef';
import {
  ChefHat,
  Menu,
  ShoppingBag,
  Sparkles,
  Utensils,
  Wine,
} from 'lucide-react';

export const CHEF_SERVICE_TYPES: ChefServiceType[] = [
  {
    id: 'regular-chef',
    title: 'Standard',
    price: 'From US$120 per day',
    description:
      "Este servicio esta diseñado para quienes desean disfrutar de la cocina casera, sin complicaciones, pero con mucho sabor. Ofrecemos preparación de comidas prácticas, nutritivas y deliciosas, perfectas para el día a día.",
    features: [
      'Up to 10 people (prices vary for larger groups)',
      'No set menu - works with your guidance',
      'Affordable pricing option',
      'Flexible meal preparation',
    ],
    type: 'regular',
  },
  {
    id: 'professional-chef',
    title: 'Expert ',
    price: 'US$175 per day',
    description:
      'Experiencia gastronómica pensada para paladares exigentes y ocasiones especiales. Este servicio transforma cada comida en una experiencia memorable. Ideal para cenas privadas, eventos exclusivos, celebraciones o quienes desean un menú gourmet.',
    features: [
      'Up to 10 people (prices vary for larger groups)',
      'Curated menu options available',
      'Formal culinary training',
      'High presentation standards',
      'Special dietary expertise',
      'Refined and structured service',
    ],
    type: 'professional',
    isPopular: true,
  },
];

export const CUISINE_TYPES: CuisineType[] = [
  {
    id: 'traditional',
    name: 'Traditional Food',
    description:
      "Authentic techniques from nonna's kitchen to modern interpretations",
    image:
      '/img/sancocho.jpg',
  },
  {
    id: 'european',
    name: 'European Cuisine',
    description:
      'Classic techniques and refined flavors from the heart of Europe',
    image:
      'https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'asian',
    name: 'Asian Fusion',
    description: 'Balance of flavors from across Asia with modern presentation',
    image:
      'https://images.unsplash.com/photo-1580442151529-343f2f6e0e27?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description:
      'Sun-kissed flavors celebrating the bounty of the Mediterranean',
    image:
      'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'mexican',
    name: 'Mexican',
    description:
      ' Mexican dishes prepared with fresh ingredients and classic techniqueTailored Experiences',
    image:
      'https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg?_gl=1*18suwi1*_ga*MTQ4NDM2ODA3Mi4xNzUxNjg1NzA5*_ga_8JE65Q40S6*czE3NTE2OTQ3OTckbzIkZzEkdDE3NTE2OTQ4MTUkajQyJGwwJGgw',
  },
  {
    id: 'plant-based',
    name: 'Plant-Based Excellence',
    description: 'Innovative plant-based cuisine that satisfies every palate',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    text: 'Chef Maria transformed our anniversary into an absolutely magical evening. Every dish was a masterpiece, and the attention to detail was extraordinary.',
    author: 'Elena & Carlos Rodriguez',
    event: 'Anniversary Dinner',
    image:
      'https://images.unsplash.com/photo-1494790108755-2616b612b593?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    cuisine: 'Italian • Romantic Setting',
  },
  {
    text: 'Having Chef Antoine prepare our dinner party was the best decision. Our guests are still talking about the incredible flavors and presentation.',
    author: 'Michael Thompson',
    event: 'Corporate Dinner',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    cuisine: 'French • 12 Guests',
  },
  {
    text: 'The plant-based menu exceeded all expectations. Even our most skeptical guests were amazed by the creativity and incredible flavors.',
    author: 'Sarah Chen',
    event: 'Family Celebration',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    rating: 5,
    cuisine: 'Plant-Based • 8 Guests',
  },
];

export const DIETARY_ACCOMMODATIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto Friendly',
  'Shellfish-Free',
  'Pescatarian',
  'Nut-Free',
];

export const INCLUDED_SERVICES = [
  {
    icon: ChefHat,
    text: 'Expert Chef',
    desc: 'Professionals Culinary ',
  },
  {
    icon: Menu,
    text: 'Custom Menu Planning',
    desc: 'Personalized to your preferences',
  },
  {
    icon: ShoppingBag,
    text: 'Premium Ingredient Sourcing',
    desc: 'Freshest, highest quality ingredients',
  },
  {
    icon: Utensils,
    text: 'Complete Table Service',
    desc: 'Professional plating and presentation',
  },

  {
    icon: Sparkles,
    text: 'Full Kitchen Cleanup',
    desc: 'Leave the mess to us',
  },
];
