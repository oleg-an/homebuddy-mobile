export type RootStackParamList = {
  Home: { zipCode?: string } | undefined;
  ZipCode: { currentZipCode?: string } | undefined;
  Auth: undefined;
  Details: {
    id: string;
    title: string;
    description: string;
    zipCode: string;
  };
  ShowerDetails: { zipCode: string };
  TubDetails: { zipCode: string };
  StairliftDetails: { zipCode: string };
  KitchenDetails: { zipCode: string };
  WindowsDetails: { zipCode: string };
  GuttersDetails: { zipCode: string };
  HowItWorks: undefined;
}; 