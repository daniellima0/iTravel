import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

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
  markers: L.Marker[] = [
    L.marker([45.92295555555555, 6.131933333333333], this.icon),
    L.marker([43.762326, 11.261564], this.icon),
  ];
  geoJsonData = 'data/countries.geo.json';

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initializeMap();
    this.addMarkers();
    this.centerMap();
    this.addGeoJsonLayer();
  }

  private initializeMap() {
    // const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const baseMapURl =
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    this.map = L.map('map');
    // L.tileLayer(baseMapURl).addTo(this.map);

    L.tileLayer(baseMapURl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(this.map);
  }

  private addMarkers() {
    // Add your markers to the map
    this.markers.forEach((marker) => marker.addTo(this.map));
  }

  private centerMap() {
    // Create a LatLngBounds object to encompass all the marker locations
    const bounds = L.latLngBounds(
      this.markers.map((marker) => marker.getLatLng())
    );

    // Fit the map view to the bounds
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
