export const chefsSpecialMenus = [
  {
    id: 'mediterranean',
    title: 'Mediterranean Delight',
    description:
      'A journey through the Mediterranean with fresh seafood, olive oils, and regional spices',
    courses: [
      {
        name: 'Greek Mezze Platter',
        description:
          'Selection of hummus, tzatziki, olives, and warm pita bread',
      },
      {
        name: 'Seafood Paella',
        description:
          'Traditional Spanish rice dish with fresh seafood and saffron',
      },
      {
        name: 'Baklava',
        description: 'Honey-soaked layers of filo pastry with pistachios',
      },
    ],
    price: 85,
  },
  {
    id: 'local',
    title: 'Local Favorites',
    description:
      'Experience the best local flavors prepared with a gourmet twist',
    courses: [
      {
        name: 'Fresh Ceviche',
        description: 'Locally caught fish marinated in citrus juices',
      },
      {
        name: 'Slow-Roasted Pork',
        description: 'Traditional style with local spices and plantains',
      },
      {
        name: 'Coconut Flan',
        description: 'Classic dessert with a tropical touch',
      },
    ],
    price: 70,
  },
  {
    id: 'luxury',
    title: 'Luxury Tasting Experience',
    description:
      'A premium culinary journey with the finest ingredients and expert preparation',
    courses: [
      {
        name: 'Truffle and Wild Mushroom Soup',
        description: 'With black truffle oil and crispy shallots',
      },
      {
        name: 'Wagyu Beef',
        description: 'Premium grade Wagyu with red wine reduction',
      },
      {
        name: 'Gold Leaf Chocolate Soufflé',
        description: 'With Madagascar vanilla bean ice cream',
      },
    ],
    price: 150,
  },
];

export const cuisineTypes = [
  {
    id: 'local',
    name: 'Local & Traditional',
    description: 'Local specialties and regional dishes',
    price: 0,
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    description: 'Fresh seafood, olive oil, and herbs',
    price: 20,
  },
  {
    id: 'italian',
    name: 'Italian',
    description: 'Pastas, risottos, and authentic Italian flavors',
    price: 20,
  },
  {
    id: 'asian',
    name: 'Asian Fusion',
    description: 'A blend of Asian flavors and techniques',
    price: 30,
  },
  {
    id: 'japanese',
    name: 'Japanese',
    description: 'Sushi, sashimi, and traditional Japanese dishes',
    price: 40,
  },
  {
    id: 'french',
    name: 'French',
    description: 'Classic French cuisine with elegant presentation',
    price: 40,
  },
];

// Budget options
export const budgetOptions = [
  {
    id: 'standard',
    name: 'Standard Chef Service',
    description:
      'From US$120 per day (up to 10 people; prices may vary for larger groups)',
    price: 120,
  },
  {
    id: 'professional',
    name: 'Professional Chef Service',
    description:
      'US$175 per day (up to 10 people; prices may vary for larger groups)',
    price: 175,
  },
];

// Define occasion types
export const occasionTypes = [
  {
    id: 'casual',
    name: 'Casual Dinner',
    description: 'Relaxed dining experience',
  },
  {
    id: 'romantic',
    name: 'Romantic Dinner',
    description: 'Special dinner for couples',
  },
  {
    id: 'celebration',
    name: 'Celebration',
    description: 'Birthday, anniversary or special occasion',
  },
  {
    id: 'family',
    name: 'Family Gathering',
    description: 'Meal for family and children',
  },
  {
    id: 'business',
    name: 'Business Dinner',
    description: 'Professional gathering with colleagues',
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Specify your occasion',
  },
];
