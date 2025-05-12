import { formatDate, formatDateRange } from '@/utils/formatDateRange';
import { useTranslation } from '@/lib/i18n/client';

const BookingSummary = ({ service, formData, totalPrice, isPremium }) => {
  const { t } = useTranslation();

  // Get summary items based on available form data
  const getSummaryItems = () => {
    const items = [
      {
        label: t('modal.service', { fallback: 'Service' }),
        value: service.name,
      },
    ];

    // Add date if available
    if (formData.date) {
      items.push({
        label: t('modal.date', { fallback: 'Date' }),
        value: formatDate(formData.date),
      });
    }

    // Add date range if available
    if (formData.dateRange) {
      items.push({
        label: t('modal.dates', { fallback: 'Dates' }),
        value: formatDateRange(formData.dateRange),
      });
    }

    // Add time if available
    if (formData.time) {
      items.push({
        label: t('modal.time', { fallback: 'Time' }),
        value: formData.time,
      });
    }

    // Add guests if available
    if (formData.guests) {
      items.push({
        label: t('modal.guests', { fallback: 'Guests' }),
        value: formData.guests,
      });
    }

    // Add children if available
    if (formData.children) {
      items.push({
        label: t('modal.children', { fallback: 'Children' }),
        value: formData.children,
      });
    }

    // Add location if available
    if (formData.location) {
      items.push({
        label: t('modal.location', { fallback: 'Location' }),
        value: formData.location,
      });
    }

    // Add theme if available
    if (formData.theme) {
      items.push({
        label: t('modal.theme', { fallback: 'Theme' }),
        value: formData.theme,
      });
    }

    // Add performer if available
    if (formData.performer) {
      items.push({
        label: t('modal.performer', { fallback: 'Performer' }),
        value: formData.performer,
      });
    }

    // Add flight details if available
    if (formData.airline && formData.flightNumber) {
      items.push({
        label: t('modal.flight', { fallback: 'Flight' }),
        value: `${formData.airline} ${formData.flightNumber}`,
      });
    }

    return items;
  };

  return (
    <div
      className={`p-4 rounded-lg mb-6 ${
        isPremium ? 'bg-amber-50' : 'bg-blue-50'
      }`}
    >
      <h4
        className={`font-medium ${
          isPremium ? 'text-amber-800' : 'text-blue-800'
        } mb-3`}
      >
        {t('modal.summary', { fallback: 'Booking Summary' })}
      </h4>

      <div className='space-y-3'>
        {getSummaryItems().map((item, index) => (
          <div key={index} className='flex justify-between text-sm'>
            <span className='text-gray-600'>{item.label}:</span>
            <span className='font-medium text-gray-900'>{item.value}</span>
          </div>
        ))}

        <div className='pt-3 border-t'>
          <div className='flex justify-between items-center'>
            <span className='font-medium text-gray-900'>
              {t('modal.total', { fallback: 'Total' })}:
            </span>
            <span
              className={`text-lg font-bold ${
                isPremium ? 'text-amber-600' : 'text-blue-600'
              }`}
            >
              ${totalPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
