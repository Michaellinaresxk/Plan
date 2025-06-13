import { Home, TreePine } from 'lucide-react';
import { Service } from './formFields';

// Types for better type safety
export interface FormData {
  // Event details
  date: string;
  startTime: string;
  location: string;

  // Setup requirements
  hasProjectionSpace: boolean;
  needsScreen: boolean;
  setupType: 'indoor' | 'outdoor' | '';

  // Music preferences
  musicReferences: string[];
  specialRequests: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface KaraokeFormProps {
  service: Service;
  onSubmit: (formData: FormData & { totalPrice: number }) => void;
  onCancel: () => void;
}

// Pricing configuration
export const PRICING = {
  BASE_PRICE: 200, // Base karaoke setup price
  SCREEN_RENTAL: 75, // Additional screen rental fee
  OUTDOOR_SETUP: 50, // Additional outdoor setup fee
};

// Setup type options
export const SETUP_TYPES = [
  {
    id: 'indoor',
    name: 'Indoor Setup',
    description: 'Perfect for living rooms, party rooms, or indoor venues',
    icon: Home,
    benefits: [
      'Controlled environment',
      'Better acoustics',
      'Weather protection',
    ],
  },
  {
    id: 'outdoor',
    name: 'Outdoor Setup',
    description: 'Great for patios, gardens, or outdoor celebrations',
    icon: TreePine,
    benefits: ['More space', 'Natural ambiance', 'Fresh air experience'],
    additionalFee: PRICING.OUTDOOR_SETUP,
  },
];
