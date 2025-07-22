import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Plus, Minus, ShoppingCart, Send } from 'lucide-react';

// Complete Menu Data from PDF
const COMPLETE_MENU = {
  breakfast: {
    title: 'BREAKFAST',
    sections: {
      basic: {
        title: 'Basic',
        items: [
          'Coffee or Tea',
          'Fruit Salad',
          'Green Juice',
          'Fruit Juice',
          'Yoghourt with Fruit or Oats',
          'Bread Butter and Jam',
          'Grated Tomato with Chives and Olive Oil',
          'Turkey or Veal Sausages',
          'Turkey or Veal Bacon',
        ],
      },
      beverages: {
        title: 'Beverages',
        items: [
          'Tea',
          'Coffee',
          'Fresh Juice (Green or Orange, Grapefruit, Passion Fruit, Strawberry)',
          'Fruit Shakes (Banana, Papaya, Strawberry, Red Berries, Papaya, with the milk of your choice)',
        ],
      },
      dairy: {
        title: 'Dairy',
        items: [
          'Cereal/Granola (with or without vegetarian gluten option)',
          'Assorted Yoghourts',
          'Chia, Banana, Coconut, Strawberry, Chocolate and Cream Pudding',
          'Pumpkin Cake',
          'Overnight Oats (Vanilla, Pumpkin Cake, Banana, Raspberry)',
        ],
      },
      eggs: {
        title: 'Your choice of eggs',
        items: [
          'Scrambled Eggs with York Ham and Cheese',
          'Fried Eggs with Bacon',
          'Vegetable Omelette',
          'Spring Scrambled Eggs (Onion, Zucchini, Tomato...)',
          'Huevos Rancheros, Fried with Mexican Tomato and Chile Sauce',
          'Poached Eggs with Avocado, Fresh Cheese, Tomatoes and Coriander',
          'Spanish Potato Omelette',
          'Zucchini Omelette',
          'Stuffed Eggs',
        ],
      },
    },
  },
  snacks: {
    title: 'SNACKS',
    sections: {
      main: {
        title: '',
        items: [
          'Hummus Plate',
          'Cheese and Charcuterie Board',
          'Nachos with Cheese and Jalapeños',
          'Guacamole with Tortilla Chips',
          'Bruschetta Selection',
          'Stuffed Jalapeños',
        ],
      },
    },
  },
  soups: {
    title: 'SOUPS',
    sections: {
      main: {
        title: '',
        items: [
          'Tomato Basil Soup',
          'Chicken Noodle Soup',
          'Vegetable Minestrone',
          'Lentil Soup',
          'Cream of Mushroom',
          'Gazpacho',
        ],
      },
    },
  },
  pastas: {
    title: 'PASTAS',
    sections: {
      main: {
        title: '',
        items: [
          'Spaghetti Carbonara',
          'Penne Arrabbiata',
          'Fettuccine Alfredo',
          'Lasagna Bolognese',
          'Ravioli with Spinach and Ricotta',
          'Pesto Linguine',
        ],
      },
    },
  },
  salads: {
    title: 'SALADS',
    sections: {
      main: {
        title: '',
        items: [
          'Caesar Salad',
          'Greek Salad',
          'Quinoa Bowl',
          'Mediterranean Salad',
          'Caprese Salad',
          'Asian Chicken Salad',
        ],
      },
    },
  },
  entrees: {
    title: 'ENTRÉES',
    sections: {
      meat: {
        title: 'Meat',
        items: [
          'Ribeye Steak',
          'Roasted Chicken',
          'Lamb Chops',
          'Pork Tenderloin',
          'Beef Brisket',
        ],
      },
      fish: {
        title: 'Fish',
        items: [
          'Grilled Salmon',
          'Pan Seared Sea Bass',
          'Blackened Mahi Mahi',
          'Lobster Tail',
          'Shrimp Scampi',
        ],
      },
    },
  },
  desserts: {
    title: 'DESSERTS',
    sections: {
      main: {
        title: '',
        items: [
          'Chocolate Lava Cake',
          'Crème Brûlée',
          'Fresh Fruit Tart',
          'Tiramisu',
          'Cheesecake',
          'Ice Cream Selection',
        ],
      },
    },
  },
};

