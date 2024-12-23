import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { PhotoService, PhotoMetadata } from '../../services/photo.service';

@Component({
  standalone: true,
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class Map implements OnInit, AfterViewInit {
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
  private markers: L.Marker[] = []; // To store all markers

  constructor(private photoService: PhotoService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initializeMap();
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

    this.showWordlyView();
  }

  private showWordlyView() {
    this.map.setView([0, 0], 0);
    this.map.fitWorld();
    this.map.zoomIn(2);
  }

  private addMarkers() {
    // Subscribe to the photos$ observable to get photo updates
    this.photoService.photos$.subscribe((photos: PhotoMetadata[]) => {
      // Remove existing markers from the map
      this.clearMarkers();

      // Add markers for photos with location data
      photos.forEach((photo) => {
        console.log('photo:', photo);
        if (photo.location) {
          const marker = L.marker(
            [photo.location.latitude, photo.location.longitude],
            this.icon
          ).addTo(this.map);

          // Optional: Add a popup with additional photo details
          marker.bindPopup(`
            <strong>Photo ID:</strong> ${photo.id}<br>
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
    // if (this.markers.length === 0) {
    this.showWordlyView(); // Default to world view if no markers
    return;
    // }

    // const bounds = L.latLngBounds(
    //   this.markers.map((marker) => marker.getLatLng())
    // );
    // this.map.fitBounds(bounds);
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
    // Optional: Add interaction for country polygons if needed
    layer.on({
      click: () => {
        console.log(`Clicked on country: ${feature.properties.name}`);
      },
    });
  }
}
