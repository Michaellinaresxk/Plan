import React from 'react';
import { useTranslation } from '@/lib/i18n/client';
import { Users, AlertCircle, Baby, Trash2, Plus, Minus } from 'lucide-react';

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

    if (Array.isArray(formData.childrenAges)) {
      return formData.childrenAges;
    }

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
        const newChildren = [...children];
        for (let i = children.length; i < formData.childrenCount; i++) {
          newChildren.push({ id: `child-${Date.now()}-${i}`, age: 5 });
        }
        updateChildrenAges(newChildren);
      } else {
        const newChildren = children.slice(0, formData.childrenCount);
        updateChildrenAges(newChildren);
      }
    }
  }, [formData.childrenCount]);

  return (
    <div className='max-w-2xl mx-auto space-y-8'>
      {/* Header */}
      <div className='text-center space-y-2'>
        <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-lg mb-4'>
          <Users className='w-8 h-8 text-white' />
        </div>
        <h3 className='text-2xl font-bold text-gray-900'>
          {t('chef.form.step2.title', { fallback: 'Número de Invitados' })}
        </h3>
        <p className='text-gray-600'>
          Ayúdanos a planificar la experiencia perfecta para tu evento
        </p>
      </div>

      <div className='space-y-8'>
        {/* Total Guest Count Card */}
        <div className='bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden'>
          <div className='bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6 border-b border-amber-100'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center'>
                <Users className='w-5 h-5 text-amber-700' />
              </div>
              <div>
                <h4 className='text-lg font-semibold text-gray-900'>
                  {t('chef.form.guestCount', {
                    fallback: '¿Cuántos invitados cenarán?',
                  })}
                </h4>
                <p className='text-sm text-gray-600'>
                  Número total de comensales
                </p>
              </div>
            </div>
          </div>

          <div className='px-8 py-10'>
            <div className='flex items-center justify-center space-x-8'>
              <button
                type='button'
                onClick={() => updateGuestCount(false)}
                disabled={formData.guestCount <= 1}
                className='group w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-amber-50 hover:to-amber-100 border border-gray-200 hover:border-amber-300 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-50 disabled:hover:to-gray-100'
              >
                <Minus className='w-6 h-6 text-gray-600 group-hover:text-amber-700 transition-colors' />
              </button>

              <div className='text-center space-y-2'>
                <div className='relative'>
                  <div className='text-6xl font-light text-gray-900 bg-gradient-to-br from-amber-600 to-orange-600 bg-clip-text text-transparent'>
                    {formData.guestCount}
                  </div>
                  <div className='absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl opacity-10 -z-10 transform scale-110'></div>
                </div>
                <div className='text-sm font-medium text-gray-600 px-4 py-1 bg-gray-100 rounded-full'>
                  {formData.guestCount === 1 ? 'Invitado' : 'Invitados'}
                </div>
              </div>

              <button
                type='button'
                onClick={() => updateGuestCount(true)}
                className='group w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 border border-amber-500 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl'
              >
                <Plus className='w-6 h-6 text-white transition-colors' />
              </button>
            </div>

            {errors.guestCount && (
              <div className='mt-6 p-4 bg-red-50 rounded-2xl border border-red-200'>
                <p className='text-red-700 text-sm text-center font-medium'>
                  {errors.guestCount}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Children Count Card */}
        <div className='bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-blue-100'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center'>
                <Baby className='w-5 h-5 text-blue-700' />
              </div>
              <div>
                <h4 className='text-lg font-semibold text-gray-900'>
                  {t('chef.form.childrenCount', {
                    fallback: '¿Cuántos niños están incluidos?',
                  })}
                </h4>
                <p className='text-sm text-gray-600'>
                  Los niños tienen opciones especiales del menú
                </p>
              </div>
            </div>
          </div>

          <div className='px-8 py-8'>
            <div className='flex items-center justify-center space-x-8 mb-8'>
              <button
                type='button'
                onClick={() => updateChildrenCount(false)}
                disabled={formData.childrenCount <= 0}
                className='group w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 border border-gray-200 hover:border-blue-300 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <Minus className='w-6 h-6 text-gray-600 group-hover:text-blue-700 transition-colors' />
              </button>

              <div className='text-center space-y-2'>
                <div className='text-5xl font-light text-gray-900 bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                  {formData.childrenCount}
                </div>
                <div className='text-sm font-medium text-gray-600 px-4 py-1 bg-gray-100 rounded-full'>
                  {formData.childrenCount === 1 ? 'Niño' : 'Niños'}
                </div>
              </div>

              <button
                type='button'
                onClick={() => updateChildrenCount(true)}
                className='group w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 border border-blue-500 flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl'
              >
                <Plus className='w-6 h-6 text-white transition-colors' />
              </button>
            </div>

            {errors.childrenCount && (
              <div className='mb-6 p-4 bg-red-50 rounded-2xl border border-red-200'>
                <p className='text-red-700 text-sm text-center font-medium'>
                  {errors.childrenCount}
                </p>
              </div>
            )}

            {/* Individual Children Ages */}
            {formData.childrenCount > 0 && (
              <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <h5 className='text-lg font-semibold text-gray-900'>
                    Edades de los Niños
                  </h5>
                  <div className='flex items-center space-x-2'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                    <span className='text-sm text-gray-600'>
                      {children.length} de {formData.childrenCount} configurados
                    </span>
                  </div>
                </div>

                <div className='grid gap-4'>
                  {children.map((child, index) => (
                    <div
                      key={child.id}
                      className='group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-2xl p-6 border border-blue-200 transition-all duration-300'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4'>
                          <div className='w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg'>
                            <Baby className='w-6 h-6 text-white' />
                          </div>
                          <div className='space-y-2'>
                            <label className='block text-base font-semibold text-gray-900'>
                              Niño {index + 1}
                            </label>
                            <div className='flex items-center space-x-3'>
                              <select
                                value={child.age}
                                onChange={(e) =>
                                  updateChildAge(
                                    child.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                className='px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200'
                              >
                                {[...Array(18)].map((_, i) => (
                                  <option key={i} value={i + 1}>
                                    {i + 1} {i + 1 === 1 ? 'año' : 'años'}
                                  </option>
                                ))}
                              </select>
                              <span className='text-sm text-gray-600 font-medium'>
                                de edad
                              </span>
                            </div>
                          </div>
                        </div>

                        {children.length > 1 && (
                          <button
                            type='button'
                            onClick={() => removeChild(child.id)}
                            className='opacity-0 group-hover:opacity-100 w-10 h-10 text-red-500 hover:text-white hover:bg-red-500 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center'
                            title='Remover niño'
                          >
                            <Trash2 className='w-5 h-5' />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {children.length < formData.childrenCount && (
                    <button
                      type='button'
                      onClick={addChild}
                      className='group w-full p-6 border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-2xl text-blue-700 hover:text-blue-800 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-3'
                    >
                      <Plus className='w-5 h-5 group-hover:scale-110 transition-transform' />
                      <span className='font-medium'>
                        Agregar información del niño {children.length + 1}
                      </span>
                    </button>
                  )}
                </div>

                {errors.childrenAges && (
                  <div className='p-4 bg-red-50 rounded-2xl border border-red-200'>
                    <p className='text-red-700 text-sm font-medium'>
                      {errors.childrenAges}
                    </p>
                  </div>
                )}

                <div className='bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6'>
                  <div className='flex items-start space-x-3'>
                    <div className='w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5'>
                      <span className='text-white text-sm'>💡</span>
                    </div>
                    <p className='text-sm text-gray-700 leading-relaxed'>
                      <strong className='text-indigo-700'>Tip del chef:</strong>{' '}
                      Esta información nos ayuda a preparar opciones de menú
                      apropiadas para cada edad, asegurando que todos disfruten
                      de una experiencia culinaria perfecta.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestCountStep;
