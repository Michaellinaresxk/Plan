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


