export interface PhotoModalData {
  photos: {
    createdAt: string;
    url: string;
    description?: string;
  }[];
  countryName: string;
}
