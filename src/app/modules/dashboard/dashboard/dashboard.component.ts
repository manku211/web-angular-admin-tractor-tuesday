import { Component } from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { LocationGraphComponent } from '../../../pages/dashboard/location-graph/location-graph.component';
import { SalesReportComponent } from '../../../pages/dashboard/sales-report/sales-report.component';
import { AuctionReportComponent } from '../../../pages/dashboard/auction-report/auction-report.component';
import { ActiveListComponent } from '../../../pages/dashboard/active-list/active-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    LocationGraphComponent,
    SalesReportComponent,
    AuctionReportComponent,
    ActiveListComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
