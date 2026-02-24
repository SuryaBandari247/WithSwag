// Payment utility functions

const PAYMENT_VALIDITY_HOURS = 24; // Payment valid for 24 hours

export const checkPaymentStatus = (): boolean => {
  const status = sessionStorage.getItem('easyportrait_payment_status');
  const timestamp = sessionStorage.getItem('easyportrait_payment_timestamp');
  
  if (status !== 'paid' || !timestamp) {
    return false;
  }
  
  // Check if payment is still valid (within 24 hours)
  const paymentTime = parseInt(timestamp, 10);
  const now = Date.now();
  const hoursSincePayment = (now - paymentTime) / (1000 * 60 * 60);
  
  if (hoursSincePayment > PAYMENT_VALIDITY_HOURS) {
    // Payment expired, clear it
    clearPaymentStatus();
    return false;
  }
  
  return true;
};

export const clearPaymentStatus = (): void => {
  sessionStorage.removeItem('easyportrait_payment_status');
  sessionStorage.removeItem('easyportrait_payment_timestamp');
};

export const getPaymentAmount = (isCollage: boolean, numPhotos?: number): number => {
  if (isCollage) {
    // Collage pricing: flat rate
    return 8.00;
  }
  // Single photo price
  return 3.00;
};

export const getPaymentDescription = (isCollage: boolean, numPhotos?: number, passportSize?: string): string => {
  if (isCollage) {
    return `Photo collage with ${numPhotos || 4} photos${passportSize ? ` (${passportSize})` : ''}`;
  }
  return `Single passport photo${passportSize ? ` (${passportSize})` : ''}`;
};

export const getCurrencySymbol = (): string => {
  return '€';
};
