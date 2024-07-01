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
import {
  getExteriorImageUrl,
  getStatusStyles,
} from '../../../utilities/helpers/helper';
import { MessageService } from '../../../core/services/message/message.service';
import { Chart } from 'chart.js';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';
import { CountryHelperService } from '../../../utilities/helpers/country-helper.service';
import { RouterModule } from '@angular/router';
import { EquipmentCategory } from '../../../core/models/equipmentCategories';
import { HttpClient } from '@angular/common/http';
import { PhotographerServiceComponent } from '../../../pages/photographer/photographer-service/photographer-service.component';
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
  status: string;
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
    PhotographerServiceComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  @ViewChild('doughnutChartRef', { static: true })
  doughnutChartRef!: ElementRef<any>;
  cards: Card[] = [];
  query: any = { skip: 1, take: 5, auctionStatus: 'ONGOING, APPROVED' };
  exteriorImageUrl: string = '';
  auctionInfo: any;
  array = [1, 2, 3, 4];
  effect = 'scrollx';
  chart!: any;
  loading: boolean = false;
  carouselItems!: CarouselItem[];
  showNoData: boolean = false;
  getStatusStyles = getStatusStyles;

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
      label: 'Number of Bids',
      sort: false,
    },
  ];

  countries: { name: string; value: string; flag: string }[] = [
    { name: 'USA', value: 'usa', flag: 'usflag.png' },
    { name: 'CANADA', value: 'ca', flag: 'canadaflag.svg' },
  ];

  selectedCountry: { name: string; value: string; flag: string } =
    this.countries[0];

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
    this.loading = true;
    this.categoryService.getCategory(query).subscribe({
      next: (data: any) => {
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
          this.loading = false;
          this.carouselItems = this.auctionInfo.map((item: any) => ({
            year: item.tractorId.year,
            title: item.tractorId.name,
            startingBid: `$${item.currentBid.amount.toLocaleString()}`,
            startDate: this.formatDate(item.startTime),
            status: item.auctionStatus,
          }));
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }

  fetchTopSellingCategory() {
    this.analyticsService.getCategoryAnalytics().subscribe({
      next: (data: any) => {
        if (data && data.data) {
          const counts = Object.values(data.data).slice(0, -1); // Extract counts
          const labels = Object.keys(data.data).slice(
            0,
            -1
          ) as EquipmentCategory[];

          const filteredData = counts
            .map((count, index) => ({ count, label: labels[index] }))
            .filter((item: any) => item.count > 0);

          const filteredCounts = filteredData.map((item) => item.count);
          const filteredLabels = filteredData.map((item) => item.label);
          const allZero = counts.every((count) => count === 0);

          if (allZero) {
            this.showNoData = true;
          } else {
            this.showNoData = false;
            this.createDoughnutChart(filteredCounts, filteredLabels);
          }
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

  onCountrySelect(country: {
    name: string;
    value: string;
    flag: string;
  }): void {
    this.selectedCountry = country;
    const query = { ...this.query, country: country.value };
    this.fetchCategoryList(query);
  }

  fetchStats() {
    this.analyticsService.getDashboardStats().subscribe({
      next: (data) => {
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

  createDoughnutChart(data: any[], labels: EquipmentCategory[]): void {
    const ctx = this.doughnutChartRef.nativeElement.getContext('2d');

    if (this.chart) {
      this.chart.destroy();
    }

    const colors: Record<EquipmentCategory, string> = {
      [EquipmentCategory.Tractors]: '#FF6384',
      [EquipmentCategory.Trucks]: '#36A2EB',
      [EquipmentCategory.Harvesters]: '#FFCE56',
      [EquipmentCategory.TillageEquipment]: '#4BC0C0',
      [EquipmentCategory.HayAndForage]: '#9966FF',
      [EquipmentCategory.SkidSteers]: '#FF9F40',
      [EquipmentCategory.Motorsports]: '#E7E9ED',
      [EquipmentCategory.ChemicalApplicators]: '#FF8800',
      [EquipmentCategory.Construction]: '#00FF00',
      [EquipmentCategory.PlantingEquipment]: '#0000FF',
      [EquipmentCategory.OTHER]: '#FFFF00',
    };

    const backgroundColors = labels.map((label) => colors[label]);

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Top Selling Category',
            data: data,
            backgroundColor: backgroundColors,
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
    this.query = {
      ...this.query,
      sortOrder: column.sortOrder,
      sortField: column.sortField ? column.sortField : column.altSortField,
    };

    this.fetchCategoryList(this.query);
  }

  onFilterHandler(filteredColumn: any): void {
    const key = filteredColumn?.column?.key;
    if (filteredColumn.event != null) {
      this.query = { ...this.query, [key]: filteredColumn.event };

      this.fetchCategoryList(this.query);
    } else {
      const updatedQuery = { ...this.query };
      delete updatedQuery[key];
      this.fetchCategoryList(updatedQuery);
    }
  }
}
