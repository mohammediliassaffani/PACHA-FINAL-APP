import i18next from 'i18next';

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  const currentLanguage = i18next.language;

  return new Intl.DateTimeFormat(currentLanguage === 'fr' ? 'fr-FR' : 'en-US', {
    month: opts.month ?? 'long',
    day: opts.day ?? 'numeric',
    year: opts.year ?? 'numeric',
    ...opts,
  }).format(new Date(date));
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-MA', {
    style: 'currency',
    currency: 'MAD',
  }).format(price);
};
