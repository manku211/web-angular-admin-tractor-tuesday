import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AuctionManagementComponent } from '../../../pages/auction-management/auction-management.component';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  imports: [SharedModule, AuctionManagementComponent],
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.css',
})
export class ControlPanelComponent {}
