import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-platform-management',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './platform-management.component.html',
  styleUrl: './platform-management.component.css',
})
export class PlatformManagementComponent {
  seller_listing_fee: number = 0;
  maxCap: number = 0;
  minCap: number = 0;

  handlePlatformFees() {}
}
