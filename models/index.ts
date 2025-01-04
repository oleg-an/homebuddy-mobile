export type RootStackParamList = {
  Home: { zipCode?: string } | undefined;
  Details: {
    id: string;
    title: string;
    description: string;
    zipCode: string;
  };
  ZipCode: { currentZipCode?: string } | undefined;
  Auth: undefined;
};
