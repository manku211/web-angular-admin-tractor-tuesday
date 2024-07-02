import { Component, Input } from '@angular/core';
import { PhotographService } from '../../../core/services/photograph/photograph.service';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  selector: 'app-photographer-service',
  standalone: true,
  imports: [TableViewComponent, SharedModule, CommonModule, RouterModule],
  templateUrl: './photographer-service.component.html',
  styleUrl: './photographer-service.component.css',
})
export class PhotographerServiceComponent {
  @Input() isDashboard: boolean = false;
  photographerServices!: any[];
  totalCount: number = 0;
  loader: boolean = false;
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
      key: 'filtering',
      label: 'Request Status',
      sort: false,
      filter: true,
      listOfFilter: [
        { text: 'Waiting', value: 'WAITING' },
        { text: 'Matched', value: 'MATCHED' },
        { text: 'Completed', value: 'COMPLETED' },
      ],
    },
  ];
  photographerId!: string;

  constructor(private photographService: PhotographService) {}

  ngOnInit() {
    this.photographerId = String(localStorage.getItem('photographerId'));

    this.fetchPhotographerHistory(this.query);
  }

  fetchPhotographerHistory(query: any) {
    this.loader = true;
    let payload;
    if (this.isDashboard) {
      payload = { ...query };
    } else {
      payload = {
        filter: 'PHOTOGRAPHER_ID',
        filterValue: this.photographerId,
        ...query,
      };
    }

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
