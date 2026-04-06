'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Grid,
  Anchor,
  Map,
  Car,
  Heart,
  Utensils,
  Music,
  X,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';
import { Service, BookingDate } from '@/types/type';
import ServiceCard from './ServiceCard';
import { useBooking } from '@/context/BookingContext';
import ServiceManager from '@/constants/services/ServiceManager';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceListProps {
  services: Service[];
  servicePath: string;
  variant?: 'light' | 'dark';
  textColor?: string;
  viewContext?: 'standard-view' | 'premium-view';
}

// ─── Constants (outside component — never recreated) ──────────────────────────

const CATEGORY_ICONS = {
  all: Grid,
  'water-activities': Anchor,
  tours: Map,
  transportation: Car,
  wellness: Heart,
  'food-drinks': Utensils,
  leisure: Music,
} as const;

const CATEGORY_IDS = Object.keys(
  CATEGORY_ICONS,
) as (keyof typeof CATEGORY_ICONS)[];

/*
  Theme tokens — light for standard page (stone-50 bg),
  dark for premium page (stone-950 bg).
  Every visual difference is here, JSX stays shared.
*/
const THEME = {
  light: {
    section: 'bg-transparent',
    pillDefault:
      'bg-white border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-300',
    pillActive: 'bg-stone-900 border-stone-900 text-white',
    count: 'text-stone-900',
    countLabel: 'text-stone-400',
    clear: 'text-stone-400 hover:text-stone-700',
    emptyIcon: 'bg-stone-100',
    emptyIconColor: 'text-stone-300',
    emptyTitle: 'text-stone-900',
    emptyDesc: 'text-stone-400',
    emptyBtn: 'bg-stone-900 text-white hover:bg-stone-800',
  },
  dark: {
    section: 'bg-transparent',
    pillDefault:
      'bg-stone-900 border-stone-800 text-stone-500 hover:text-white hover:border-stone-700',
    pillActive: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    count: 'text-white',
    countLabel: 'text-stone-500',
    clear: 'text-stone-500 hover:text-stone-300',
    emptyIcon: 'bg-stone-800',
    emptyIconColor: 'text-stone-600',
    emptyTitle: 'text-white',
    emptyDesc: 'text-stone-500',
    emptyBtn:
      'border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  servicePath,
  variant = 'light',
  viewContext,
}) => {
  const { t } = useTranslation();
  const {
    packageType,
    selectedServices,
    addService,
    removeService,
    bookService,
  } = useBooking();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const isDark = variant === 'dark' || viewContext === 'premium-view';
  const theme = isDark ? THEME.dark : THEME.light;

  // ── Category labels (depend on t, so inside component but memoized) ─────

  const categories = useMemo(
    () =>
      CATEGORY_IDS.map((id) => ({
        id,
        icon: CATEGORY_ICONS[id],
        name: t(
          id === 'all'
            ? 'services.standard.serviceGallery.categories.all'
            : `services.standard.serviceGallery.categories.${
                id === 'water-activities'
                  ? 'waterActivities'
                  : id === 'food-drinks'
                    ? 'foodDrinks'
                    : id
              }`,
        ),
      })),
    [t],
  );

  // ── Filtering ───────────────────────────────────────────────────────────

  const filteredServices = useMemo(() => {
    if (!packageType) return [];

    let result = services.filter((s) => s.packageType.includes(packageType));

    if (activeCategory !== 'all') {
      result = result.filter(
        (s) => ServiceManager.getCategory(s.id) === activeCategory,
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.description.toLowerCase().includes(term),
      );
    }

    return result;
  }, [services, packageType, activeCategory, searchTerm]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const isSelected = useCallback(
    (id: string) => selectedServices.some((s) => s.id === id),
    [selectedServices],
  );

  const handleToggle = useCallback(
    (service: Service) => {
      if (isSelected(service.id)) {
        removeService(service.id);
      } else {
        addService(service);
      }
    },
    [isSelected, addService, removeService],
  );

  const handleBook = useCallback(
    (service: Service, dates: BookingDate, guests: number) => {
      bookService(service, dates, guests);
    },
    [bookService],
  );

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setActiveCategory('all');
  }, []);

  if (!packageType) return null;

  const hasActiveFilters = searchTerm || activeCategory !== 'all';

  return (
    <section id='services' className={theme.section}>
      {/* ── Category filters ────────────────────────────────────── */}
      <div className='mb-8'>
        <div className='flex flex-wrap gap-2'>
          {categories.map(({ id, icon: Icon, name }) => {
            const isActive = activeCategory === id;
            return (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`
                  inline-flex items-center gap-1.5 px-3.5 py-2 border
                  text-xs font-medium tracking-wide transition-colors duration-200
                  ${isActive ? theme.pillActive : theme.pillDefault}
                `}
              >
                <Icon className='w-3.5 h-3.5' />
                <span className='hidden sm:inline'>{name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results count ───────────────────────────────────────── */}
      <div className='flex items-center justify-between mb-6'>
        <p className={`text-xs ${theme.countLabel}`}>
          <span className={`font-semibold ${theme.count}`}>
            {filteredServices.length}
          </span>{' '}
          {filteredServices.length === 1 ? 'service' : 'services'}
        </p>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className={`inline-flex items-center gap-1 text-xs transition-colors ${theme.clear}`}
          >
            <X className='w-3 h-3' />
            Clear filters
          </button>
        )}
      </div>

      {/* ── Grid ────────────────────────────────────────────────── */}
      {filteredServices.length > 0 ? (
        <div className='grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              servicePath={servicePath}
              isSelected={isSelected(service.id)}
              packageType={packageType}
              onToggle={handleToggle}
              onBookService={handleBook}
              viewContext={viewContext}
            />
          ))}
        </div>
      ) : (
        /* ── Empty state ──────────────────────────────────────── */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='text-center py-16'
        >
          <div className='max-w-xs mx-auto'>
            <div
              className={`w-12 h-12 mx-auto mb-5 flex items-center justify-center ${theme.emptyIcon}`}
            >
              <Search className={`w-5 h-5 ${theme.emptyIconColor}`} />
            </div>
            <h3 className={`text-sm font-semibold mb-1.5 ${theme.emptyTitle}`}>
              No services found
            </h3>
            <p className={`text-xs leading-relaxed mb-5 ${theme.emptyDesc}`}>
              Try adjusting your filters to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className={`px-5 py-2.5 text-xs font-medium tracking-wide uppercase transition-colors duration-200 ${theme.emptyBtn}`}
            >
              Clear all filters
            </button>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default ServiceList;