interface SelectedItem {
  category: string;
  section: string;
  item: string;
  people: number;
}

interface MenuProps {
  onSelectionChange?: (selections: SelectedItem[]) => void;
  onSubmitOrder?: (selections: SelectedItem[]) => void;
}

const TraditionalMenu: React.FC<MenuProps> = ({
  onSelectionChange,
  onSubmitOrder,
}) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<{
    category: string;
    section: string;
    item: string;
  } | null>(null);
  const [showCart, setShowCart] = useState(false);

  const handleItemClick = useCallback(
    (category: string, section: string, item: string) => {
      // Check if item is already selected
      const existingIndex = selectedItems.findIndex(
        (selected) =>
          selected.category === category &&
          selected.section === section &&
          selected.item === item
      );

      if (existingIndex >= 0) {
        // Item already selected, remove it
        const newSelections = selectedItems.filter(
          (_, index) => index !== existingIndex
        );
        setSelectedItems(newSelections);
        onSelectionChange?.(newSelections);
      } else {
        // New item, show quantity modal
        setCurrentSelection({ category, section, item });
        setShowQuantityModal(true);
      }
    },
    [selectedItems, onSelectionChange]
  );

  const handleQuantityConfirm = useCallback(
    (people: number) => {
      if (currentSelection && people > 0) {
        const newSelection: SelectedItem = {
          ...currentSelection,
          people,
        };
        const newSelections = [...selectedItems, newSelection];
        setSelectedItems(newSelections);
        onSelectionChange?.(newSelections);
      }
      setShowQuantityModal(false);
      setCurrentSelection(null);
    },
    [currentSelection, selectedItems, onSelectionChange]
  );

  const isItemSelected = useCallback(
    (category: string, section: string, item: string) => {
      return selectedItems.some(
        (selected) =>
          selected.category === category &&
          selected.section === section &&
          selected.item === item
      );
    },
    [selectedItems]
  );

  const removeItem = useCallback(
    (index: number) => {
      const newSelections = selectedItems.filter((_, i) => i !== index);
      setSelectedItems(newSelections);
      onSelectionChange?.(newSelections);
    },
    [selectedItems, onSelectionChange]
  );

  const handleSubmitOrder = useCallback(() => {
    if (selectedItems.length > 0) {
      onSubmitOrder?.(selectedItems);
    }
  }, [selectedItems, onSubmitOrder]);

  const totalItems = selectedItems.length;

  return (
    <div className='min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50'>
      {/* Header */}
      <div className='sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-amber-200'>
        <div className='max-w-4xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='text-center flex-1'>
              <h1 className='text-3xl font-bold text-amber-900 tracking-wide'>
                MENU
              </h1>
              <p className='text-amber-700 text-sm mt-1'>Select your dishes</p>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className='relative p-3 text-amber-700 hover:text-amber-900 transition-colors'
            >
              <ShoppingCart className='w-6 h-6' />
              {totalItems > 0 && (
                <span className='absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className='max-w-4xl mx-auto px-6 py-8'>
        <div className='space-y-12'>
          {Object.entries(COMPLETE_MENU).map(([categoryKey, category]) => (
            <motion.div
              key={categoryKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden'
            >
              {/* Category Header */}
              <div className='bg-gradient-to-r from-amber-600 to-amber-700 text-white py-6 px-8'>
                <h2 className='text-2xl font-bold text-center tracking-wider'>
                  {category.title}
                </h2>
              </div>

              {/* Sections */}
              <div className='p-8'>
                {Object.entries(category.sections).map(
                  ([sectionKey, section]) => (
                    <div key={sectionKey} className='mb-8 last:mb-0'>
                      {section.title && (
                        <h3 className='text-xl font-semibold text-amber-800 mb-6 text-center border-b border-amber-200 pb-2'>
                          {section.title}
                        </h3>
                      )}

                      <div className='space-y-3'>
                        {section.items.map((item, index) => {
                          const isSelected = isItemSelected(
                            categoryKey,
                            sectionKey,
                            item
                          );
                          const selectedItem = selectedItems.find(
                            (selected) =>
                              selected.category === categoryKey &&
                              selected.section === sectionKey &&
                              selected.item === item
                          );

                          return (
                            <motion.button
                              key={`${categoryKey}-${sectionKey}-${index}`}
                              onClick={() =>
                                handleItemClick(categoryKey, sectionKey, item)
                              }
                              className={`
                              w-full text-left p-4 rounded-lg border-2 transition-all duration-300
                              ${
                                isSelected
                                  ? 'border-amber-400 bg-amber-50 shadow-md'
                                  : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                              }
                            `}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className='flex items-center justify-between'>
                                <span
                                  className={`
                                text-lg ${
                                  isSelected
                                    ? 'font-semibold text-amber-900'
                                    : 'text-gray-800'
                                }
                              `}
                                >
                                  {item}
                                </span>
                                {isSelected && selectedItem && (
                                  <div className='flex items-center gap-2'>
                                    <span className='bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
                                      {selectedItem.people}{' '}
                                      {selectedItem.people === 1
                                        ? 'person'
                                        : 'people'}
                                    </span>
                                    <div className='w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center'>
                                      <svg
                                        className='w-4 h-4 text-white'
                                        fill='currentColor'
                                        viewBox='0 0 20 20'
                                      >
                                        <path
                                          fillRule='evenodd'
                                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                          clipRule='evenodd'
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quantity Modal */}
      <AnimatePresence>
        {showQuantityModal && currentSelection && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black bg-opacity-50 z-50'
              onClick={() => setShowQuantityModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 p-8 max-w-md w-full mx-4'
            >
              <h3 className='text-xl font-bold text-gray-900 mb-2'>
                How many people?
              </h3>
              <p className='text-gray-600 mb-6'>{currentSelection.item}</p>

              <PeopleSelector
                onConfirm={handleQuantityConfirm}
                onCancel={() => setShowQuantityModal(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black bg-opacity-50 z-50'
              onClick={() => setShowCart(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className='fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto'
            >
              <div className='p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    Your Order
                  </h2>
                  <button
                    onClick={() => setShowCart(false)}
                    className='p-2 text-gray-500 hover:text-gray-700'
                  >
                    <X className='w-6 h-6' />
                  </button>
                </div>

                {selectedItems.length === 0 ? (
                  <div className='text-center py-12'>
                    <Users className='w-16 h-16 text-gray-300 mx-auto mb-4' />
                    <p className='text-gray-600'>No items selected yet</p>
                  </div>
                ) : (
                  <>
                    <div className='space-y-4 mb-6'>
                      {selectedItems.map((item, index) => (
                        <div key={index} className='bg-gray-50 rounded-lg p-4'>
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <h4 className='font-medium text-gray-900'>
                                {item.item}
                              </h4>
                              <p className='text-sm text-gray-600 capitalize'>
                                {item.category} • {item.section}
                              </p>
                              <div className='flex items-center gap-1 mt-2 text-amber-600'>
                                <Users className='w-4 h-4' />
                                <span className='text-sm font-medium'>
                                  {item.people}{' '}
                                  {item.people === 1 ? 'person' : 'people'}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(index)}
                              className='text-red-500 hover:text-red-700 p-1'
                            >
                              <X className='w-4 h-4' />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleSubmitOrder}
                      className='w-full bg-amber-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center justify-center gap-2'
                    >
                      <Send className='w-5 h-5' />
                      Submit Order ({totalItems} items)
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// People Selector Component
const PeopleSelector: React.FC<{
  onConfirm: (people: number) => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  const [people, setPeople] = useState(1);

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-center gap-4'>
        <button
          onClick={() => setPeople(Math.max(1, people - 1))}
          className='w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
        >
          <Minus className='w-5 h-5' />
        </button>

        <div className='flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-lg'>
          <Users className='w-5 h-5 text-amber-600' />
          <span className='text-2xl font-bold text-amber-900 min-w-[3ch] text-center'>
            {people}
          </span>
        </div>

        <button
          onClick={() => setPeople(people + 1)}
          className='w-12 h-12 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 flex items-center justify-center transition-colors'
        >
          <Plus className='w-5 h-5' />
        </button>
      </div>

      <div className='flex gap-3'>
        <button
          onClick={onCancel}
          className='flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(people)}
          className='flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors'
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default TraditionalMenu;
