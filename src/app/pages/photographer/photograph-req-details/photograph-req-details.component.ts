import { Component } from '@angular/core';
import { PhotographService } from '../../../core/services/photograph/photograph.service';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
@Component({
  selector: 'app-photograph-req-details',
  standalone: true,
  imports: [SharedModule, CommonModule, FormsModule, LeafletModule],
  templateUrl: './photograph-req-details.component.html',
  styleUrl: './photograph-req-details.component.css',
})
export class PhotographReqDetailsComponent {
  photographRequestData: any;
  loading: boolean = false;
  photographerPrice!: number;
  coordinates: { lat: number; lng: number }[] = [
    { lat: 41.2565, lng: -95.9345 }, // Omaha, NE
    { lat: 40.8136, lng: -96.7026 }, // Lincoln, NE
    { lat: 41.5236, lng: -99.6319 }, // Grand Island, NE
  ];

  mapOptions: L.MapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 6,
    center: L.latLng(41.2565, -95.9345), // Default center
  };

  // Define markers array
  markers: L.Marker[] = [];

  onMapClick(event: L.LeafletMouseEvent) {
    // Prevent adding new markers
    event.originalEvent.stopPropagation();
  }

  // Function to initialize markers

  constructor(private photographService: PhotographService) {}

  ngOnInit() {
    const id = String(localStorage.getItem('selectedUserId'));
    this.fetchPhotograhRequestsById(id);
  }

  initMarkers(map: L.Map) {
    this.coordinates.forEach((coord) => {
      const customIcon = L.icon({
        iconUrl: 'assets/icons/marker.svg',
        iconSize: [30, 30], // Adjust the size of the icon as needed
      });
      const m = L.marker([coord.lat, coord.lng], { icon: customIcon });
      this.markers.push(m);
      m.addTo(map);
    });
  }

  fetchPhotograhRequestsById(id: string) {
    this.loading = true;
    this.photographService.getPhotoshootRequestById(id, {}).subscribe({
      next: (data) => {
        console.log(data);
        this.photographRequestData = data?.data?.photoshootRequest  ;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  handleSubmit() {}
}
