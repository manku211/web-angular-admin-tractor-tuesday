import { Component } from '@angular/core';
import { AuctionService } from '../../core/services/auction/auction.service';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-vehicle-info',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './vehicle-info.component.html',
  styleUrl: './vehicle-info.component.css',
})
export class VehicleInfoComponent {
  auctionId!: any;
  vehicleInfo: any;
  array = [1, 2, 3, 4];
  additionalInfo: { label: string; value: string }[] = [
    { label: 'Name', value: 'audi' },
    { label: 'Vin', value: '1234' },
    { label: 'Model No', value: '22' },
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
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
      },
    });
  }
}
