export interface MealPreference {
  mealType: 'breakfast' | 'lunch' | 'dinner';
  preferences: string;
  dietaryRestrictions: string;
  specialRequests: string;
}

export interface MealPreferencesState {
  [key: string]: MealPreference;
}

export interface UseMealPreferencesReturn {
  // Estado
  mealPreferences: MealPreferencesState;
  modalState: {
    isOpen: boolean;
    mealType: 'breakfast' | 'lunch' | 'dinner' | null;
  };

  // Acciones
  openModal: (mealType: 'breakfast' | 'lunch' | 'dinner') => void;
  closeModal: () => void;
  saveMealPreference: (preference: MealPreference) => void;
  removeMealPreference: (mealType: 'breakfast' | 'lunch' | 'dinner') => void;
  getMealPreferenceInfo: (mealType: string) => {
    hasPreferences: boolean;
    preferencesText: string;
    hasDietaryRestrictions: boolean;
    hasSpecialRequests: boolean;
  } | null;

  // Validación
  validateMealPreferences: (selectedTimes: string[]) => {
    isValid: boolean;
    missingPreferences: string[];
  };

  // Utilidades
  initializeFromFormData: (formData: any) => void;
  getFormDataUpdate: () => { name: string; value: MealPreferencesState };
}
s;
