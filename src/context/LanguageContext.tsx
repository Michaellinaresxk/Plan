'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  Language,
  detectBrowserLanguage,
  getTranslation,
} from '../lib/i18n/index';

// Definir la forma del contexto
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (
    key: string,
    options?: { fallback?: string; [key: string]: any }
  ) => string;
};

// Crear el contexto con valores por defecto
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Hook personalizado para usar el contexto
export const useLanguageContext = () => useContext(LanguageContext);

// Proveedor del contexto
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Obtener el idioma guardado o detectar el del navegador
  const [language, setLanguageState] = useState<Language>(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return 'en';

    try {
      const savedLanguage = localStorage.getItem('language');
      return savedLanguage
        ? JSON.parse(savedLanguage)
        : detectBrowserLanguage();
    } catch (error) {
      console.error('Error getting language from localStorage:', error);
      return detectBrowserLanguage();
    }
  });

  // Función para cambiar el idioma
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    try {
      localStorage.setItem('language', JSON.stringify(newLanguage));
    } catch (error) {
      console.error('Error saving language to localStorage:', error);
    }
  };

  // Actualizar el atributo lang del HTML cuando cambie el idioma
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Función de traducción
  const t = (
    key: string,
    options?: { fallback?: string; [key: string]: any }
  ): string => {
    const translation = getTranslation(language, key);

    // Si la traducción es igual a la clave, usar el fallback si existe
    if (translation === key && options?.fallback) {
      return options.fallback;
    }

    // Reemplazar variables en la traducción si hay opciones
    if (options) {
      return Object.entries(options).reduce((text, [key, value]) => {
        if (key !== 'fallback') {
          return text.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
        }
        return text;
      }, translation);
    }

    return translation;
  };

  const contextValue = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
