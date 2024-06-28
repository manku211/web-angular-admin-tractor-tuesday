import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { PhotographService } from '../../../core/services/photograph/photograph.service';
import { NavigationEnd, Router } from '@angular/router';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';
import { filter } from 'rxjs';
import { PhotographerDetailComponent } from '../../../pages/photographer/photographer-detail/photographer-detail.component';

interface PhotographerInfo {
  _id: string;
  username: string;
  phoneNumber: number;
  country: string;
  blockStatus: boolean;
  isDeleted: boolean;
}

interface ColumnInfo {
  key: string;
  label: string;
  sort: boolean;
  sortOrder?: string;
  type?: string;
  listOfFilter?: any[];
  filter?: boolean;
}

@Component({
  selector: 'app-photographers-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TableViewComponent,
    PhotographerDetailComponent,
  ],
  templateUrl: './photographers-list.component.html',
  styleUrl: './photographers-list.component.css',
})
export class PhotographersListComponent {
  listOfData: PhotographerInfo[] = [];
  query: any = {
    skip: 1,
    take: 10,
    sortBy: 'createdAt',
    sorting: 'DESC',
  };
  loader: boolean = false;
  totalRecords: number = 0;
  countryFlag!: string;
  countryName!: string;
  exteriorImageUrl: string = '';
  auctionDetails: any;
  showAuctionDetailsModal: boolean = false;
  auctionDate?: Date;
  auctionTime?: Date;
  auctionDetailsLoader: boolean = false;
  openDenialModal: boolean = false;
  openApproveModal: boolean = false;
  tractorData: any;
  routePath!: string;
  openRejectModal: boolean = false;
  listOfColumns: ColumnInfo[] = [
    {
      key: 'fullname',
      label: 'Photographer Name',
      sort: true,
      sortOrder: 'DESC',
    },
    {
      key: 'email',
      label: 'Email Id',
      sort: false,
    },
    {
      key: 'phone',
      label: 'Phone Number',
      sort: false,
    },

    // {
    //   key: 'country',
    //   label: 'Country',
    //   sort: false,
    // },
    {
      key: 'status',
      label: 'Status',
      sort: false,
      filter: true,
      listOfFilter: [
        { text: 'Blocked', value: 'blocked' },
        { text: 'N/A', value: 'unblocked' },
      ],
    },
    {
      key: 'joiningDate',
      label: 'Joining Date',
      sort: false,
    },
  ];

  constructor(
    private photographerService: PhotographService,
    private router: Router
  ) {
    this.routePath = this.router.url;
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.routePath = this.router.url;
      });
    this.fetchDetails(this.query);
  }

  fetchDetails(params: any) {
    this.loader = true;
    this.photographerService.getAllPhotographers(params).subscribe((res) => {
      this.loader = false;
      this.listOfData = res?.data?.photographers;
      this.totalRecords = res.data?.count;
    });
  }

  populateDateTime(): void {
    if (this.auctionDetails) {
      this.auctionDate = new Date(this.auctionDetails.proposedStartTime * 1000);
      this.auctionTime = new Date(this.auctionDetails.proposedStartTime * 1000);
    }
  }

  onSortChange(column: any): void {
    if (column?.sortOrder === null) {
      this.query = {
        ...this.query,
        sorting: 'desc',
        sortBy: 'createdAt',
      };
    } else {
      this.query = {
        ...this.query,
        sorting: column.sortOrder === 'ASC' ? 'asc' : 'desc',
        sortBy: column.key,
      };
    }
    this.fetchDetails(this.query);
  }

  onFilterHandler(filteredColumn: any): void {
    if (filteredColumn.event != null) {
      this.query = { ...this.query, filtering: filteredColumn.event };
      this.fetchDetails(this.query);
    } else {
      const updatedQuery = { ...this.query };
      delete updatedQuery['filtering'];
      this.fetchDetails(updatedQuery);
    }
  }

  onPageChange(page: number): void {
    this.query = { ...this.query, skip: page };
    this.fetchDetails(this.query);
  }

  onSearchInput(search: any): void {
    if (search !== '') {
      this.query = { ...this.query, search: search };
    } else {
      delete this.query.search;
    }
    this.fetchDetails(this.query);
  }

  handleViewMore(id: any) {
    localStorage.setItem('photographerId', id);
    this.router.navigate(['/dashboard/photographers/photographer-detail']);
  }
}
