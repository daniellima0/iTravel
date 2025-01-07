import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { PhotoService } from '../../services/photo.service';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { PhotoModalComponent } from '../photo-modal/photo-modal.component';
import { Photo } from '../../models/photo.model';

@Component({
  standalone: true,
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  private geoJsonLayer!: L.GeoJSON;

  private icon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 0],
      iconUrl: 'images/leaflet/marker-icon.png',
      shadowUrl: 'images/leaflet/marker-shadow.png',
    }),
  };

  private geoJsonData = 'data/countries.geo.json';
  private markers: L.Marker[] = [];

  private countriesIndex: { [key: string]: any } = {}; // Armazena a geometria de cada país por nome

  constructor(private photoService: PhotoService, private dialog: MatDialog) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initializeMap();

    // Fetch initial photos and load them into the service
    this.photoService.getUserPhotos().subscribe((photos) => {
      this.photoService.photosSource.next(photos);
    });

    this.addMarkers();
    this.addGeoJsonLayer();
  }

  private initializeMap() {
    const baseMapURl =
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    this.map = L.map('map');

    L.tileLayer(baseMapURl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(this.map);
  }

  private addMarkers() {
    // Subscribe to the photos$ observable to get photo updates
    this.photoService.photos$.subscribe((photos: Photo[]) => {
      // Remove existing markers from the map
      this.clearMarkers();

      // Add markers for photos with location data
      photos.forEach((photo) => {
        if (photo.location) {
          const marker = L.marker(
            [photo.location.latitude, photo.location.longitude],
            this.icon
          ).addTo(this.map);

          // Optional: Add a popup with additional photo details
          marker.bindPopup(`
            <strong>Timestamp:</strong> ${photo.createdAt}<br>
          `);

          this.markers.push(marker);
        }
      });

      // Center and fit the map to show all markers
      this.centerMap();

      // Update the country colors based on marker locations
      if (this.geoJsonLayer) {
        this.geoJsonLayer.setStyle(this.getGeoJsonStyle());
      }
    });
  }

  private centerMap() {
    // Centralize map view to show all markers
    this.map.setView([20, -5], 3);

    // Delay to wait for the map to render
    setTimeout(() => {
      this.map.invalidateSize();
    }, 250);

    return;
  }

  private clearMarkers() {
    // Remove all markers from the map
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
  }

  private addGeoJsonLayer() {
    // Fetch the GeoJSON data and add it to the map
    fetch(this.geoJsonData)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch GeoJSON data');
        }
        return response.json();
      })
      .then((geoJson) => {
        this.geoJsonLayer = L.geoJSON(geoJson, {
          style: this.getGeoJsonStyle(),
          onEachFeature: this.onEachFeature.bind(this),
        }).addTo(this.map);

        // Criar o índice de países
        geoJson.features.forEach((feature: any) => {
          this.countriesIndex[feature.properties.name] = feature.geometry;
        });
      })
      .catch((error) => {
        console.error('Error loading GeoJSON data:', error);
      });
  }

  private getGeoJsonStyle() {
    return (feature: any) => {
      const hasMarker = this.isCountryHighlighted(feature);
      return {
        color: '#000000', // Border color
        weight: 0.1,
        fillColor: hasMarker ? '#FF0000' : '#FFFFFF', // Highlight with red if it has a marker
        fillOpacity: hasMarker ? 0.5 : 0.2,
      };
    };
  }

  private isCountryHighlighted(feature: any): boolean {
    return this.markers.some((marker) => {
      const latLng = marker.getLatLng();
      const point = [latLng.lng, latLng.lat]; // [longitude, latitude] format

      if (feature.geometry.type === 'Polygon') {
        return this.isPointInPolygon(point, feature.geometry.coordinates[0]);
      } else if (feature.geometry.type === 'MultiPolygon') {
        // Check if the point is inside any polygon
        return feature.geometry.coordinates.some((polygon: any) =>
          this.isPointInPolygon(point, polygon[0])
        );
      }

      return false; // Unsupported geometry types
    });
  }

  // using ray casting algorithm
  private isPointInPolygon(point: number[], polygon: number[][]): boolean {
    let inside = false;
    const [x, y] = point;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i]; // Current vertex
      const [xj, yj] = polygon[j]; // Previous vertex

      // Check if the point is inside the polygon edge
      const intersect =
        yi > y !== yj > y && // Is the point between the y-values of the edge
        x < ((xj - xi) * (y - yi)) / (yj - yi) + xi; // Is the point to the left of the edge

      if (intersect) inside = !inside;
    }

    return inside;
  }

  private onEachFeature(feature: any, layer: L.Layer) {
    layer.on({
      click: () => {
        const countryName = feature.properties.name;

        // Get the bounding box of the clicked country
        const bounds = L.geoJSON(feature).getBounds();
        // Fit the map view to the bounding box
        this.map.fitBounds(bounds);

        // Filtrar as fotos do país
        this.filterPhotosByCountry(countryName);
      },
    });
  }

  private filterPhotosByCountry(countryName: string) {
    // Get the most recent photos
    this.photoService
      .getUserPhotos()
      .pipe(take(1))
      .subscribe((photos: Photo[]) => {
        // Get the country's geometry
        const countryGeometry = this.countriesIndex[countryName];

        if (!countryGeometry) {
          console.error(`Geometry not found for country: ${countryName}`);
          return;
        }

        // Filter photos within the country
        const photosInCountry = photos.filter((photo) => {
          if (photo.location) {
            const point = [photo.location.longitude, photo.location.latitude]; // [longitude, latitude]

            if (countryGeometry.type === 'Polygon') {
              return this.isPointInPolygon(
                point,
                countryGeometry.coordinates[0]
              );
            } else if (countryGeometry.type === 'MultiPolygon') {
              // Check all polygons in the multi-polygon
              return countryGeometry.coordinates.some((polygon: any) =>
                this.isPointInPolygon(point, polygon[0])
              );
            }
          }
          return false;
        });

        // Open the modal with the filtered photos
        this.openModalWithPhotos(photosInCountry, countryName);
      });
  }

  private openModalWithPhotos(photos: Photo[], countryName: string) {
    // Set a delay of 1 second (1000ms) before opening the modal
    setTimeout(() => {
      this.dialog.open(PhotoModalComponent, {
        data: {
          photos: photos,
          countryName: countryName,
        },
      });
    }, 500);
  }
}
