import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';

@Component({
  selector: 'app-auction-request',
  standalone: true,
  imports: [SharedModule, TableViewComponent],
  templateUrl: './auction-request.component.html',
  styleUrl: './auction-request.component.css',
})
export class AuctionRequestComponent {}
