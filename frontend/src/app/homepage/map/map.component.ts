import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { LocationService } from '../../services/location.service';

@Component({
  standalone: true,
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class Map implements OnInit, AfterViewInit {
  private map!: L.Map;
  icon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [13, 0],
      iconUrl: 'images/leaflet/marker-icon.png',
      shadowUrl: 'images/leaflet/marker-shadow.png',
    }),
  };

  marker: L.Marker = L.marker([-13.004079, -38.461034], this.icon);
  geoJsonData = 'data/countries.geo.json';

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.locationService.location$.subscribe((location) => {
      if (location) {
        this.marker.setLatLng([location.latitude, location.longitude]);
      }
    });
  }

  ngAfterViewInit() {
    this.initializeMap();
    this.addMarkers();
    this.centerMap();
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
    // Add your markers to the map
    this.marker.addTo(this.map);
  }

  private centerMap() {
    // Obtenez la position du marqueur
    const latLng = this.marker.getLatLng(); // Assurez-vous que marker est défini

    // Transformez-la en LatLngBounds
    const bounds = L.latLngBounds([latLng]);

    // Ajustez la carte
    this.map.fitBounds(bounds);
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
