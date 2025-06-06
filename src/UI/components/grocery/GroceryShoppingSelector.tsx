// components/grocery/GroceryShoppingSelector.tsx - FIXED VERSION
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n/client';
import {
  GROCERY_CATEGORIES,
  GroceryItem,
  SPIRIT_CATEGORIES,
} from '@/constants/GroceryShopping';
import TabSelector from './TabSelector';
import SummaryBar from './SummaryBar';
import SpecialRequests from './SpecialRequests';
import AccordionGrocery from './AccordionGrocery';
import { ShoppingBasket, Wine, Check, Sparkles } from 'lucide-react';

// Enhanced GroceryItem interface to match our expected structure
interface EnhancedGroceryItem extends GroceryItem {
  category: string;
  subcategory?: string;
  translationKey: string;
}

interface GroceryShoppingSelectorProps {
  onItemsSelected: (items: string[]) => void; // Returns array of item IDs
  onSubmit?: () => void;
}

const GroceryShoppingSelector: React.FC<GroceryShoppingSelectorProps> = ({
  onItemsSelected,
  onSubmit,
}) => {
  const { t } = useTranslation();

  // Estados
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'grocery' | 'spirits'>('grocery');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize all categories to prevent recreating on every render
  const allCategories = useMemo(
    () => [...GROCERY_CATEGORIES, ...SPIRIT_CATEGORIES],
    []
  );

  // Memoize the structured item data function
  const getStructuredItemData = useCallback(
    (itemIds: string[]): EnhancedGroceryItem[] => {
      const structuredItems: EnhancedGroceryItem[] = [];

      itemIds.forEach((itemId) => {
        // Find the item in all categories
        for (const category of allCategories) {
          const foundItem = category.items.find((item) => item.id === itemId);
          if (foundItem) {
            structuredItems.push({
              ...foundItem,
              category: category.id,
              subcategory: category.id, // You can enhance this based on your category structure
              translationKey: foundItem.translationKey,
            });
            break;
          }
        }
      });

      return structuredItems;
    },
    [allCategories]
  );

  // Memoize the categorization function
  const categorizeSelectedItems = useCallback(
    (itemIds: string[]) => {
      const structuredItems = getStructuredItemData(itemIds);
      const categorized: Record<
        string,
        {
          category: string;
          subcategories: Record<string, EnhancedGroceryItem[]>;
        }
      > = {};

      structuredItems.forEach((item) => {
        if (!categorized[item.category]) {
          categorized[item.category] = {
            category: item.category,
            subcategories: {},
          };
        }

        const subcategory = item.subcategory || 'general';
        if (!categorized[item.category].subcategories[subcategory]) {
          categorized[item.category].subcategories[subcategory] = [];
        }

        categorized[item.category].subcategories[subcategory].push(item);
      });

      return categorized;
    },
    [getStructuredItemData]
  );

  // Handle item selection/deselection - wrapped in useCallback
  const handleToggleItem = useCallback((itemId: string) => {
    console.log('🛒 GrocerySelector - Toggling item:', itemId);

    setSelectedItems((currentItems) => {
      const newSelectedItems = currentItems.includes(itemId)
        ? currentItems.filter((id) => id !== itemId)
        : [...currentItems, itemId];

      console.log('🛒 GrocerySelector - New selected items:', newSelectedItems);
      return newSelectedItems;
    });
  }, []);

  // Function to split categories into columns - memoized
  const splitIntoColumns = useCallback(
    <T,>(items: T[], columns: number): T[][] => {
      const result = Array.from({ length: columns }, () => []);
      items.forEach((item, index) => {
        result[index % columns].push(item);
      });
      return result;
    },
    []
  );

  // Handle clear all - wrapped in useCallback
  const handleClearAll = useCallback(() => {
    console.log('🛒 GrocerySelector - Clearing all items');
    setSelectedItems([]);
  }, []);

  // Handle submit - wrapped in useCallback
  const handleSubmit = useCallback(() => {
    console.log('🛒 GrocerySelector - Submit clicked');
    setIsSubmitting(true);

    // Simulate a short delay for UI feedback
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSubmit) {
        onSubmit();
      }
    }, 300);
  }, [onSubmit]);

  // Select the categories based on active tab - memoized
  const categories = useMemo(
    () => (activeTab === 'grocery' ? GROCERY_CATEGORIES : SPIRIT_CATEGORIES),
    [activeTab]
  );

  const columns = useMemo(
    () => splitIntoColumns(categories, 2),
    [categories, splitIntoColumns]
  );

  // FIXED: Only call onItemsSelected when selectedItems actually changes
  // and wrap it in useCallback to prevent recreation
  const notifyParent = useCallback(
    (items: string[]) => {
      if (onItemsSelected) {
        console.log('🛒 GrocerySelector - Notifying parent with items:', items);
        onItemsSelected(items);
      }
    },
    [onItemsSelected]
  );

  // FIXED: Use useCallback to prevent infinite loops
  useEffect(() => {
    console.log('🛒 GrocerySelector - Selected items changed:', selectedItems);
    notifyParent(selectedItems);
  }, [selectedItems, notifyParent]);

  return (
    <div className='w-full mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
      {/* Header with modern gradient */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 text-white'>
        <div className='flex items-center'>
          {activeTab === 'grocery' ? (
            <ShoppingBasket className='w-6 h-6 mr-3 text-blue-100' />
          ) : (
            <Wine className='w-6 h-6 mr-3 text-blue-100' />
          )}
          <h2 className='text-2xl font-bold tracking-tight'>
            {t('grocery.service.title', {
              fallback: 'Grocery Shopping Service',
            })}
          </h2>
        </div>
        <p className='text-blue-100 mt-2 font-light'>
          {t('grocery.service.subtitle', {
            fallback:
              'Select the items you would like to include in your grocery list',
          })}
        </p>
      </div>

      {/* Main container with proper padding */}
      <div className='p-6 sm:p-8'>
        {/* Tab selector */}
        <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Enhanced summary bar with better item count display */}
        <div className='mt-6 mb-8'>
          <SummaryBar
            selectedCount={selectedItems.length}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Main panel with shadows and improved spacing */}
        <div className='bg-gray-50 rounded-xl p-6 mb-8'>
          {/* Main content - Categories with their items */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8'>
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className='flex flex-col gap-4 sm:gap-6'>
                {column.map((category) => (
                  <AccordionGrocery
                    key={category.id}
                    category={category}
                    selectedItems={selectedItems}
                    onItemToggle={handleToggleItem}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Special requests with improved design */}
        <div className='mb-8'>
          <SpecialRequests
            value={specialRequests}
            onChange={setSpecialRequests}
          />
        </div>

        {/* Enhanced footer section */}
        <div className='flex justify-between items-center'>
          <div className='text-sm text-gray-500 flex items-center'>
            {selectedItems.length > 0 && (
              <>
                <Check className='w-4 h-4 text-green-500 mr-1' />
                <span>
                  {selectedItems.length}{' '}
                  {selectedItems.length === 1 ? 'item' : 'items'} selected
                </span>
              </>
            )}
          </div>

          {/* Enhanced feedback section */}
          <div className='relative'>
            {selectedItems.length > 0 && (
              <>
                <span className='absolute -top-1 -right-1'>
                  <Sparkles className='w-4 h-4 text-amber-500 animate-pulse' />
                </span>
                {/* Debug info for development */}
                <div className='text-xs text-gray-400 mb-2'>
                  Categories:{' '}
                  {Object.keys(categorizeSelectedItems(selectedItems)).length}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Debug panel for development (remove in production) */}
        {process.env.NODE_ENV === 'development' && selectedItems.length > 0 && (
          <div className='mt-8 p-4 bg-gray-100 rounded-lg'>
            <h4 className='text-sm font-medium text-gray-700 mb-2'>
              Debug Info (Development Only):
            </h4>
            <div className='text-xs text-gray-600'>
              <p>
                <strong>Selected IDs:</strong> {selectedItems.join(', ')}
              </p>
              <p>
                <strong>Categories found:</strong>{' '}
                {Object.keys(categorizeSelectedItems(selectedItems)).join(', ')}
              </p>
              <details className='mt-2'>
                <summary className='cursor-pointer text-blue-600'>
                  View Structured Data
                </summary>
                <pre className='mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32'>
                  {JSON.stringify(
                    categorizeSelectedItems(selectedItems),
                    null,
                    2
                  )}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroceryShoppingSelector;
