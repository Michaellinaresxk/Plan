import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryProps {
  title: string;
  icon: string;
  items: string[];
}

const AccordionGrocery: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(
    'Fresh Produce'
  ); // Abrimos una por defecto

  const toggleCategory = (title: string) => {
    setOpenCategory(openCategory === title ? null : title);
  };

  // Categorías de ejemplo con íconos
  const categories: CategoryProps[] = [
    {
      title: 'Fresh Produce',
      icon: '🥬',
      items: [
        'Organic Vegetables',
        'Seasonal Fruits',
        'Fresh Herbs',
        'Premium Salads',
        'Exotic Fruits',
        'Local Produce',
      ],
    },
    {
      title: 'Bakery & Pastries',
      icon: '🥖',
      items: [
        'Artisan Bread',
        'French Pastries',
        'Gourmet Desserts',
        'Gluten-Free Options',
        'Cakes & Pies',
        'Breakfast Pastries',
      ],
    },
    {
      title: 'Meat & Seafood',
      icon: '🥩',
      items: [
        'Premium Cuts',
        'Fresh Seafood',
        'Organic Poultry',
        'Local Fish',
        'Prepared Meats',
        'Specialty Sausages',
      ],
    },
    {
      title: 'Dairy & Eggs',
      icon: '🧀',
      items: [
        'Organic Milk',
        'Artisan Cheese',
        'Local Yogurt',
        'Free-Range Eggs',
        'International Cheeses',
        'Dairy Alternatives',
      ],
    },
    {
      title: 'Pantry Essentials',
      icon: '🫙',
      items: [
        'Oils & Vinegars',
        'Spices & Seasonings',
        'Pasta & Grains',
        'Organic Canned Goods',
        'Gourmet Sauces',
        'International Foods',
      ],
    },
  ];

  return (
    <div className='space-y-3'>
      {categories.map((category) => (
        <div
          key={category.title}
          className='border border-gray-200 rounded-lg overflow-hidden'
        >
          <button
            className='w-full p-4 text-left font-medium flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors'
            onClick={() => toggleCategory(category.title)}
          >
            <div className='flex items-center'>
              <span className='text-2xl mr-3'>{category.icon}</span>
              <span>{category.title}</span>
            </div>
            {openCategory === category.title ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {openCategory === category.title && (
            <div className='p-4 bg-white'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                {category.items.map((item) => (
                  <div key={item} className='flex items-center'>
                    <span className='w-2 h-2 bg-blue-500 rounded-full mr-2'></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className='mt-4 text-right'>
                <button className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
                  View All {category.title} →
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AccordionGrocery;
