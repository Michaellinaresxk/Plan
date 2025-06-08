import AirportTransferForm from '@/UI/components/forms/AirportTransferForm';
import BabysitterForm from '@/UI/components/forms/BabysitterForm';
import BikeForm from '@/UI/components/forms/BikeForm';
import ChefForm from '@/UI/components/forms/chef/ChefForm';
import CustomDecorationForm from '@/UI/components/forms/CustomDecorationForm';
import GroceryForm from '@/UI/components/forms/GroceryForm';
import LiveMusicForm from '@/UI/components/forms/LiveMusicForm';
import MassageForm from '@/UI/components/forms/MassageForm';
import YogaServiceForm from '@/UI/components/forms/YogaServiceForm';
import SaonaIslandForm from '@/UI/components/forms/SaonaIslandForm';
import KaraokeFrom from '@/UI/components/forms/KaraokeFrom';

export interface ServiceFormField {
  id: string;
  type:
    | 'date'
    | 'time'
    | 'number'
    | 'text'
    | 'select'
    | 'textarea'
    | 'checkbox'
    | 'upload'
    | 'dateRange';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[]; // For select inputs
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customValidator?: (value: any) => boolean | string;
  };
  helpText?: string;
  defaultValue?: any;
  dependsOn?: { field: string; value: any }; // Conditional rendering
}

export interface ServiceFormConfig {
  id: string;
  title: string;
  steps: {
    id: string;
    title: string;
    fields: ServiceFormField[];
  }[];
  submitButtonText?: string;
}
// types/type.ts
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  packageType: string[];
  image?: string;
  rating?: number;
  ratingCount?: number;
  // You can add more properties as needed
}

export interface BookingDate {
  startDate: Date;
  endDate: Date;
}

// For our dynamic form system
export interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  helpText?: string;
  dependsOn?: { field: string; value: any };
}

export interface FormStep {
  id: string;
  title: string;
  fields: FormField[];
}

export interface ServiceFormConfig {
  steps: FormStep[];
  submitButtonText?: string;
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (service: Service, formData: any) => void;
  service: Service | null;
}

// Service mapping configuration with better organization
export const SERVICE_FORM_CONFIG = {
  // Grocery Services
  'grocery-shopping': {
    component: GroceryForm,
    requiredProps: ['selectedItems'],
    type: 'grocery',
  },
  'luxe-grocery': {
    component: GroceryForm,
    requiredProps: ['selectedItems'],
    type: 'grocery',
  },

  // Transportation Services
  'airport-transfers': {
    component: AirportTransferForm,
    requiredProps: [],
    type: 'transportation',
  },

  // Childcare Services
  babysitter: {
    component: BabysitterForm,
    requiredProps: [],
    type: 'childcare',
  },
  'luxe-childcare': {
    component: BabysitterForm,
    requiredProps: [],
    type: 'childcare',
  },

  // Wellness Services
  'standard-massage': {
    component: MassageForm,
    requiredProps: [],
    type: 'wellness',
  },
  'luxe-spa': {
    component: MassageForm,
    requiredProps: [],
    type: 'wellness',
  },
  'yoga-session': {
    component: YogaServiceForm,
    requiredProps: [],
    type: 'wellness',
  },

  // Recreation Services
  'bike-rental': {
    component: BikeForm,
    requiredProps: [],
    type: 'recreation',
  },
  'live-music': {
    component: LiveMusicForm,
    requiredProps: [],
    type: 'entertainment',
  },

  // Culinary Services
  'personal-chef': {
    component: ChefForm,
    requiredProps: [],
    type: 'culinary',
  },
  'luxe-dining': {
    component: ChefForm,
    requiredProps: [],
    type: 'culinary',
  },

  // Decoration Services
  'custom-decorations': {
    component: CustomDecorationForm,
    requiredProps: [],
    type: 'decoration',
  },
  'luxe-decorations': {
    component: CustomDecorationForm,
    requiredProps: [],
    type: 'decoration',
  },

  // Decoration Services
  'saona-island': {
    component: SaonaIslandForm,
    requiredProps: [],
    type: 'travel',
  },
} as const;
