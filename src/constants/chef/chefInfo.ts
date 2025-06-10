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
    title: 'Regular Chef Service',
    price: 'From US$120 per day',
    description:
      "Skilled cooks who offer their services at an affordable price. They cook well and we've had good experiences with them, though they don't work exclusively as chefs.",
    features: [
      'Up to 10 people (prices vary for larger groups)',
      'No set menu - works with your guidance',
      'Good cooking skills and experience',
      'Affordable pricing option',
      'Flexible meal preparation',
    ],
    type: 'regular',
  },
  {
    id: 'professional-chef',
    title: 'Professional Chef Service',
    price: 'US$175 per day',
    description:
      'Formal culinary training and full-time culinary professionals. They offer curated menus, maintain high presentation standards, and excel in handling special dietary needs.',
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
    id: 'italian',
    name: 'Italian Mastery',
    description:
      "Authentic techniques from nonna's kitchen to modern interpretations",
    image:
      'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&q=80&w=800',
    signature: 'Handmade pasta, risotto perfection',
  },
  {
    id: 'french',
    name: 'French Cuisine',
    description:
      'Classic techniques and refined flavors from the heart of France',
    image:
      'https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?auto=format&fit=crop&q=80&w=800',
    signature: 'Sauces, soufflés, and sophistication',
  },
  {
    id: 'asian',
    name: 'Asian Fusion',
    description: 'Balance of flavors from across Asia with modern presentation',
    image:
      'https://images.unsplash.com/photo-1580442151529-343f2f6e0e27?auto=format&fit=crop&q=80&w=800',
    signature: 'Umami depth, fresh ingredients',
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description:
      'Sun-kissed flavors celebrating the bounty of the Mediterranean',
    image:
      'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&q=80&w=800',
    signature: 'Olive oil, herbs, fresh seafood',
  },
  {
    id: 'plant-based',
    name: 'Plant-Based Excellence',
    description: 'Innovative plant-based cuisine that satisfies every palate',
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    signature: 'Creative vegetables, protein alternatives',
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
  'Paleo',
  'Low Sodium',
  'Nut-Free',
];

export const INCLUDED_SERVICES = [
  {
    icon: ChefHat,
    text: 'Professional Chef & Assistant',
    desc: 'Certified culinary professionals',
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
    icon: Wine,
    text: 'Wine Pairing Consultation',
    desc: 'Expert beverage recommendations',
  },
  {
    icon: Sparkles,
    text: 'Full Kitchen Cleanup',
    desc: 'Leave the mess to us',
  },
];
