import { Photo } from './photo.model';

export interface User {
  username: string;
  email: string;
  password: string;
  photos: Photo[];
}
