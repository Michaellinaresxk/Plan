export const menuVariants = {
  closed: {
    opacity: 0,
    x: '-100%',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

export const menuItemVariants = {
  closed: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2 },
  },
};

// Variante para el botón de hamburguesa
export const hamburgerVariants = {
  open: { rotate: 90, scale: 1.1 },
  closed: { rotate: 0, scale: 1 },
};
