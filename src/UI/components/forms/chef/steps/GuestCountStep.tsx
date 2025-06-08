import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Users, AlertCircle, Baby, Trash2 } from 'lucide-react';

interface Child {
  id: string;
  age: number;
}

interface GuestCountStepProps {
  formData: any;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  updateGuestCount: (increment: boolean) => void;
  updateChildrenCount: (increment: boolean) => void;
  errors: Record<string, string>;
}

const GuestCountStep: React.FC<GuestCountStepProps> = ({
  formData,
  onChange,
  updateGuestCount,
  updateChildrenCount,
  errors,
}) => {
  const { t } = useTranslation();

  // Parse children data - handle both old string format and new array format
  const parseChildrenData = (): Child[] => {
    if (!formData.childrenAges) return [];

    // If it's already an array (new format)
    if (Array.isArray(formData.childrenAges)) {
      return formData.childrenAges;
    }

    // If it's a string (old format), convert to array
    if (typeof formData.childrenAges === 'string') {
      const ages = formData.childrenAges
        .split(',')
        .map((age) => parseInt(age.trim()))
        .filter((age) => !isNaN(age));
      return ages.map((age, index) => ({ id: `child-${index}`, age }));
    }

    return [];
  };

  const children = parseChildrenData();

  // Update children ages in the form data
  const updateChildrenAges = (newChildren: Child[]) => {
    // Create a synthetic event to match the expected onChange signature
    const syntheticEvent = {
      target: {
        name: 'childrenAges',
        value: newChildren,
        type: 'custom',
      },
    } as any;

    onChange(syntheticEvent);
  };

  // Add a new child
  const addChild = () => {
    const newChildren = [...children, { id: `child-${Date.now()}`, age: 5 }];
    updateChildrenAges(newChildren);
  };

  // Remove a child
  const removeChild = (childId: string) => {
    const newChildren = children.filter((child) => child.id !== childId);
    updateChildrenAges(newChildren);
  };

  // Update child age
  const updateChildAge = (childId: string, age: number) => {
    const newChildren = children.map((child) =>
      child.id === childId ? { ...child, age } : child
    );
    updateChildrenAges(newChildren);
  };

  // Sync children count with array length
  React.useEffect(() => {
    if (formData.childrenCount !== children.length) {
      if (formData.childrenCount > children.length) {
        // Add missing children
        const newChildren = [...children];
        for (let i = children.length; i < formData.childrenCount; i++) {
          newChildren.push({ id: `child-${Date.now()}-${i}`, age: 5 });
        }
        updateChildrenAges(newChildren);
      } else {
        // Remove excess children
        const newChildren = children.slice(0, formData.childrenCount);
        updateChildrenAges(newChildren);
      }
    }
  }, [formData.childrenCount]);

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-800 border-b border-gray-200 pb-2 flex items-center'>
        <Users className='w-5 h-5 mr-2 text-amber-600' />
        {t('chef.form.step2.title', { fallback: 'Number of Guests' })}
      </h3>

      <div className='bg-amber-50 rounded-lg p-6 border border-amber-100'>
        {/* Total Guest Count */}
        <div className='mb-8'>
          <label className='flex items-center text-lg font-medium text-gray-800 mb-4'>
            <Users className='w-5 h-5 mr-2 text-amber-700' />
            {t('chef.form.guestCount', {
              fallback: 'How many guests will be dining?',
            })}{' '}
            *
          </label>

          <div className='flex items-center justify-center'>
            <button
              type='button'
              onClick={() => updateGuestCount(false)}
              className='w-12 h-12 rounded-full bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 flex items-center justify-center text-xl font-bold'
            >
              -
            </button>

            <div className='mx-8 text-center'>
              <div className='text-4xl font-light text-amber-800'>
                {formData.guestCount}
              </div>
              <div className='text-sm text-amber-700 mt-1'>
                {formData.guestCount === 1 ? 'Guest' : 'Guests'}
              </div>
            </div>

            <button
              type='button'
              onClick={() => updateGuestCount(true)}
              className='w-12 h-12 rounded-full bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 flex items-center justify-center text-xl font-bold'
            >
              +
            </button>
          </div>

          {errors.guestCount && (
            <p className='text-red-500 text-sm mt-4 text-center'>
              {errors.guestCount}
            </p>
          )}
        </div>

        {/* Children Count */}
        <div className='mt-10 pt-6 border-t border-amber-200'>
          <label className='flex items-center text-lg font-medium text-gray-800 mb-4'>
            <Baby className='w-5 h-5 mr-2 text-amber-700' />
            {t('chef.form.childrenCount', {
              fallback: 'How many children are included?',
            })}
          </label>

          <div className='flex items-center justify-center'>
            <button
              type='button'
              onClick={() => updateChildrenCount(false)}
              className='w-12 h-12 rounded-full bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 flex items-center justify-center text-xl font-bold'
            >
              -
            </button>

            <div className='mx-8 text-center'>
              <div className='text-4xl font-light text-amber-800'>
                {formData.childrenCount}
              </div>
              <div className='text-sm text-amber-700 mt-1'>
                {formData.childrenCount === 1 ? 'Child' : 'Children'}
              </div>
            </div>

            <button
              type='button'
              onClick={() => updateChildrenCount(true)}
              className='w-12 h-12 rounded-full bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 flex items-center justify-center text-xl font-bold'
            >
              +
            </button>
          </div>

          {errors.childrenCount && (
            <p className='text-red-500 text-sm mt-4 text-center'>
              {errors.childrenCount}
            </p>
          )}

          {/* Individual Children Ages - Enhanced UI */}
          {formData.childrenCount > 0 && (
            <div className='mt-6'>
              <div className='flex items-center justify-between mb-4'>
                <label className='block text-sm font-medium text-gray-700'>
                  Edades de los Niños *
                </label>
                <div className='text-xs text-gray-500'>
                  {children.length} de {formData.childrenCount} configurados
                </div>
              </div>

              <div className='space-y-3'>
                {children.map((child, index) => (
                  <div
                    key={child.id}
                    className='bg-white rounded-lg p-4 border border-amber-200 flex items-center justify-between'
                  >
                    <div className='flex items-center space-x-4'>
                      <div className='w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center'>
                        <Baby className='w-4 h-4 text-amber-600' />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700'>
                          Niño {index + 1}
                        </label>
                        <div className='flex items-center space-x-2 mt-1'>
                          <select
                            value={child.age}
                            onChange={(e) =>
                              updateChildAge(child.id, parseInt(e.target.value))
                            }
                            className='px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm'
                          >
                            {[...Array(18)].map((_, i) => (
                              <option key={i} value={i + 1}>
                                {i + 1} {i + 1 === 1 ? 'año' : 'años'}
                              </option>
                            ))}
                          </select>
                          <span className='text-xs text-gray-500'>de edad</span>
                        </div>
                      </div>
                    </div>

                    {children.length > 1 && (
                      <button
                        type='button'
                        onClick={() => removeChild(child.id)}
                        className='text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors'
                        title='Remover niño'
                      >
                        <Trash2 className='w-4 h-4' />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add more children if needed */}
                {children.length < formData.childrenCount && (
                  <button
                    type='button'
                    onClick={addChild}
                    className='w-full p-3 border-2 border-dashed border-amber-300 rounded-lg text-amber-700 hover:border-amber-400 hover:bg-amber-50 transition-colors'
                  >
                    + Agregar información del niño {children.length + 1}
                  </button>
                )}
              </div>

              {errors.childrenAges && (
                <p className='text-red-500 text-xs mt-2'>
                  {errors.childrenAges}
                </p>
              )}

              <div className='mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3'>
                <p className='text-xs text-blue-700'>
                  💡 Esta información ayuda a nuestro chef a preparar opciones
                  de menú apropiadas para cada edad
                </p>
              </div>
            </div>
          )}
        </div>

        <div className='mt-6 pt-4 border-t border-amber-200'>
          <p className='text-sm text-amber-700 text-center flex items-center justify-center'>
            <AlertCircle className='inline-block w-4 h-4 mr-2' />
            Base price is for 2 guests. Additional guests: $50 per person.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GuestCountStep;
