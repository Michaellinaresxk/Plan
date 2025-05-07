interface LuxuryImage {
  src: string;
  alt: string;
  category?: string;
  featured?: boolean;
}

export const luxuryImages: LuxuryImage[] = [
  {
    src: '/img/gallery-golf-cart.jpg',
    alt: 'Golf Cart Rentals',
    category: 'Experience',
    featured: true,
  },
  {
    src: '/img/bike.jpg',
    alt: 'Bike Rentals',
    category: 'Experiences',
  },
  {
    src: '/img/trainer.jpg',
    alt: 'Yoga',
    category: 'Experience',
    featured: true,
  },
  {
    src: '/img/cheff.jpg',
    alt: 'Private Gourmet Experience',
    category: 'Dinning',
  },
];
