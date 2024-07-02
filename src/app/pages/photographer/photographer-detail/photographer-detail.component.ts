import { Component } from '@angular/core';
import { PhotographService } from '../../../core/services/photograph/photograph.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';
import { PhotographerServiceComponent } from '../photographer-service/photographer-service.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { BlockUserParams } from '../../../core/services/user/user-listing.service';
import { MessageService } from '../../../core/services/message/message.service';

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
  imports: [
    SharedModule,
    CommonModule,
    TableViewComponent,
    PhotographerServiceComponent,
    ModalComponent,
    FormsModule,
  ],
  templateUrl: './photographer-detail.component.html',
  styleUrl: './photographer-detail.component.css',
})
export class PhotographerDetailComponent {
  photographerData: any;
  loading: boolean = false;
  photographerServices!: any[];
  totalCount: number = 0;
  loader: boolean = false;
  statuses = ['MATCHED', 'COMPLETED', 'WAITING'];
  query: any = { skip: 1, take: 10 };
  selectedReason!: string;
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
  userBlockText!: string;
  showBlockReasonModal: boolean = false;
  reasons = [
    'Violation of terms of service',
    'Inappropriate behavior',
    'Fraudulent activity',
    'Security concerns',
    'Legal compliance',
    'Disruption of services',
  ];
  otherReason!: string;

  constructor(
    private photographService: PhotographService,
    private router: Router,
    private messageService: MessageService
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
        this.userBlockText = data?.data?.isBlocked ? 'UnBlock' : 'Block';
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

  openBlockModal() {
    this.showBlockReasonModal = true;
  }

  handleCancel() {
    this.showBlockReasonModal = false;
  }

  handleUserAccount() {
    let action = this.userBlockText === 'Block' ? 'deactivate' : 'activate';
    let payload: any = {
      isBlocked: this.userBlockText === 'Block' ? true : false,
      reason: this.selectedReason ? this.selectedReason : this.otherReason,
    };
    this.photographService
      .updatePhotographerByAdmin(this.photographerData?._id, payload)
      .subscribe({
        next: (data) => {
          if (data) {
            const successMessage = `Photographer ${
              action === 'deactivate' ? 'deactivated' : 'activated'
            } successfully.`;
            this.messageService?.success(successMessage);
            this.showBlockReasonModal = false;
            this.otherReason = '';
            this.selectedReason = '';
            this.fetchPhotographerById(this.photographerData?._id);
          }
        },
        error: (err) => {
          this.showBlockReasonModal = false;
          this.otherReason = '';
          this.selectedReason = '';
        },
      });
  }

  shouldDisableButton(): boolean {
    if (
      this.userBlockText === 'Block' &&
      !this.selectedReason &&
      !this.otherReason
    ) {
      return true;
    }
    return false;
  }
}
