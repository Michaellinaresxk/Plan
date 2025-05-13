// components/grocery/GroceryItems.tsx

import React from 'react';
import Image from 'next/image';
import { ShoppingCart, Heart } from 'lucide-react';

interface GroceryItemProps {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  unit: string;
  image: string;
  isOrganic?: boolean;
  isGourmet?: boolean;
}

interface GroceryItemsProps {
  activeFilter: string;
}

const GroceryItems: React.FC<GroceryItemsProps> = ({ activeFilter }) => {
  // Productos de ejemplo con categorías filtradas
  const popularItems: GroceryItemProps[] = [
    {
      id: '1',
      name: 'Organic Avocados',
      category: 'Fresh Produce',
      categoryId: 'produce',
      price: 7.99,
      unit: 'bag of 4',
      image: '/img/grocery/avocado.jpg',
      isOrganic: true,
    },
    {
      id: '2',
      name: 'Artisan Sourdough Bread',
      category: 'Bakery & Pastries',
      categoryId: 'bakery',
      price: 6.75,
      unit: 'loaf',
      image: '/img/grocery/bread.jpg',
      isGourmet: true,
    },
    {
      id: '3',
      name: 'Premium Coffee Beans',
      category: 'Beverages',
      categoryId: 'beverages',
      price: 14.5,
      unit: '12 oz',
      image: '/img/grocery/coffee.jpg',
      isGourmet: true,
    },
    {
      id: '4',
      name: 'Fresh Atlantic Salmon',
      category: 'Meat & Seafood',
      categoryId: 'meat',
      price: 22.99,
      unit: 'lb',
      image: '/img/grocery/salmon.jpg',
    },
    {
      id: '5',
      name: 'Organic Blueberries',
      category: 'Fresh Produce',
      categoryId: 'produce',
      price: 5.99,
      unit: 'pint',
      image: '/img/grocery/blueberries.jpg',
      isOrganic: true,
    },
    {
      id: '6',
      name: 'Aged Parmesan Cheese',
      category: 'Dairy & Eggs',
      categoryId: 'dairy',
      price: 9.5,
      unit: '8 oz',
      image: '/img/grocery/cheese.jpg',
      isGourmet: true,
    },
    {
      id: '7',
      name: 'Extra Virgin Olive Oil',
      category: 'Pantry Essentials',
      categoryId: 'pantry',
      price: 18.99,
      unit: '500ml',
      image: '/img/grocery/olive-oil.jpg',
      isGourmet: true,
    },
    {
      id: '8',
      name: 'Organic Granola',
      category: 'Snacks & Treats',
      categoryId: 'snacks',
      price: 8.25,
      unit: '12 oz',
      image: '/img/grocery/granola.jpg',
      isOrganic: true,
    },
  ];

  // Aplicar filtro
  const filteredItems =
    activeFilter === 'all'
      ? popularItems
      : activeFilter === 'organic'
      ? popularItems.filter((item) => item.isOrganic)
      : activeFilter === 'gourmet'
      ? popularItems.filter((item) => item.isGourmet)
      : popularItems.filter((item) => item.categoryId === activeFilter);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className='group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200'
        >
          <div className='relative h-48 overflow-hidden'>
            {/* Usar placeholder cuando no hay imágenes disponibles */}
            <div className='absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center'>
              <span className='text-gray-500'>{item.category}</span>
            </div>

            {/* Botón de favoritos */}
            <button className='absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors'>
              <Heart className='h-4 w-4 text-gray-400 hover:text-red-500' />
            </button>

            {/* Etiquetas especiales */}
            {item.isOrganic && (
              <div className='absolute top-2 left-2 z-10 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full'>
                Organic
              </div>
            )}
            {item.isGourmet && (
              <div className='absolute top-2 left-2 z-10 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full'>
                Gourmet
              </div>
            )}
          </div>

          <div className='p-4'>
            <div className='text-xs text-blue-600 uppercase tracking-wider mb-1'>
              {item.category}
            </div>
            <h4 className='font-medium text-gray-900 mb-1'>{item.name}</h4>
            <div className='flex justify-between items-center'>
              <div>
                <span className='text-gray-900 font-medium'>
                  ${item.price.toFixed(2)}
                </span>
                <span className='text-gray-500 text-sm ml-1'>
                  / {item.unit}
                </span>
              </div>
              <button className='h-8 w-8 rounded-full bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition-colors'>
                <ShoppingCart className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroceryItems;
