import { useTranslation } from '@/lib/i18n/client';
import { ServiceFormConfig } from './formFields';

export const getServiceFormConfig = (
  service: Service
): ServiceFormConfig | null => {
  // Define configurations for each service type
  const { t } = useTranslation();
  const serviceConfigs: Record<string, ServiceFormConfig> = {
    // Karaoke service configuration
    karaoke: {
      steps: [
        {
          id: 'date-time',
          title: t('modal.dateTime', { fallback: 'Date & Time' }),
          fields: [
            {
              id: 'date',
              type: 'date',
              label: t('modal.date', { fallback: 'Date' }),
              required: true,
            },
            {
              id: 'time',
              type: 'time',
              label: t('modal.time', { fallback: 'Time' }),
              required: true,
            },
          ],
        },
        {
          id: 'theme',
          title: t('modal.theme', { fallback: 'Theme & Details' }),
          fields: [
            {
              id: 'theme',
              type: 'select',
              label: t('modal.selectTheme', { fallback: 'Select Theme' }),
              required: true,
              options: [
                {
                  value: 'pop',
                  label: t('modal.themes.pop', { fallback: 'Pop Hits' }),
                },
                {
                  value: 'rock',
                  label: t('modal.themes.rock', { fallback: 'Rock Classics' }),
                },
                {
                  value: 'latin',
                  label: t('modal.themes.latin', { fallback: 'Latin Vibes' }),
                },
                {
                  value: '80s',
                  label: t('modal.themes.80s', { fallback: '80s Throwback' }),
                },
                {
                  value: '90s',
                  label: t('modal.themes.90s', { fallback: '90s Hits' }),
                },
                {
                  value: 'country',
                  label: t('modal.themes.country', { fallback: 'Country' }),
                },
              ],
            },
            {
              id: 'guests',
              type: 'number',
              label: t('modal.guests', { fallback: 'Number of Guests' }),
              required: true,
              validation: {
                min: 1,
                max: 20,
              },
            },
            {
              id: 'specialRequests',
              type: 'textarea',
              label: t('modal.specialRequests', {
                fallback: 'Special Requests',
              }),
              placeholder: t('modal.specialRequestsPlaceholder', {
                fallback: 'Any specific songs or artists you prefer?',
              }),
              required: false,
            },
          ],
        },
      ],
      submitButtonText: t('modal.bookKaraoke', { fallback: 'Book Karaoke' }),
    },

    // Babysitter service configuration
    'baby-sitter': {
      steps: [
        {
          id: 'date-time',
          title: t('modal.dateTime', { fallback: 'Date & Time' }),
          fields: [
            {
              id: 'date',
              type: 'date',
              label: t('modal.date', { fallback: 'Date' }),
              required: true,
            },
            {
              id: 'time',
              type: 'time',
              label: t('modal.startTime', { fallback: 'Start Time' }),
              required: true,
            },
            {
              id: 'duration',
              type: 'select',
              label: t('modal.duration', { fallback: 'Duration' }),
              required: true,
              options: [
                { value: '2', label: '2 hours' },
                { value: '3', label: '3 hours' },
                { value: '4', label: '4 hours' },
                { value: '5', label: '5 hours' },
                { value: '6', label: '6 hours' },
                { value: '8', label: '8 hours' },
              ],
            },
          ],
        },
        {
          id: 'children',
          title: t('modal.childrenDetails', { fallback: 'Children Details' }),
          fields: [
            {
              id: 'children',
              type: 'number',
              label: t('modal.numberOfChildren', {
                fallback: 'Number of Children',
              }),
              required: true,
              validation: {
                min: 1,
                max: 5,
              },
            },
            {
              id: 'childrenAges',
              type: 'text',
              label: t('modal.childrenAges', { fallback: 'Children Ages' }),
              placeholder: t('modal.childrenAgesPlaceholder', {
                fallback: 'e.g., 3, 5, 7',
              }),
              required: true,
            },
            {
              id: 'specialNeeds',
              type: 'textarea',
              label: t('modal.specialNeeds', {
                fallback: 'Special Needs or Instructions',
              }),
              required: false,
            },
          ],
        },
      ],
      submitButtonText: t('modal.bookBabysitter', {
        fallback: 'Book Babysitter',
      }),
    },

    // Custom Decoration service configuration
    'custom-decorations': {
      steps: [
        {
          id: 'occasion',
          title: t('modal.occasion', { fallback: 'Occasion Details' }),
          fields: [
            {
              id: 'occasion',
              type: 'select',
              label: t('modal.selectOccasion', { fallback: 'Select Occasion' }),
              required: true,
              options: [
                {
                  value: 'birthday',
                  label: t('modal.occasions.birthday', {
                    fallback: 'Birthday',
                  }),
                },
                {
                  value: 'anniversary',
                  label: t('modal.occasions.anniversary', {
                    fallback: 'Anniversary',
                  }),
                },
                {
                  value: 'wedding',
                  label: t('modal.occasions.wedding', { fallback: 'Wedding' }),
                },
                {
                  value: 'babyShower',
                  label: t('modal.occasions.babyShower', {
                    fallback: 'Baby Shower',
                  }),
                },
                {
                  value: 'other',
                  label: t('modal.occasions.other', { fallback: 'Other' }),
                },
              ],
            },
            {
              id: 'occasionDetails',
              type: 'text',
              label: t('modal.occasionDetails', {
                fallback: 'Occasion Details',
              }),
              placeholder: t('modal.occasionDetailsPlaceholder', {
                fallback: "e.g., Jake's 30th Birthday",
              }),
              required: true,
            },
            {
              id: 'date',
              type: 'date',
              label: t('modal.date', { fallback: 'Date' }),
              required: true,
            },
            {
              id: 'time',
              type: 'time',
              label: t('modal.time', { fallback: 'Time' }),
              required: true,
            },
          ],
        },
        {
          id: 'design',
          title: t('modal.designPreferences', {
            fallback: 'Design Preferences',
          }),
          fields: [
            {
              id: 'colors',
              type: 'text',
              label: t('modal.preferredColors', {
                fallback: 'Preferred Colors',
              }),
              placeholder: t('modal.preferredColorsPlaceholder', {
                fallback: 'e.g., Blue, Silver, White',
              }),
              required: true,
            },
            {
              id: 'referenceImage',
              type: 'upload',
              label: t('modal.referenceImage', { fallback: 'Reference Image' }),
              helpText: t('modal.referenceImageHelp', {
                fallback: 'Upload an image for reference',
              }),
              required: false,
            },
            {
              id: 'location',
              type: 'text',
              label: t('modal.location', { fallback: 'Location' }),
              required: true,
            },
          ],
        },
        {
          id: 'additionalDetails',
          title: t('modal.additionalDetails', {
            fallback: 'Additional Details',
          }),
          fields: [
            {
              id: 'additionalInfo',
              type: 'textarea',
              label: t('modal.additionalInfo', {
                fallback: 'Additional Information',
              }),
              placeholder: t('modal.additionalInfoPlaceholder', {
                fallback: 'Any specific themes or design elements you want?',
              }),
              required: false,
            },
          ],
        },
      ],
      submitButtonText: t('modal.bookDecoration', {
        fallback: 'Book Decoration',
      }),
    },

    // Transport service configuration
    'airport-transfers': {
      steps: [
        {
          id: 'arrival',
          title: t('modal.arrivalDetails', { fallback: 'Arrival Details' }),
          fields: [
            {
              id: 'date',
              type: 'date',
              label: t('modal.arrivalDate', { fallback: 'Arrival Date' }),
              required: true,
            },
            {
              id: 'airline',
              type: 'text',
              label: t('modal.airline', { fallback: 'Airline' }),
              required: true,
            },
            {
              id: 'flightNumber',
              type: 'text',
              label: t('modal.flightNumber', { fallback: 'Flight Number' }),
              required: true,
            },
            {
              id: 'arrivalTime',
              type: 'time',
              label: t('modal.estimatedArrivalTime', {
                fallback: 'Estimated Arrival Time',
              }),
              required: true,
            },
          ],
        },
        {
          id: 'passengers',
          title: t('modal.passengerDetails', { fallback: 'Passenger Details' }),
          fields: [
            {
              id: 'adults',
              type: 'number',
              label: t('modal.adults', { fallback: 'Number of Adults' }),
              required: true,
              validation: {
                min: 1,
                max: 10,
              },
            },
            {
              id: 'children',
              type: 'number',
              label: t('modal.children', { fallback: 'Number of Children' }),
              required: false,
              validation: {
                min: 0,
                max: 10,
              },
            },
            {
              id: 'needCarSeat',
              type: 'checkbox',
              label: t('modal.needCarSeat', { fallback: 'Need Car Seat(s)' }),
              required: false,
            },
            {
              id: 'carSeats',
              type: 'number',
              label: t('modal.carSeats', { fallback: 'Number of Car Seats' }),
              required: false,
              dependsOn: { field: 'needCarSeat', value: true },
              validation: {
                min: 1,
                max: 5,
              },
            },
          ],
        },
        {
          id: 'destination',
          title: t('modal.destinationDetails', {
            fallback: 'Destination Details',
          }),
          fields: [
            {
              id: 'destinationAddress',
              type: 'text',
              label: t('modal.destinationAddress', {
                fallback: 'Destination Address',
              }),
              required: true,
            },
            {
              id: 'specialRequests',
              type: 'textarea',
              label: t('modal.specialRequests', {
                fallback: 'Special Requests',
              }),
              required: false,
            },
          ],
        },
      ],
      submitButtonText: t('modal.bookTransport', {
        fallback: 'Book Transport',
      }),
    },

    // Grocery service configuration
    'grocery-shopping': {
      steps: [
        {
          id: 'delivery',
          title: t('modal.deliveryDetails', { fallback: 'Delivery Details' }),
          fields: [
            {
              id: 'date',
              type: 'date',
              label: t('modal.deliveryDate', { fallback: 'Delivery Date' }),
              required: true,
            },
            {
              id: 'time',
              type: 'time',
              label: t('modal.deliveryTime', { fallback: 'Delivery Time' }),
              required: true,
            },
            {
              id: 'location',
              type: 'text',
              label: t('modal.deliveryLocation', {
                fallback: 'Delivery Location',
              }),
              required: true,
            },
          ],
        },
        {
          id: 'dietary',
          title: t('modal.dietaryPreferences', {
            fallback: 'Dietary Preferences',
          }),
          fields: [
            {
              id: 'dietaryRestrictions',
              type: 'textarea',
              label: t('modal.dietaryRestrictions', {
                fallback: 'Dietary Restrictions',
              }),
              placeholder: t('modal.dietaryRestrictionsPlaceholder', {
                fallback: 'Please list any dietary restrictions',
              }),
              required: false,
            },
            {
              id: 'allergies',
              type: 'textarea',
              label: t('modal.allergies', { fallback: 'Food Allergies' }),
              placeholder: t('modal.allergiesPlaceholder', {
                fallback: 'Please list any food allergies',
              }),
              required: false,
            },
            {
              id: 'allergyDisclaimer',
              type: 'checkbox',
              label: t('modal.allergyDisclaimer', {
                fallback:
                  'I authorize bringing allergen-containing foods for other guests',
              }),
              helpText: t('modal.allergyDisclaimerHelp', {
                fallback:
                  'We can bring foods containing allergens that you listed above for other guests',
              }),
              required: false,
            },
          ],
        },
        {
          id: 'additional',
          title: t('modal.additionalRequests', {
            fallback: 'Additional Requests',
          }),
          fields: [
            {
              id: 'specialRequests',
              type: 'textarea',
              label: t('modal.specialRequests', {
                fallback: 'Special Requests',
              }),
              placeholder: t('modal.groceryRequestsPlaceholder', {
                fallback: 'Any specific brands, items, or quantities?',
              }),
              required: false,
            },
          ],
        },
      ],
      submitButtonText: t('modal.orderGroceries', {
        fallback: 'Order Groceries',
      }),
    },

    // Yoga service configuration
    'yoga-standard': {
      steps: [
        {
          id: 'session',
          title: t('modal.sessionDetails', { fallback: 'Session Details' }),
          fields: [
            {
              id: 'date',
              type: 'date',
              label: t('modal.date', { fallback: 'Date' }),
              required: true,
            },
            {
              id: 'sessionTime',
              type: 'select',
              label: t('modal.sessionTime', { fallback: 'Session Time' }),
              required: true,
              options: [
                {
                  value: 'morning',
                  label: t('modal.morning', { fallback: 'Morning (7am-10am)' }),
                },
                {
                  value: 'afternoon',
                  label: t('modal.afternoon', {
                    fallback: 'Afternoon (2pm-5pm)',
                  }),
                },
              ],
            },
            {
              id: 'guests',
              type: 'number',
              label: t('modal.participants', {
                fallback: 'Number of Participants',
              }),
              required: true,
              validation: {
                min: 1,
                max: 10,
              },
            },
          ],
        },
        {
          id: 'preferences',
          title: t('modal.yogaPreferences', { fallback: 'Yoga Preferences' }),
          fields: [
            {
              id: 'yogaStyle',
              type: 'select',
              label: t('modal.yogaStyle', { fallback: 'Yoga Style' }),
              required: true,
              options: [
                {
                  value: 'vinyasa',
                  label: t('modal.yogaStyles.vinyasa', {
                    fallback: 'Vinyasa Flow',
                  }),
                },
                {
                  value: 'hatha',
                  label: t('modal.yogaStyles.hatha', {
                    fallback: 'Hatha Yoga',
                  }),
                },
                {
                  value: 'restorative',
                  label: t('modal.yogaStyles.restorative', {
                    fallback: 'Restorative Yoga',
                  }),
                },
                {
                  value: 'power',
                  label: t('modal.yogaStyles.power', {
                    fallback: 'Power Yoga',
                  }),
                },
              ],
            },
            {
              id: 'experienceLevel',
              type: 'select',
              label: t('modal.experienceLevel', {
                fallback: 'Experience Level',
              }),
              required: true,
              options: [
                {
                  value: 'beginner',
                  label: t('modal.levels.beginner', { fallback: 'Beginner' }),
                },
                {
                  value: 'intermediate',
                  label: t('modal.levels.intermediate', {
                    fallback: 'Intermediate',
                  }),
                },
                {
                  value: 'advanced',
                  label: t('modal.levels.advanced', { fallback: 'Advanced' }),
                },
                {
                  value: 'mixed',
                  label: t('modal.levels.mixed', { fallback: 'Mixed Levels' }),
                },
              ],
            },
            {
              id: 'mobility',
              type: 'textarea',
              label: t('modal.mobilityIssues', {
                fallback: 'Mobility Issues or Injuries',
              }),
              placeholder: t('modal.mobilityIssuesPlaceholder', {
                fallback: 'Please describe any mobility issues or injuries',
              }),
              required: false,
            },
          ],
        },
      ],
      submitButtonText: t('modal.bookYogaSession', {
        fallback: 'Book Yoga Session',
      }),
    },

    // Saona Island service configuration
    'saona-island': {
      steps: [
        {
          id: 'trip',
          title: t('modal.tripDetails', { fallback: 'Trip Details' }),
          fields: [
            {
              id: 'date',
              type: 'date',
              label: t('modal.tripDate', { fallback: 'Trip Date' }),
              required: true,
            },
            {
              id: 'guests',
              type: 'number',
              label: t('modal.guests', { fallback: 'Number of Guests' }),
              required: true,
              validation: {
                min: 1,
                max: 20,
              },
            },
            {
              id: 'pickupLocation',
              type: 'text',
              label: t('modal.pickupLocation', { fallback: 'Pickup Location' }),
              required: true,
            },
          ],
        },
        {
          id: 'preferences',
          title: t('modal.tripPreferences', { fallback: 'Trip Preferences' }),
          fields: [
            {
              id: 'mealPreference',
              type: 'select',
              label: t('modal.mealPreference', { fallback: 'Meal Preference' }),
              required: true,
              options: [
                {
                  value: 'standard',
                  label: t('modal.meals.standard', {
                    fallback: 'Standard Meal',
                  }),
                },
                {
                  value: 'vegetarian',
                  label: t('modal.meals.vegetarian', {
                    fallback: 'Vegetarian',
                  }),
                },
                {
                  value: 'vegan',
                  label: t('modal.meals.vegan', { fallback: 'Vegan' }),
                },
              ],
            },
            {
              id: 'specialRequests',
              type: 'textarea',
              label: t('modal.specialRequests', {
                fallback: 'Special Requests',
              }),
              required: false,
            },
          ],
        },
      ],
      submitButtonText: t('modal.bookIslandTrip', {
        fallback: 'Book Island Trip',
      }),
    },

    // Live Music service configuration
    'live-music': {
      steps: [
        {
          id: 'event',
          title: t('modal.eventDetails', { fallback: 'Event Details' }),
          fields: [
            {
              id: 'date',
              type: 'date',
              label: t('modal.eventDate', { fallback: 'Event Date' }),
              required: true,
            },
            {
              id: 'time',
              type: 'time',
              label: t('modal.startTime', { fallback: 'Start Time' }),
              required: true,
            },
            {
              id: 'duration',
              type: 'select',
              label: t('modal.duration', { fallback: 'Duration' }),
              required: true,
              options: [
                { value: '1', label: '1 hour' },
                { value: '2', label: '2 hours' },
                { value: '3', label: '3 hours' },
                { value: '4', label: '4 hours' },
              ],
            },
          ],
        },
        {
          id: 'music',
          title: t('modal.musicPreferences', { fallback: 'Music Preferences' }),
          fields: [
            {
              id: 'performer',
              type: 'select',
              label: t('modal.performerType', { fallback: 'Performer Type' }),
              required: true,
              options: [
                {
                  value: 'soloist',
                  label: t('modal.performers.soloist', {
                    fallback: 'Solo Artist',
                  }),
                },
                {
                  value: 'duo',
                  label: t('modal.performers.duo', { fallback: 'Duo' }),
                },
                {
                  value: 'trio',
                  label: t('modal.performers.trio', { fallback: 'Trio' }),
                },
                {
                  value: 'band',
                  label: t('modal.performers.band', { fallback: 'Full Band' }),
                },
              ],
            },
            {
              id: 'genre',
              type: 'select',
              label: t('modal.musicGenre', { fallback: 'Music Genre' }),
              required: true,
              options: [
                {
                  value: 'pop',
                  label: t('modal.genres.pop', { fallback: 'Pop' }),
                },
                {
                  value: 'rock',
                  label: t('modal.genres.rock', { fallback: 'Rock' }),
                },
                {
                  value: 'jazz',
                  label: t('modal.genres.jazz', { fallback: 'Jazz' }),
                },
                {
                  value: 'latin',
                  label: t('modal.genres.latin', { fallback: 'Latin' }),
                },
                {
                  value: 'acoustic',
                  label: t('modal.genres.acoustic', { fallback: 'Acoustic' }),
                },
              ],
            },
            {
              id: 'songRequests',
              type: 'textarea',
              label: t('modal.songRequests', { fallback: 'Song Requests' }),
              placeholder: t('modal.songRequestsPlaceholder', {
                fallback: 'List any specific songs you would like performed',
              }),
              required: false,
            },
          ],
        },
        {
          id: 'venue',
          title: t('modal.venueDetails', { fallback: 'Venue Details' }),
          fields: [
            {
              id: 'venue',
              type: 'text',
              label: t('modal.venueLocation', { fallback: 'Venue Location' }),
              required: true,
            },
            {
              id: 'specialRequests',
              type: 'textarea',
              label: t('modal.specialRequests', {
                fallback: 'Special Requests',
              }),
              required: false,
            },
          ],
        },
      ],
      submitButtonText: t('modal.bookLiveMusic', {
        fallback: 'Book Live Music',
      }),
    },

    // Default service configuration (fallback)
    default: {
      steps: [
        {
          id: 'dates',
          title: t('modal.dates', { fallback: 'Select Dates' }),
          fields: [
            {
              id: 'dateRange',
              type: 'dateRange',
              label: t('modal.selectDates', { fallback: 'Select Dates' }),
              required: true,
            },
          ],
        },
        {
          id: 'guests',
          title: t('modal.guests', { fallback: 'Guests & Confirm' }),
          fields: [
            {
              id: 'guests',
              type: 'number',
              label: t('modal.guests', { fallback: 'Number of Guests' }),
              required: true,
              validation: {
                min: 1,
                max: 10,
              },
            },
          ],
        },
      ],
    },
  };

  // First check for exact service ID match
  if (serviceConfigs[service.id]) {
    return serviceConfigs[service.id];
  }

  // If no exact match, try to find a generic match based on service type or category
  // This could be expanded based on your service categorization
  if (
    service.id.includes('rental') ||
    service.id.includes('cart') ||
    service.id.includes('bike')
  ) {
    return serviceConfigs['default']; // Use the date range + guests form for rentals
  }

  // Fallback to default configuration
  return serviceConfigs['default'];
};
