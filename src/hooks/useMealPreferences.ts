import {
  MealPreference,
  MealPreferencesState,
  UseMealPreferencesReturn,
} from '@/constants/chef/mealPreference';
import { useCallback, useState } from 'react';

/**
 * Hook personalizado para gestionar las preferencias de comida
 * Proporciona funcionalidad completa para CRUD de preferencias con validación
 */
export const useMealPreferences = (
  onChange?: (event: any) => void
): UseMealPreferencesReturn => {
  // Estados principales
  const [mealPreferences, setMealPreferences] = useState<MealPreferencesState>(
    {}
  );
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mealType: 'breakfast' | 'lunch' | 'dinner' | null;
  }>({
    isOpen: false,
    mealType: null,
  });

  // ✅ Abrir modal para configurar preferencias
  const openModal = useCallback(
    (mealType: 'breakfast' | 'lunch' | 'dinner') => {
      setModalState({
        isOpen: true,
        mealType,
      });
    },
    []
  );

  // ✅ Cerrar modal
  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mealType: null,
    });
  }, []);

  // ✅ Guardar preferencia de comida
  const saveMealPreference = useCallback(
    (preference: MealPreference) => {
      const updatedPreferences = {
        ...mealPreferences,
        [preference.mealType]: preference,
      };

      setMealPreferences(updatedPreferences);

      // Notificar cambio al componente padre si existe onChange
      if (onChange) {
        const syntheticEvent = {
          target: {
            name: 'mealPreferences',
            value: updatedPreferences,
            type: 'custom',
          },
        };
        onChange(syntheticEvent);
      }
    },
    [mealPreferences, onChange]
  );

  // ✅ Eliminar preferencia de comida
  const removeMealPreference = useCallback(
    (mealType: 'breakfast' | 'lunch' | 'dinner') => {
      const updatedPreferences = { ...mealPreferences };
      delete updatedPreferences[mealType];

      setMealPreferences(updatedPreferences);

      // Notificar cambio al componente padre
      if (onChange) {
        const syntheticEvent = {
          target: {
            name: 'mealPreferences',
            value: updatedPreferences,
            type: 'custom',
          },
        };
        onChange(syntheticEvent);
      }
    },
    [mealPreferences, onChange]
  );

  // ✅ Obtener información de preferencias para un tipo de comida
  const getMealPreferenceInfo = useCallback(
    (mealType: string) => {
      const preference = mealPreferences[mealType];
      if (!preference) return null;

      return {
        hasPreferences: !!preference.preferences,
        preferencesText: preference.preferences,
        hasDietaryRestrictions: !!preference.dietaryRestrictions,
        hasSpecialRequests: !!preference.specialRequests,
      };
    },
    [mealPreferences]
  );

  // ✅ Validar que todas las comidas seleccionadas tengan preferencias configuradas
  const validateMealPreferences = useCallback(
    (selectedTimes: string[]) => {
      const missingPreferences: string[] = [];

      // Filtrar solo los tipos de comida válidos
      const validMealTypes = selectedTimes.filter((time) =>
        ['breakfast', 'lunch', 'dinner'].includes(time)
      );

      validMealTypes.forEach((mealType) => {
        const preference = mealPreferences[mealType];
        if (!preference || !preference.preferences?.trim()) {
          missingPreferences.push(mealType);
        }
      });

      return {
        isValid: missingPreferences.length === 0,
        missingPreferences,
      };
    },
    [mealPreferences]
  );

  // ✅ Inicializar desde datos del formulario
  const initializeFromFormData = useCallback((formData: any) => {
    if (formData.mealPreferences) {
      setMealPreferences(formData.mealPreferences);
    }
  }, []);

  // ✅ Obtener actualización para formData
  const getFormDataUpdate = useCallback(
    () => ({
      name: 'mealPreferences',
      value: mealPreferences,
    }),
    [mealPreferences]
  );

  return {
    // Estado
    mealPreferences,
    modalState,

    // Acciones
    openModal,
    closeModal,
    saveMealPreference,
    removeMealPreference,
    getMealPreferenceInfo,

    // Validación
    validateMealPreferences,

    // Utilidades
    initializeFromFormData,
    getFormDataUpdate,
  };
};
