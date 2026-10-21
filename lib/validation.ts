/**
 * Backend Data Sanitization & Strict Validation
 * Defense in depth: prevents NoSQL injection, XSS, and payload tampering.
 */

// HTML entity escaping for XSS prevention & Null byte injection defense
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '')   // Strip dangerous null bytes
    .replace(/[<>]/g, '') // Strip potential script/html angle brackets
    .trim()
    .slice(0, 5000);      // Bound string length to prevent memory exhaustion
}

export function sanitizeUrl(url: unknown): string {
  if (typeof url !== 'string') return '';
  const trimmed = url.replace(/\0/g, '').trim();
  // Prevent protocol-relative bypasses (e.g. //evil.com or /\evil.com)
  if (trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return '';
  }
  // Allow safe protocols (http, https, relative paths, data URIs)
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('data:image/')
  ) {
    return trimmed;
  }
  return '';
}

export function sanitizeArrayOfStrings(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .map(item => (typeof item === 'string' ? sanitizeString(item) : ''))
    .filter(Boolean);
}

export type ValidationResult<T> =
  | { isValid: true; errors: string[]; data: T }
  | { isValid: false; errors: string[]; data?: undefined };

export function validatePackagePayload(body: any): ValidationResult<any> {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object'] };
  }

  const title = sanitizeString(body.title);
  if (!title || title.length < 2) {
    errors.push('Title is required and must be at least 2 characters');
  }

  const destination = sanitizeString(body.destination);
  if (!destination) {
    errors.push('Destination is required');
  }

  const price = sanitizeString(String(body.price || ''));
  if (!price || isNaN(Number(price)) || Number(price) <= 0) {
    errors.push('Price must be a valid positive number');
  }

  const image = sanitizeUrl(body.image);
  if (!image) {
    errors.push('Main image URL is required and must be valid');
  }

  const rating = body.rating !== undefined ? String(body.rating).trim() : '5.0';
  const ratingNum = parseFloat(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    errors.push('Rating must be between 1.0 and 5.0');
  }

  const reviewsCount = parseInt(body.reviewsCount, 10);
  const safeReviewsCount = isNaN(reviewsCount) || reviewsCount < 0 ? 0 : reviewsCount;

  const images = sanitizeArrayOfStrings(body.images);
  if (images.length === 0 && image) {
    images.push(image);
  }

  const description = sanitizeString(body.description || '');
  const highlights = sanitizeArrayOfStrings(body.highlights);
  const quickFacts = sanitizeArrayOfStrings(body.quickFacts);
  const inclusions = sanitizeArrayOfStrings(body.inclusions);
  const tags = sanitizeArrayOfStrings(body.tags);
  const suitableFor = sanitizeArrayOfStrings(body.suitableFor);

  const isPopular = Boolean(body.isPopular);
  const isBestDeal = Boolean(body.isBestDeal);
  const originalPrice = body.originalPrice ? sanitizeString(String(body.originalPrice)) : undefined;
  const childPrice = body.childPrice ? sanitizeString(String(body.childPrice)) : undefined;
  const childAgeLimit = body.childAgeLimit ? sanitizeString(String(body.childAgeLimit)) : undefined;



  const optionsSectionTitle = body.optionsSectionTitle ? sanitizeString(String(body.optionsSectionTitle)) : 'Available Options';
  const options = Array.isArray(body.options)
    ? body.options.map((opt: any) => ({
        id: sanitizeString(String(opt.id || Date.now() + Math.random().toString(36).substring(2, 7))),
        title: sanitizeString(String(opt.title || '')),
        badge: opt.badge ? sanitizeString(String(opt.badge)) : '',
        inclusions: sanitizeArrayOfStrings(opt.inclusions),
        moreDetails: opt.moreDetails ? sanitizeString(String(opt.moreDetails)) : '',
        price: opt.price ? sanitizeString(String(opt.price)) : '',
        childPrice: opt.childPrice ? sanitizeString(String(opt.childPrice)) : '',
        isAvailable: opt.isAvailable !== false,
      })).filter((opt: any) => opt.title.length > 0)
    : [];

  const hasOptions = Boolean(body.hasOptions || options.length > 0);

  const video = body.video ? sanitizeString(String(body.video)) : undefined;

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      title,
      destination,
      price,
      rating: ratingNum.toFixed(1),
      reviewsCount: safeReviewsCount,
      image,
      images,
      description,
      highlights,
      quickFacts,
      inclusions,
      tags,
      suitableFor,
      isPopular,
      isBestDeal,
      originalPrice,
      childPrice,
      childAgeLimit,
      hasOptions,
      optionsSectionTitle,
      options,
      video,
    }
  };
}

