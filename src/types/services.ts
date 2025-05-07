import { PackageType } from './type';

// Tipo para categorías de servicios
export type ServiceCategory =
  | 'all'
  | 'water-activities'
  | 'tours'
  | 'transportation'
  | 'wellness'
  | 'food-drinks'
  | 'leisure'
  | 'luxury';

// Tipo para las opciones específicas de cada servicio
export type ServiceOption = {
  id: string;
  nameKey: string; // Clave para el nombre en archivos de traducción
  descriptionKey?: string; // Clave para la descripción en archivos de traducción
  price?: number;
  subOptions?: Record<string, ServiceOption>;
  additionalInfo?: Record<string, unknown>;
};

// Tipo para los datos específicos de cada servicio
export interface ServiceData {
  id: string;
  titleKey: string; // Clave para el título en archivos de traducción
  descriptionKey: string; // Clave para la descripción en archivos de traducción
  fullDescriptionKey?: string; // Clave para descripción completa en traducción
  basePrice: number;
  priceUnit: string; // Por hora, por día, etc.
  category: ServiceCategory;
  packageType: PackageType[];
  imageUrl: string;
  duration?: number; // en horas
  isPopular?: boolean;
  bookingDuration?: {
    min: number;
    max: number;
    unit: 'hours' | 'days' | 'weeks';
  };
  options?: Record<string, ServiceOption>;
  additionalInfoKeys?: string[]; // Claves para traducción de info adicional
  customFields?: {
    type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea';
    name: string;
    labelKey: string;
    required?: boolean;
    options?: { value: string; labelKey: string }[];
    defaultValue?: string | number | boolean | null;
    placeholder?: string;
    validation?: {
      pattern?: string;
      min?: number;
      max?: number;
      minLength?: number;
      maxLength?: number;
    };
  }[];
  specialRender?: 'yoga' | 'karaoke' | 'special' | 'grocery' | 'airport' | 'babysitter'; // Identificador para renders especiales
  relatedServices?: string[]; // IDs de servicios relacionados
  tags?: string[]; // Etiquetas para categorización
  availability?: {
    daysOfWeek?: number[]; // 0-6, donde 0 es domingo
    hoursOfDay?: number[]; // 0-23
    excludedDates?: string[]; // Fechas excluidas en formato ISO
  };
  includes?: string[]; // Incluido en el servicio (keys para traducciones)
  notIncluded?: string[]; // No incluido en el servicio (keys para traducciones)
  itinerary?: string[]; // Pasos de itinerario (keys para traducciones)
  disclaimer?: string; // Clave para traducción de disclaimer
  metaData?: Record<string, string | number | boolean | string[] | number[] | null>; // Datos adicionales específicos del servicio
}

// Interfaz para propiedades que se pasan entre componentes
export interface ServiceDisplayProps {
  service: ServiceData;
  locale: string;
}