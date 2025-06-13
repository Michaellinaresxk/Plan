// Decoration types from PDF
export const decorationTypes = [
  {
    id: 'romanticSetup',
    name: 'Romantic Setups',
    icon: '💕',
    color: 'from-pink-500 to-red-500',
    price: 150,
    image:
      'https://images.unsplash.com/photo-1580740103686-55594a00a1b0?auto=format&fit=crop&q=80&w=600',
    description: 'Intimate candle-lit settings with roses and elegant touches',
  },
  {
    id: 'birthdayTheme',
    name: 'Birthday Themes',
    icon: '🎂',
    color: 'from-yellow-500 to-orange-500',
    price: 175,
    image:
      'https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?auto=format&fit=crop&q=80&w=600',
    description: 'Colorful and fun decorations for all ages',
  },
  {
    id: 'balloonGarlands',
    name: 'Balloon Garlands',
    icon: '🎈',
    color: 'from-purple-500 to-pink-500',
    price: 200,
    image:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600',
    description: 'Stunning balloon arrangements in your chosen colors',
  },
  {
    id: 'beachPicnic',
    name: 'Beach Picnics',
    icon: '🏖️',
    color: 'from-blue-500 to-teal-500',
    price: 225,
    image:
      'https://images.unsplash.com/photo-1464699798531-2ecf3a63fe09?auto=format&fit=crop&q=80&w=600',
    description: 'Bohemian-style setups perfect for seaside celebrations',
  },
  {
    id: 'kidsParty',
    name: "Kids' Parties",
    icon: '🎪',
    color: 'from-green-500 to-blue-500',
    price: 190,
    image:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=600',
    description: 'Playful and magical decorations for little ones',
  },
  {
    id: 'luxuryDining',
    name: 'Luxury Dining Decor',
    icon: '🍽️',
    color: 'from-amber-500 to-orange-500',
    price: 250,
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=600',
    description: 'Elegant table settings for sophisticated celebrations',
  },
];

// Experience gallery
export const experienceGallery = [
  {
    src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800',
    title: 'Romantic Dinners',
    description: 'Create intimate moments with perfect ambiance',
    category: 'romantic',
  },
  {
    src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=800',
    title: 'Birthday Magic',
    description: 'Make every birthday unforgettable',
    category: 'birthday',
  },
  {
    src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=800',
    title: 'Anniversary Celebrations',
    description: 'Honor your special milestones',
    category: 'anniversary',
  },
  {
    src: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800',
    title: 'Kids Wonderland',
    description: 'Create magical spaces for children',
    category: 'kids',
  },
  {
    src: 'https://images.unsplash.com/photo-1464699798531-2ecf3a63fe09?q=80&w=800',
    title: 'Beach Setups',
    description: 'Perfect beachside celebrations',
    category: 'beach',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800',
    title: 'Elegant Dining',
    description: 'Sophisticated table arrangements',
    category: 'luxury',
  },
];

// Animation variants
export const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};
