// components/grocery/GroceryCategoryFilter.tsx

import React from 'react';

interface CategoryProps {
  id: string;
  name: string;
  icon?: string;
}

interface GroceryCategoryFilterProps {
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

const GroceryCategoryFilter: React.FC<GroceryCategoryFilterProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const categories: CategoryProps[] = [
    { id: 'all', name: 'All Items', icon: '🛒' },
    { id: 'produce', name: 'Fresh Produce', icon: '🥬' },
    { id: 'bakery', name: 'Bakery', icon: '🥖' },
    { id: 'meat', name: 'Meat & Seafood', icon: '🥩' },
    { id: 'dairy', name: 'Dairy & Eggs', icon: '🧀' },
    { id: 'pantry', name: 'Pantry', icon: '🫙' },
    { id: 'snacks', name: 'Snacks', icon: '🍿' },
    { id: 'beverages', name: 'Beverages', icon: '🥤' },
    { id: 'organic', name: 'Organic', icon: '🌱' },
    { id: 'gourmet', name: 'Gourmet', icon: '✨' },
  ];

  return (
    <div className='overflow-x-auto pb-2'>
      <div className='flex space-x-2 min-w-max'>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onFilterChange(category.id)}
            className={`
              flex items-center whitespace-nowrap py-2 px-4 rounded-full
              text-sm font-medium transition-colors
              ${
                activeFilter === category.id
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
            `}
          >
            {category.icon && <span className='mr-2'>{category.icon}</span>}
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GroceryCategoryFilter;
