import { Search, SlidersHorizontal } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <div className='bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 p-6 mb-8'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-semibold text-gray-800 flex items-center gap-3'>
          <div className='p-2 bg-emerald-100 rounded-lg'>
            <SlidersHorizontal className='w-5 h-5 text-emerald-600' />
          </div>
          Find Your Perfect Treatment
        </h3>
        <button
          onClick={onClearFilters}
          className='text-sm text-gray-600 hover:text-emerald-600 transition-colors px-4 py-2 rounded-lg hover:bg-emerald-50'
        >
          Clear All
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            Search Treatments
          </label>
          <div className='relative'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
            <input
              type='text'
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder='Find your perfect massage...'
              className='w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all bg-white/70'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            Wellness Category
          </label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all bg-white/70'
          >
            <option value=''>All Categories</option>
            <option value='relaxation'>Deep Relaxation</option>
            <option value='therapeutic'>Therapeutic Healing</option>
            <option value='signature'>Signature Experiences</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            Pressure Intensity
          </label>
          <select
            value={filters.intensity}
            onChange={(e) => onFilterChange('intensity', e.target.value)}
            className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all bg-white/70'
          >
            <option value=''>All Intensities</option>
            <option value='gentle'>Gentle & Soothing</option>
            <option value='medium'>Balanced Pressure</option>
            <option value='strong'>Deep & Therapeutic</option>
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-3'>
            Investment Range
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => onFilterChange('priceRange', e.target.value)}
            className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all bg-white/70'
          >
            <option value=''>All Prices</option>
            <option value='0-120'>$100 - $120</option>
            <option value='120-180'>$120 - $180</option>
            <option value='180-250'>$180 - $250</option>
            <option value='250+'>$250+</option>
          </select>
        </div>
      </div>

      <div className='mt-6 flex items-center gap-6'>
        <label className='flex items-center group cursor-pointer'>
          <input
            type='checkbox'
            checked={filters.premiumOnly}
            onChange={(e) => onFilterChange('premiumOnly', e.target.checked)}
            className='w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-all'
          />
          <span className='ml-3 text-sm text-gray-700 group-hover:text-emerald-600 transition-colors'>
            Premium Signature Treatments Only
          </span>
        </label>
      </div>
    </div>
  );
};

export default FilterBar;
