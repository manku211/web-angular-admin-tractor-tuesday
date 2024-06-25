import { Component } from '@angular/core';
import { PhotographService } from '../../../core/services/photograph/photograph.service';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { Router } from '@angular/router';
import { MessageService } from '../../../core/services/message/message.service';
@Component({
  selector: 'app-photograph-req-details',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    LeafletModule,
    ModalComponent,
  ],
  templateUrl: './photograph-req-details.component.html',
  styleUrl: './photograph-req-details.component.css',
})
export class PhotographReqDetailsComponent {
  photographRequestData: any;
  loading: boolean = false;
  photographerPrice!: number;
  photographerData: any[] = [];
  coordinates!: { lat: number; lng: number }[];
  contactDialog: boolean = false;
  photographerInfo: any;
  photoshootRequestId: any;
  validationError: string | null = null;
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

  constructor(
    private photographService: PhotographService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.photoshootRequestId = String(localStorage.getItem('selectedUserId'));
    this.fetchPhotograhRequestsById(this.photoshootRequestId);
  }

  initMarkers(map: L.Map) {
    if (this.coordinates) {
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
  }

  fetchPhotograhRequestsById(id: string) {
    this.loading = true;
    this.photographService
      .getPhotoshootRequestById(id, { maxDistance: 50000 })
      .subscribe({
        next: (data) => {
          this.photographRequestData = data?.data?.photoshootRequest;
          this.photographerData = data?.data?.photographers;
          this.coordinates = data?.data?.photographers.map(
            (photographer: any) => {
              const [lat, lng] =
                photographer?.coordinatesPhotographer?.coordinates;
              return { lat, lng };
            }
          );
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
  }

  openContact(data: any) {
    this.photographerInfo = data;
    this.contactDialog = true;
  }

  handleCancel() {
    this.contactDialog = false;
  }

  validatePrice() {
    if (this.photographerPrice === null || this.photographerPrice <= 0) {
      this.validationError = 'Price must be a positive number.';
      return false;
    }
    this.validationError = null;
    return true;
  }

  handleSubmit() {
    if (!this.validatePrice()) {
      return;
    }
    let payload = {
      fees: this.photographerPrice,
    };
    this.photographService
      .updatePhotoshootRequest(this.photoshootRequestId, payload)
      .subscribe({
        next: (data) => {
          this.contactDialog = false;
          this.messageService.success('Photographer Price Added successfully!');
          this.fetchPhotograhRequestsById(this.photoshootRequestId);
        },
        error: (err) => {
          console.error(err);
          this.contactDialog = false;
        },
      });
  }

  handleAssign() {
    let payload = {
      status: 'MATCHED',
      photographerId: this.photographerInfo?._id,
    };
    this.photographService
      .updatePhotoshootRequest(this.photoshootRequestId, payload)
      .subscribe({
        next: (data) => {
          this.contactDialog = false;
          this.messageService.success('Photographer Assigned successfully!');
          this.fetchPhotograhRequestsById(this.photoshootRequestId);
        },
        error: (err) => {
          console.error(err);
          this.contactDialog = false;
        },
      });
  }

  handleViewMore(id: any) {
    localStorage.setItem('photographerId', id);
    this.router.navigate([
      '/dashboard/photographers/photoshoot-requests/details/photographer',
    ]);
  }
}
