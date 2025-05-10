// Helper function to format service details for display
export const formatServiceDetails = (formData: any): string => {
  const details = [];

  if (formData.date) {
    details.push(`Date: ${new Date(formData.date).toLocaleDateString()}`);
  }

  if (formData.time) {
    details.push(`Time: ${formData.time}`);
  }

  if (formData.guestCount) {
    details.push(`Guests: ${formData.guestCount}`);
  }

  if (formData.vehicleType) {
    details.push(`Vehicle: ${formData.vehicleType}`);
  }

  if (formData.chefType) {
    details.push(`Chef: ${formData.chefType}`);
  }

  if (formData.airline && formData.flightNumber) {
    details.push(`Flight: ${formData.airline} ${formData.flightNumber}`);
  }

  return details.join(' • ');
};
