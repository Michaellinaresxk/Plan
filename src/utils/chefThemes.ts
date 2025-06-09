// utils/chefThemes.ts
export interface ChefTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    light: string;
    gradient: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
    shadow: string;
    background: string;
    selectedBg: string;
    selectedBorder: string;
    selectedShadow: string;
  };
  icons: {
    primary: string;
    secondary: string;
  };
  patterns: {
    background: string;
    overlay: string;
  };
}

export const chefThemes: Record<string, ChefTheme> = {
  standard: {
    id: 'standard',
    name: 'Chef Regular',
    colors: {
      primary: 'orange-500',
      secondary: 'amber-500',
      accent: 'yellow-400',
      light: 'orange-50',
      gradient: 'from-orange-500 via-amber-500 to-yellow-400',
      textPrimary: 'orange-800',
      textSecondary: 'amber-700',
      border: 'orange-200',
      shadow: 'shadow-orange-500/25',
      background: 'from-orange-50 to-amber-50',
      selectedBg: 'bg-orange-50',
      selectedBorder: 'border-orange-500',
      selectedShadow: 'shadow-orange-100',
    },
    icons: {
      primary: 'text-orange-600',
      secondary: 'text-amber-600',
    },
    patterns: {
      background: 'from-orange-50 via-white to-amber-50',
      overlay: 'rgba(251, 146, 60, 0.1)',
    },
  },
  professional: {
    id: 'professional',
    name: 'Chef Experimentado',
    colors: {
      primary: 'purple-500',
      secondary: 'indigo-500',
      accent: 'blue-500',
      light: 'purple-50',
      gradient: 'from-purple-500 via-indigo-500 to-blue-500',
      textPrimary: 'purple-800',
      textSecondary: 'indigo-700',
      border: 'purple-200',
      shadow: 'shadow-purple-500/25',
      background: 'from-purple-50 to-indigo-50',
      selectedBg: 'bg-purple-50',
      selectedBorder: 'border-purple-500',
      selectedShadow: 'shadow-purple-100',
    },
    icons: {
      primary: 'text-purple-600',
      secondary: 'text-indigo-600',
    },
    patterns: {
      background: 'from-purple-50 via-white to-indigo-50',
      overlay: 'rgba(139, 92, 246, 0.1)',
    },
  },
};

export const getChefTheme = (chefType: string): ChefTheme => {
  return chefThemes[chefType] || chefThemes.standard;
};

// Hook personalizado para usar el tema del chef
export const useChefTheme = (chefType: string) => {
  const theme = getChefTheme(chefType);

  const getThemeClasses = () => ({
    // Gradientes principales
    primaryGradient: `bg-gradient-to-r ${theme.colors.gradient}`,
    backgroundGradient: `bg-gradient-to-r ${theme.patterns.background}`,

    // Colores de texto
    primaryText: `text-${theme.colors.textPrimary}`,
    secondaryText: `text-${theme.colors.textSecondary}`,

    // Bordes y fondos
    primaryBorder: `border-${theme.colors.border}`,
    primaryBackground: `bg-${theme.colors.light}`,
    selectedBackground: theme.colors.selectedBg,
    selectedBorder: theme.colors.selectedBorder,

    // Sombras
    primaryShadow: theme.colors.shadow,
    selectedShadow: theme.colors.selectedShadow,

    // Estados de selección
    selected: `${theme.colors.selectedBorder} ${theme.colors.selectedBg} ${theme.colors.selectedShadow}`,

    // Botones
    primaryButton: `bg-gradient-to-r ${theme.colors.gradient} text-white`,
    secondaryButton: `bg-white text-${theme.colors.textPrimary} border-2 border-${theme.colors.border}`,

    // Iconos
    primaryIcon: theme.icons.primary,
    secondaryIcon: theme.icons.secondary,
  });

  return {
    theme,
    classes: getThemeClasses(),
  };
};
