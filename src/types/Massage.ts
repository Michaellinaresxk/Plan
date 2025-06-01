export interface MassageServiceConfig {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number;
  category: MassageCategory;
  intensity: MassageIntensity;
  benefits: string[];
  contraindications?: string[];
  specialRequirements?: string[];
}

export type MassageCategory =
  | 'relaxation'
  | 'therapeutic'
  | 'sports'
  | 'specialty'
  | 'prenatal';
export type MassageIntensity = 'gentle' | 'moderate' | 'firm' | 'deep';
export type TherapyCategory = 'premium' | 'specialty' | 'wellness';

export interface TherapyAddon {
  id: string;
  name: string;
  category: TherapyCategory;
  price: number;
  duration: number;
  description: string;
  benefits: string[];
  requirements?: string[];
  incompatibleWith?: string[]; // Other therapies that can't be combined
}

export interface MassageBooking {
  massageType: string;
  duration: number;
  therapyAddons: string[];
  scheduledTime: string;
  specialRequests?: string;
  clientPreferences: ClientPreferences;
  totalPrice: number;
  therapistId?: string;
}

export interface ClientPreferences {
  pressure: 'light' | 'medium' | 'firm';
  temperature: 'cool' | 'warm' | 'hot';
  focusAreas: string[];
  allergies: string[];
  healthConditions: string[];
  previousExperience: boolean;
}

export interface PricingRule {
  condition: (booking: Partial<MassageBooking>) => boolean;
  modifier: number; // Multiplier or fixed amount
  type: 'percentage' | 'fixed';
  description: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
