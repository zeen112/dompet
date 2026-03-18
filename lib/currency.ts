export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: string | number): string => {
  const numValue = typeof value === 'string' ? value.replace(/\D/g, '') : value.toString();
  if (!numValue) return '';
  return new Intl.NumberFormat('id-ID').format(parseInt(numValue));
};

export const parseFormattedNumber = (value: string): number => {
  return parseInt(value.replace(/\D/g, '')) || 0;
};
