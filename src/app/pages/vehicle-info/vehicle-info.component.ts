import { Component } from '@angular/core';
import { AuctionService } from '../../core/services/auction/auction.service';
import { SharedModule } from '../../shared/shared.module';
import { CommentsBidsComponent } from '../comments-bids/comments-bids.component';

@Component({
  selector: 'app-vehicle-info',
  standalone: true,
  imports: [SharedModule, CommentsBidsComponent],
  templateUrl: './vehicle-info.component.html',
  styleUrl: './vehicle-info.component.css',
})
export class VehicleInfoComponent {
  auctionId!: any;
  vehicleInfo: any;
  timeLeft: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  array = [1, 2, 3, 4];
  additionalInfo: any[] = [
    { label: 'Name', key: 'tractorId', subkey: 'name' },
    { label: 'Vin', key: 'tractorId', subkey: 'vin' },
    { label: 'Vehicle Number', key: 'tractorId', subkey: 'number' },
    { label: 'Model Number', key: 'tractorId', subkey: 'brand' },
    { label: 'Vehicle Year', key: 'tractorId', subkey: 'year' },
    { label: 'Brand Category', key: 'tractorId', subkey: 'category' },
    { label: 'Engine Power', key: 'tractorId', subkey: 'power' },
    { label: 'Seller Name', key: 'tractorId', subkey: 'name' },
    { label: 'Seller Type', key: 'tractorId', subkey: 'name' },
    { label: 'Vehicle Color', key: 'tractorId', subkey: 'name' },
    { label: 'Transmission', key: 'tractorId', subkey: 'transmissionType' },
    { label: 'Tyre Conditions', key: 'tractorId', subkey: 'condition' },
    { label: 'Used/Unused', key: 'tractorId', subkey: 'isUsed' },
    { label: 'Reserve', key: 'reservedPrice', subkey: '' },
    { label: 'Location', key: 'tractorId', subkey: 'location' },
    { label: 'Total Number of Hours', key: 'tractorId', subkey: 'totalHrs' },
  ];
  constructor(private auctionService: AuctionService) {}

  ngOnInit(): void {
    this.auctionId = localStorage.getItem('selectedAuctionId');
    console.log('Auction ID:', this.auctionId);
    this.fetchVehicleDetails(this.auctionId);
  }

  fetchVehicleDetails(auctionId: string) {
    this.auctionService.getVehicleDetailsByAuctionId(auctionId).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data) {
          this.vehicleInfo = data?.data;
          this.additionalInfo = this.generateAdditionalInfo(this.vehicleInfo);
          this.calculateTimeLeft(this.vehicleInfo?.endTime);
          console.log(this.additionalInfo);
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
      },
    });
  }

  calculateTimeLeft(endTime: number): {
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const now = Math.floor(Date.now() / 1000);
    let timeLeft = Math.max(0, endTime - now);

    const hours = Math.floor(timeLeft / 3600);
    timeLeft %= 3600;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return { hours, minutes, seconds };
  }

  generateAdditionalInfo(vehicleInfo: any): { label: string; value: string }[] {
    return this.additionalInfo.map((info) => {
      let value = '';
      switch (info.label) {
        case 'Name':
        case 'Vin':
        case 'Vehicle Number':
        case 'Model Number':
        case 'Brand Category':
        case 'Engine Power':
        case 'Transmission':
        case 'Tyre Conditions':
        case 'Location':
          value = vehicleInfo[info.key]?.[info.subkey] || 'N/A';
          break;
        case 'Vehicle Year':
          value = vehicleInfo[info.key]?.[info.subkey]?.toString() || 'N/A';
          break;
        case 'Seller Name':
          value = vehicleInfo[info.key]?.[info.subkey] || 'N/A';
          break;
        case 'Seller Type':
          value = 'Seller';
          break;
        case 'Vehicle Color':
          value = 'Color';
          break;
        case 'Used/Unused':
          value = vehicleInfo[info.key]?.[info.subkey] ? 'Used' : 'Unused';
          break;
        case 'Reserve':
          value = vehicleInfo[info.key] > 0 ? 'Reserved' : 'No Reserve';
          break;
        case 'Total Number of Hours':
          value = vehicleInfo[info.key]?.[info.subkey]?.toString() || 'N/A';
          break;
        default:
          value = 'N/A';
      }
      return { label: info.label, value };
    });
  }
}