export function validateDestinationPayload(body: any): ValidationResult<any> {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object'] };
  }

  const title = sanitizeString(body.title);
  if (!title || title.length < 2) {
    errors.push('Destination title is required and must be at least 2 characters');
  }

  const image = sanitizeUrl(body.image);
  if (!image) {
    errors.push('Destination image is required and must be a valid URL');
  }

  const toursCount = parseInt(body.toursCount, 10);
  const safeToursCount = isNaN(toursCount) || toursCount < 0 ? 0 : toursCount;

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      title,
      image,
      toursCount: safeToursCount
    }
  };
}

export function validateOrderPayload(body: any): ValidationResult<any> {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object'] };
  }

  const firstName = sanitizeString(body.firstName);
  if (!firstName || firstName.length < 2) {
    errors.push('First name is required (min 2 characters)');
  }

  const lastName = sanitizeString(body.lastName);
  if (!lastName) {
    errors.push('Last name is required');
  }

  const email = sanitizeString(body.email).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required');
  }

  const phone = sanitizeString(body.phone);
  if (!phone || phone.length < 6 || phone.length > 20) {
    errors.push('A valid phone number is required (6-20 characters)');
  }

  const packageTitle = sanitizeString(body.packageTitle);
  if (!packageTitle) {
    errors.push('Package title is required');
  }

  const visitDate = sanitizeString(body.visitDate);
  if (!visitDate) {
    errors.push('Visit date is required');
  }

  const adultsCount = parseInt(body.adultsCount, 10);
  if (isNaN(adultsCount) || adultsCount < 1) {
    errors.push('At least 1 adult is required');
  }

  const childrenCount = parseInt(body.childrenCount, 10) || 0;
  if (childrenCount < 0) {
    errors.push('Children count cannot be negative');
  }

  const totalPrice = parseFloat(body.totalPrice);
  if (isNaN(totalPrice) || totalPrice <= 0) {
    errors.push('Total price must be greater than zero');
  }

  const specialRequests = sanitizeString(body.specialRequests || '');

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      firstName,
      lastName,
      email,
      phone,
      packageTitle,
      visitDate,
      adultsCount,
      childrenCount,
      totalPrice,
      specialRequests
    }
  };
}

export interface ContactPayload {
  fullname: string;
  phone: string;
  email: string;
  enquiryType: string;
  message: string;
}

export function validateContactPayload(body: any): ValidationResult<ContactPayload> {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object'] };
  }

  const fullname = sanitizeString(body.fullname || body.fullName || '');
  if (!fullname || fullname.length < 2) {
    errors.push('Full name is required (at least 2 characters)');
  }

  const email = sanitizeString(body.email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('A valid email address is required');
  }

  const phone = sanitizeString(body.phone || body.phoneNumber || '');
  if (!phone || phone.length < 6 || phone.length > 25) {
    errors.push('A valid phone number is required (6-25 characters)');
  }

  const enquiryType = sanitizeString(body.enquiryType || 'Booking');

  const message = sanitizeString(body.message);
  if (!message || message.length < 5) {
    errors.push('Message is required (at least 5 characters)');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      fullname,
      phone,
      email,
      enquiryType,
      message,
    },
  };
}


export function validateWhatsAppPayload(body: any): ValidationResult<{ countryCode: string; phone: string; fullNumber: string }> {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object'] };
  }

  const rawCountryCode = sanitizeString(body.countryCode || '+971');
  const rawPhone = sanitizeString(body.phone || '');

  const cleanCountryDigits = rawCountryCode.replace(/[^0-9]/g, '');
  const cleanPhoneDigits = rawPhone.replace(/[^0-9]/g, '');

  if (!cleanCountryDigits) {
    errors.push('Country dialing code is required (e.g. +971, +966, +91, +1)');
  }

  if (!cleanPhoneDigits || cleanPhoneDigits.length < 5 || cleanPhoneDigits.length > 15) {
    errors.push('Phone number must contain between 5 and 15 digits');
  }

  const combinedDigits = cleanCountryDigits + cleanPhoneDigits;
  if (combinedDigits.length < 7 || combinedDigits.length > 16) {
    errors.push('Combined international phone number must be between 7 and 16 digits');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      countryCode: `+${cleanCountryDigits}`,
      phone: cleanPhoneDigits,
      fullNumber: `+${combinedDigits}`,
    },
  };
}

export function validateCloudinaryPayload(body: any): ValidationResult<{ cloudName: string; apiKey: string; apiSecret: string }> {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object'] };
  }

  const cloudName = sanitizeString(body.cloudName || '').toLowerCase();
  const apiKey = sanitizeString(body.apiKey || '');
  const apiSecret = sanitizeString(body.apiSecret || '');

  if (!cloudName) {
    errors.push('Cloudinary Cloud Name is required');
  }

  if (!apiKey) {
    errors.push('Cloudinary API Key is required');
  }

  if (!apiSecret) {
    errors.push('Cloudinary API Secret is required');
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: [],
    data: {
      cloudName,
      apiKey,
      apiSecret,
    },
  };
}
