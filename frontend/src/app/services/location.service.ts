import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private locationSource = new BehaviorSubject<{
    longitude: number;
    latitude: number;
  } | null>(null);
  location$ = this.locationSource.asObservable();

  updateLocation(location: { longitude: number; latitude: number }) {
    this.locationSource.next(location);
  }
}
