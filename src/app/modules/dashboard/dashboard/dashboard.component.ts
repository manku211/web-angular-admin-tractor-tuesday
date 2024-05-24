import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { LocationGraphComponent } from '../../../pages/dashboard/location-graph/location-graph.component';
import { SalesReportComponent } from '../../../pages/dashboard/sales-report/sales-report.component';
import { AuctionReportComponent } from '../../../pages/dashboard/auction-report/auction-report.component';
import { ActiveListComponent } from '../../../pages/dashboard/active-list/active-list.component';
import { AnalyticsService } from '../../../core/services/dashboard/analytics.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { getExteriorImageUrl } from '../../../utilities/helpers/helper';
import { MessageService } from '../../../core/services/message/message.service';
import { Chart } from 'chart.js';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';
import { CountryHelperService } from '../../../utilities/helpers/country-helper.service';
import { RouterModule } from '@angular/router';
import { EquipmentCategory } from '../../../core/models/equipmentCategories';
import { HttpClient } from '@angular/common/http';
interface Card {
  imgSrc: string;
  label: string;
  value: string;
}

interface CarouselItem {
  year: number;
  title: string;
  startingBid: string;
  startDate: string;
}

interface ColumnInfo {
  key: string;
  label: string;
  sort: boolean;
  sortOrder?: string;
  type?: string;
  sortField?: string;
  altSortField?: string;
  listOfFilter?: any[];
  filter?: boolean;
  isMultiple?: boolean;
}

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
    TableViewComponent,
    RouterModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  // encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent {
  @ViewChild('doughnutChartRef', { static: true })
  doughnutChartRef!: ElementRef<any>;
  cards: Card[] = [];
  query: any = { skip: 1, take: 5, auctionStatus: 'ONGOING,ENDED' };
  exteriorImageUrl: string = '';
  auctionInfo: any;
  array = [1, 2, 3, 4];
  effect = 'scrollx';
  chart!: any;

  carouselItems: CarouselItem[] = [];

  getCategoryFilters = () => {
    return Object.entries(EquipmentCategory).map(([key, value]) => ({
      text: value,
      value: value,
      // byDefault: true,
    }));
  };

  listOfColumns: ColumnInfo[] = [
    {
      key: 'tractorId.name',
      label: 'Tractor Name',
      sort: true,
      sortOrder: 'DESC',
      sortField: 'tractorId.name',
    },

    {
      key: 'equipmentCategories',
      label: 'Category',
      sort: false,
      filter: true,
      isMultiple: true,
      sortField: 'equipmentCategories',
      listOfFilter: this.getCategoryFilters(),
    },
    {
      key: 'bidder',
      label: 'Number of Bidder',
      sort: false,
    },
  ];

  constructor(
    private analyticsService: AnalyticsService,
    private categoryService: CategoryService,
    private messageService: MessageService,
    public countryHelper: CountryHelperService
  ) {}

  ngOnInit() {
    this.fetchStats();
    this.fetchCategoryList(this.query);
    this.fetchTopSellingCategory();
  }

  fetchCategoryList(query: any) {
    this.categoryService.getCategory(query).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data) {
          const auctionsWithImageUrl = data?.data?.categories.map(
            (auction: any) => {
              return {
                ...auction,
                exteriorImageUrl: getExteriorImageUrl(auction),
              };
            }
          );
          this.auctionInfo = auctionsWithImageUrl;
          this.carouselItems = this.auctionInfo.map((item: any) => ({
            year: item.tractorId.purchaseYear,
            title: item.tractorId.name,
            startingBid: `$${item.currentBid.amount.toLocaleString()}`,
            startDate: this.formatDate(item.startTime),
          }));
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }

  fetchTopSellingCategory() {
    this.analyticsService.getCategoryAnalytics().subscribe({
      next: (data: any) => {
        console.log(data);
        if (data && data.data) {
          console.log(data?.data);
          const counts = Object.values(data.data).slice(0, -1); // Extract counts
          const labels = Object.keys(data.data).slice(0, -1); // Extract labels
          console.log(counts, labels);
          this.createDoughnutChart(counts, labels);
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }

  formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  fetchStats() {
    this.analyticsService.getDashboardStats().subscribe({
      next: (data) => {
        console.log(data);
        this.cards = [
          {
            imgSrc: 'assets/icons/totalearns.svg',
            label: 'Total Revenue Generated',
            value: data?.data?.revenue || 0,
          },
          {
            imgSrc: 'assets/icons/live-auction.svg',
            label: 'Total Live Auctions',
            value: data?.data?.activeAuctions || 0,
          },
          {
            imgSrc: 'assets/icons/active-buyers.svg',
            label: 'Total Active Buyers',
            value: data?.data?.totalActiveBuyers || 0,
          },
          {
            imgSrc: 'assets/icons/cam.svg',
            label: 'Total Active Photographers',
            value: data?.data?.totalActivePhotographers || 0,
          },
        ];
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  createDoughnutChart(data: any[], labels: string[]): void {
    const ctx = this.doughnutChartRef.nativeElement.getContext('2d');
    console.log(data);
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Top Selling Category',
            data: data,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'right',
          },
        },
      },
    });
  }

  onSortChange(column: any): void {
    console.log(column);
    this.query = {
      ...this.query,
      sortOrder: column.sortOrder,
      sortField: column.sortField ? column.sortField : column.altSortField,
    };
    console.log(this.query);
    this.fetchCategoryList(this.query);
  }

  onFilterHandler(filteredColumn: any): void {
    console.log(filteredColumn);
    const key = filteredColumn?.column?.key;
    if (filteredColumn.event != null) {
      this.query = { ...this.query, [key]: filteredColumn.event };
      console.log(this.query);
      this.fetchCategoryList(this.query);
    } else {
      const updatedQuery = { ...this.query };
      delete updatedQuery[key];
      this.fetchCategoryList(updatedQuery);
    }
  }
}
