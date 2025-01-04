export const formatPhoneNumber = (input: string): string => {
  // Удаляем все нецифровые символы
  const numbers = input.replace(/\D/g, '');

  // Форматируем номер как XXX-XXX-XXXX
  const match = numbers.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

  if (!match) return '';

  const parts = [match[1], match[2], match[3]].filter((part) => part !== '');

  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]}-${parts[1]}`;
  return `${parts[0]}-${parts[1]}-${parts[2]}`;
};

export const isValidUSPhoneNumber = (phone: string): boolean => {
  // Проверяем, что номер соответствует формату XXX-XXX-XXXX
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};
