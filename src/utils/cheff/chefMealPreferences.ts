import { MealPreference } from '@/constants/chef/mealPreference';

export const formatMealTypeName = (mealType: string): string => {
  const names: Record<string, string> = {
    breakfast: 'Desayuno',
    lunch: 'Almuerzo',
    dinner: 'Cena',
  };
  return names[mealType] || mealType;
};

// ✅ Utilidad para validar estructura de preferencias
export const validateMealPreferenceStructure = (
  preference: any
): preference is MealPreference => {
  return (
    preference &&
    typeof preference === 'object' &&
    ['breakfast', 'lunch', 'dinner'].includes(preference.mealType) &&
    typeof preference.preferences === 'string' &&
    typeof preference.dietaryRestrictions === 'string' &&
    typeof preference.specialRequests === 'string'
  );
};
