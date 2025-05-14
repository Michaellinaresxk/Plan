import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Predefined color options for easy selection
  const colorOptions = [
    '#FFCD61', // Primary brand color
    '#F44336', // Red
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#673AB7', // Deep Purple
    '#3F51B5', // Indigo
    '#2196F3', // Blue
    '#03A9F4', // Light Blue
    '#00BCD4', // Cyan
    '#009688', // Teal
    '#4CAF50', // Green
    '#8BC34A', // Light Green
    '#CDDC39', // Lime
    '#FFEB3B', // Yellow
    '#FFC107', // Amber
    '#FF9800', // Orange
    '#FF5722', // Deep Orange
    '#795548', // Brown
    '#9E9E9E', // Grey
    '#607D8B', // Blue Grey
    '#FFFFFF', // White
    '#000000', // Black
  ];

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative' ref={pickerRef}>
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500'
        style={{ backgroundColor: color }}
      >
        <Palette
          size={16}
          className={`${
            color === '#FFFFFF' || color === '#FFEB3B' || color === '#FFCD61'
              ? 'text-gray-700'
              : 'text-white'
          }`}
        />
      </button>

      {isOpen && (
        <div className='absolute z-10 mt-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200'>
          <div className='grid grid-cols-6 gap-2'>
            {colorOptions.map((colorOption) => (
              <button
                key={colorOption}
                type='button'
                className={`w-6 h-6 rounded-full border ${
                  colorOption === color
                    ? 'border-gray-700 ring-2 ring-amber-500'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: colorOption }}
                onClick={() => {
                  onChange(colorOption);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>

          <div className='mt-2 pt-2 border-t border-gray-200'>
            <label className='block text-xs text-gray-500 mb-1'>Custom</label>
            <input
              type='color'
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className='w-full h-8 cursor-pointer'
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
