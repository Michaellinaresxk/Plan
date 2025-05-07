'use client';

import { useLanguageContext } from '../../context/LanguageContext';
import { Language } from './index';

// Hook para obtener y cambiar el idioma actual
export function useLanguage(): [Language, (language: Language) => void] {
  const { language, setLanguage } = useLanguageContext();
  return [language, setLanguage];
}

// Hook para obtener traducciones
export function useTranslation() {
  const { t, language } = useLanguageContext();
  return { t, language };
}
