import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { UserListingService } from '../../../core/services/user/user-listing.service';
import { MessageService } from '../../../core/services/message/message.service';
import { AuctionRequestComponent } from '../auction-request/auction-request.component';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';
import { AuctionService } from '../../../core/services/auction/auction.service';
import { Router } from '@angular/router';
import { DenyModalComponent } from '../deny-modal/deny-modal.component';
import { ApproveModalComponent } from '../approve-modal/approve-modal.component';
import { DetailsCardComponent } from '../../../shared/components/details-card/details-card.component';
import { styleObject } from '../../../utilities/helpers/helper';

interface Seller {
  _id: string;
  username: string;
  phoneNumber: number;
}

interface ColumnInfo {
  key: string;
  label: string;
  sort: boolean;
  sortOrder?: string;
  type?: string;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    SharedModule,
    AuctionRequestComponent,
    TableViewComponent,
    DenyModalComponent,
    ApproveModalComponent,
    DetailsCardComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  userId: any;
  userInfo: any;
  query: any = { skip: 1, take: 10 };
  loader: boolean = false;
  auctionInfo: any[] = [];
  totalRecords: number = 0;
  styleObject: any = styleObject;
  openDenialModal: boolean = false;
  openApproveModal: boolean = false;
  tractorData: any;
  listOfColumns: ColumnInfo[] = [
    {
      key: 'tractorId',
      label: 'Tractor Name',
      sort: true,
      sortOrder: 'DESC',
    },
    {
      key: 'category',
      label: 'Category',
      sort: true,
    },
    {
      key: 'vin',
      label: 'VIN Number',
      sort: false,
    },
    {
      key: 'reserved',
      label: 'Reserve Status',
      sort: false,
    },
    {
      key: 'auctionDate',
      label: 'Pending Auction Date',
      sort: false,
    },
    {
      key: 'bidAmount',
      label: 'Bidding Amount',
      sort: false,
    },
  ];

  constructor(
    private auctionService: AuctionService,
    private userService: UserListingService,
    private messageService: MessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.userId = localStorage.getItem('selectedUserId');
    console.log('User ID:', this.userId);
    this.fetchUserDetails(this.userId);
    this.query = { ...this.query, sellerId: this.userId };
    this.fetchAuctionDetails(this.query);
  }

  onTabChange(index: any): void {
    console.log('Selected tab index:', index);
    if (index === 0) {
      this.listOfColumns = this.listOfColumns.filter(
        (column) => column.key !== 'auctionStatus'
      );
    } else if (index === 1) {
      const auctionStatusColumn = {
        key: 'auctionStatus',
        label: 'Auction Status',
        sort: false,
      };
      const auctionDateColumnIndex = this.listOfColumns.findIndex(
        (column) => column.key === 'auctionDate'
      );
      if (auctionDateColumnIndex !== -1) {
        this.listOfColumns[auctionDateColumnIndex].label = 'Auction Date';
      }
      this.listOfColumns.splice(4, 0, auctionStatusColumn);
    }
  }

  fetchUserDetails(userId: string) {
    this.userService.getUserDetailsById(this.userId).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data) {
          this.userInfo = data?.data;
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }

  fetchAuctionDetails(query: any) {
    this.auctionService.getAuctionDetailsBySellerId(query).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data) {
          this.auctionInfo = data?.data;
          this.totalRecords = data?.data?.length;
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }

  onSortChange(column: any): void {
    console.log(column);
    this.query = { ...this.query, sortOrder: column.sortOrder };
    console.log(this.query);
    this.fetchAuctionDetails(this.query);
  }

  onPageChange(page: number): void {
    this.query = { ...this.query, page: page };
    this.fetchAuctionDetails(this.query);
  }

  onSearchInput(search: any): void {
    console.log(search);
    if (search !== '') {
      this.query = { ...this.query, search: search };
    } else {
      delete this.query.search;
    }
    this.fetchAuctionDetails(this.query);
  }

  handleViewMore(id: any) {
    console.log(id);
    localStorage.setItem('selectedAuctionId', id);
    this.router.navigate([
      '/dashboard/seller-listing/seller-details/vehicle-info',
    ]);
  }

  handleRequest(data: any, type: string) {
    if (type === 'deny') {
      this.openDenialModal = true;
    }
    if (type === 'accept') {
      this.openApproveModal = true;
      this.tractorData = data;
    }
  }

  handleClose() {
    this.openDenialModal = false;
    this.openApproveModal = false;
  }
}
