type Service = {
  id: string;
  title: string;
  description: string;
};

export const REPAIR_OFFERS: Service[] = [
  {
    id: 'shower',
    title: 'Walk-in Showers',
    description: 'Modern shower cabins with easy access',
  },
  {
    id: 'tub',
    title: 'Walk-in Tubs',
    description: 'Bathtubs with door for convenient access',
  },
  {
    id: 'stairlift',
    title: 'Stairlifts',
    description: 'Safe and reliable stair lift solutions',
  },
  {
    id: 'kitchen',
    title: 'Kitchen Cabinets',
    description: 'Custom kitchen cabinet installation',
  },
  {
    id: 'windows',
    title: 'Window Replacement',
    description: 'Energy-efficient window solutions',
  },
  {
    id: 'gutters',
    title: 'Gutter Guards',
    description: 'Premium gutter protection systems',
  },
];
