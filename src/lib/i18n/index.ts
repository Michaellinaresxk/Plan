import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

export type Language = 'en' | 'es';

// Define la estructura de tus archivos de traducción
export type TranslationsType = typeof enTranslations;

// Objeto que contiene todas las traducciones
export const translations: Record = {
  en: enTranslations,
  es: esTranslations,
};

// Función para obtener traducción por clave
export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let translation: any = translations[language];

  for (const k of keys) {
    if (translation[k] === undefined) {
      console.warn(
        `Translation key not found: ${key} in language: ${language}`
      );
      return key;
    }
    translation = translation[k];
  }

  return translation as string;
}

// Función para detectar el idioma preferido del navegador
export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';

  const browserLang = window.navigator.language.split('-')[0];
  return browserLang === 'es' ? 'es' : 'en';
}
