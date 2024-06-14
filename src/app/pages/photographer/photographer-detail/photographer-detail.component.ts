import { Component } from '@angular/core';
import { PhotographService } from '../../../core/services/photograph/photograph.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';

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
  selector: 'app-photographer-detail',
  standalone: true,
  imports: [SharedModule, CommonModule, TableViewComponent],
  templateUrl: './photographer-detail.component.html',
  styleUrl: './photographer-detail.component.css',
})
export class PhotographerDetailComponent {
  photographerData: any;
  loading: boolean = false;
  photographerServices!: any[];
  totalCount: number = 0;
  loader: boolean = false;
  statuses = ['MATCHED', 'COMPLETED', 'WAITING', 'PAID', 'UNPAID'];
  query: any = { skip: 1, take: 10 };
  listOfColumns: ColumnInfo[] = [
    {
      key: 'location',
      label: 'Location',
      sort: false,
    },
    {
      key: 'createdAt',
      label: 'Date of Request',
      sort: false,
    },
    {
      key: 'photos',
      label: 'Photos',
      sort: false,
    },
    {
      key: 'name',
      label: 'Seller Name',
      sort: false,
    },
    {
      key: 'status',
      label: 'Request Status',
      sort: false,
      filter: true,
      listOfFilter: [
        { text: 'Ongoing', value: 'ONGOING' },
        { text: 'Ended', value: 'ENDED' },
      ],
    },
  ];

  constructor(
    private photographService: PhotographService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = String(localStorage.getItem('photographerId'));
    this.fetchPhotographerById(id);
    this.fetchPhotographerHistory(id);
  }

  fetchPhotographerById(id: string) {
    this.photographService.getPhotograherById(id).subscribe({
      next: (data) => {
        this.photographerData = data?.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  fetchPhotographerHistory(id: string) {
    this.loader = true;
    let payload = {
      filter: 'PHOTOGRAPHER_ID',
      filterValue: id,
    };
    this.photographService.getPhotoshootRequest(payload).subscribe({
      next: (data) => {
        this.photographerServices = data?.data?.photographerRequests;
        this.loader = false;
        this.totalCount = data?.data?.totalCount;
      },
      error: (err) => {
        this.loader = false;
        console.error(err);
      },
    });
  }

  onSortChange(column: any): void {
    let auctionsFilter: any;
    if (column?.key === 'tractor_name') {
      auctionsFilter =
        column?.sortOrder === 'ASC' ? 'TRACTOR_ASC' : 'TRACTOR_DESC';
    }
    this.query = {
      ...this.query,
      auctionsFilter: auctionsFilter,
    };
    this.fetchPhotographerHistory(this.query);
  }

  onFilterHandler(filteredColumn: any): void {
    const key = filteredColumn?.column?.key;
    if (filteredColumn.event != null) {
      this.query = { ...this.query, [key]: filteredColumn.event };
      this.fetchPhotographerHistory(this.query);
    } else {
      const updatedQuery = { ...this.query };
      delete updatedQuery[key];
      this.fetchPhotographerHistory(updatedQuery);
    }
  }

  onPageChange(page: any): void {
    this.query = { ...this.query, skip: page };
    this.fetchPhotographerHistory(this.query);
  }
}
