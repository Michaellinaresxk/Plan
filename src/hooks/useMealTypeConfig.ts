import { useCallback } from 'react';

export const useMealTypeConfig = () => {
  const mealTypeConfigs = {
    breakfast: {
      name: 'Desayuno',
      label: 'Desayuno Gourmet',
      verb: 'desayunar',
      time: '8:00 - 11:00 AM',
      gradient: 'from-amber-400 to-orange-500',
      examples: [
        'Huevos benedictinos',
        'Pancakes con frutas',
        'Avocado toast',
        'Smoothie bowls',
        'Croissants franceses',
        'Café de especialidad',
      ],
      placeholder:
        'Ejemplo: Me encanta el café colombiano, prefiero huevos revueltos con aguacate y pan tostado integral...',
    },
    lunch: {
      name: 'Almuerzo',
      label: 'Almuerzo de Lujo',
      verb: 'almorzar',
      time: '12:00 - 3:00 PM',
      gradient: 'from-orange-400 to-red-500',
      examples: [
        'Ensaladas gourmet',
        'Pasta fresca',
        'Mariscos frescos',
        'Carnes a la parrilla',
        'Risottos cremosos',
        'Ceviches',
      ],
      placeholder:
        'Ejemplo: Disfruto de ensaladas frescas con proteína, pasta casera, o pescados a la plancha...',
    },
    dinner: {
      name: 'Cena',
      label: 'Cena Memorable',
      verb: 'cenar',
      time: '6:00 - 10:00 PM',
      gradient: 'from-purple-500 to-indigo-600',
      examples: [
        'Cortes premium',
        'Mariscos frescos',
        'Risottos trufados',
        'Postres artesanales',
        'Maridajes de vino',
        'Cocina molecular',
      ],
      placeholder:
        'Ejemplo: Me gusta la carne roja término medio, mariscos frescos, y siempre espacio para postre...',
    },
  };

  const getMealConfig = useCallback(
    (mealType: 'breakfast' | 'lunch' | 'dinner') => {
      return mealTypeConfigs[mealType];
    },
    []
  );

  const getAllMealTypes = useCallback(() => {
    return Object.keys(mealTypeConfigs) as ('breakfast' | 'lunch' | 'dinner')[];
  }, []);

  return {
    getMealConfig,
    getAllMealTypes,
    mealTypeConfigs,
  };
};
