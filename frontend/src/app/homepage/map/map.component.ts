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
    });
  }

  private centerMap() {
    if (this.markers.length === 0) {
      this.showWordlyView(); // Default to world view if no markers
      return;
    }

    const bounds = L.latLngBounds(
      this.markers.map((marker) => marker.getLatLng())
    );
    this.map.fitBounds(bounds);
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
        L.geoJSON(geoJson, {
          style: {
            color: '#000000', // Border color
            weight: 0.1,
            fillColor: '#fff', // Initial fill color (white)
            fillOpacity: 0,
          },
        }).addTo(this.map);
      })
      .catch((error) => {
        console.error('Error loading GeoJSON data:', error);
      });
  }
}
