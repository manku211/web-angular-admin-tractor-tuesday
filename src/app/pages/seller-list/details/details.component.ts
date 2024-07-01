import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { UserListingService } from '../../../core/services/user/user-listing.service';
import { MessageService } from '../../../core/services/message/message.service';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';
import { AuctionService } from '../../../core/services/auction/auction.service';
import { Router } from '@angular/router';
import { DenyModalComponent } from '../deny-modal/deny-modal.component';
import { ApproveModalComponent } from '../approve-modal/approve-modal.component';
import { DetailsCardComponent } from '../../../shared/components/details-card/details-card.component';
import {
  getExteriorImageUrl,
  styleObject,
} from '../../../utilities/helpers/helper';
import { EquipmentCategory } from '../../../core/models/equipmentCategories';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PrivilegeDirective } from '../../../core/directives/privilege.directive';
import { Privileges } from '../../../core/models/rolePrivileges';
import { CommentEditorComponent } from '../comment-editor/comment-editor.component';

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
  listOfFilter?: any[];
  filter?: boolean;
  isMultiple?: boolean;
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    SharedModule,
    TableViewComponent,
    DenyModalComponent,
    ApproveModalComponent,
    DetailsCardComponent,
    ModalComponent,
    PrivilegeDirective,
    CommentEditorComponent,
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
  tabIndex: number = 0;
  openRejectModal: boolean = false;
  privileges = Privileges;

  getCategoryFilters = () => {
    return Object.entries(EquipmentCategory).map(([key, value]) => ({
      text: value,
      value: value,
    }));
  };

  listOfColumns: ColumnInfo[] = [
    {
      key: 'tractor_name',
      label: 'Tractor Name',
      sort: true,
      sortOrder: 'DESC',
    },
    {
      key: 'equipmentCategories',
      label: 'Category',
      sort: false,
      filter: true,
      isMultiple: true,
      listOfFilter: this.getCategoryFilters(),
    },
    {
      key: 'vin',
      label: 'VIN Number',
      sort: false,
    },
    {
      key: 'filter',
      label: 'Reserve Status',
      sort: false,
      filter: true,
      listOfFilter: [
        { text: 'Reserved', value: 'RESERVED' },
        { text: 'Non-reserved', value: 'UNRESERVED' },
      ],
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
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.userId = localStorage.getItem('selectedUserId');
    this.fetchUserDetails(this.userId);
    this.query = {
      ...this.query,
      sellerId: this.userId,
      auctionStatus: 'PENDING',
    };
    this.fetchAuctionDetails(this.query);
  }

  onTabChange(index: any): void {
    this.tabIndex = index;
    if (index === 0) {
      this.listOfColumns = this.listOfColumns.filter(
        (column) => column.key !== 'auctionStatus'
      );
      this.query = {
        ...this.query,
        sellerId: this.userId,
        auctionStatus: 'PENDING',
      };
      this.fetchAuctionDetails(this.query);
    } else if (index === 1) {
      const auctionStatusColumnExists = this.listOfColumns.some(
        (column) => column.key === 'auctionStatus'
      );

      if (!auctionStatusColumnExists) {
        const auctionStatusColumn = {
          key: 'auctionStatus',
          label: 'Auction Status',
          sort: false,
          filter: true,
          listOfFilter: [
            { text: 'Ongoing', value: 'ONGOING' },
            { text: 'Ended', value: 'ENDED' },
          ],
        };

        this.listOfColumns.splice(4, 0, auctionStatusColumn);
      }
      this.query = {
        ...this.query,
        sellerId: this.userId,
        auctionStatus: 'ONGOING,ENDED',
      };
      this.fetchAuctionDetails(this.query);
      const auctionDateColumnIndex = this.listOfColumns.findIndex(
        (column) => column.key === 'auctionDate'
      );
      if (auctionDateColumnIndex !== -1) {
        this.listOfColumns[auctionDateColumnIndex].label = 'Auction Date';
      }
      // this.listOfColumns.splice(4, 0, auctionStatusColumn);
    }
  }

  fetchUserDetails(userId: string) {
    this.userService.getUserDetailsById(userId).subscribe({
      next: (data: any) => {
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
    this.loader = true;
    this.auctionService.getAuctionDetailsBySellerId(query).subscribe({
      next: (data: any) => {
        if (data) {
          const auctionsWithImageUrl = data?.data?.auctions.map(
            (auction: any) => {
              return {
                ...auction,
                exteriorImageUrl: getExteriorImageUrl(auction),
              };
            }
          );
          this.loader = false;
          if (this.tabIndex === 0) this.auctionInfo = auctionsWithImageUrl;
          else if (this.tabIndex === 1) {
            this.auctionInfo = auctionsWithImageUrl;
          }
          this.totalRecords = data?.data?.count;
        }
      },
      error: (error) => {
        this.loader = false;
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }

  onSortChange(column: any): void {
    console.log(column);
    let auctionsFilter: any;
    if (column?.sortOrder === null) {
      const { auctionsFilter, ...newQuery } = this.query;
      this.query = newQuery;
    } else {
      if (column?.key === 'tractor_name') {
        auctionsFilter =
          column?.sortOrder === 'ASC' ? 'TRACTOR_ASC' : 'TRACTOR_DESC';
      }
      this.query = {
        ...this.query,
        auctionsFilter: auctionsFilter,
      };
    }
    this.fetchAuctionDetails(this.query);
  }

  onFilterHandler(filteredColumn: any): void {
    const key = filteredColumn?.column?.key;
    if (filteredColumn.event != null) {
      this.query = { ...this.query, [key]: filteredColumn.event };
      this.fetchAuctionDetails(this.query);
    } else {
      const updatedQuery = { ...this.query };
      delete updatedQuery[key];
      this.fetchAuctionDetails(updatedQuery);
    }
  }

  onPageChange(page: number): void {
    this.query = { ...this.query, skip: page };
    this.fetchAuctionDetails(this.query);
  }

  onSearchInput(search: any): void {
    if (search !== '') {
      this.query = { ...this.query, search: search };
    } else {
      delete this.query.search;
    }
    this.fetchAuctionDetails(this.query);
  }

  handleViewMore(id: any) {
    localStorage.setItem('selectedAuctionId', id);
    this.router.navigate([
      '/dashboard/seller-listing/seller-details/vehicle-info',
    ]);
  }

  // handleRequest(data: any, type: string) {
  //   this.tractorData = data;
  //   if (type === 'deny') {
  //     this.openDenialModal = true;
  //   }
  //   if (type === 'accept') {
  //     this.openApproveModal = true;
  //   }
  // }

  handleReject() {
    const payload = {
      auctionStatus: 'ENDED',
      tractorId: this.tractorData?.tractorId?._id,
      isApprovedByAdmin: false,
    };
    const auctionId = this.tractorData?._id;
    this.auctionService.updateAuction(auctionId, payload).subscribe({
      next: (data) => {
        this.openRejectModal = false;
      },
      error: (err) => {
        this.openRejectModal = false;
      },
    });
  }

  handleRequest(data: any, action: string): void {
    this.tractorData = data;
    switch (action) {
      case 'accept':
        this.openApproveModal = true;
        break;
      case 'deny':
        this.openDenialModal = true;
        break;
      case 'reject':
        this.openRejectModal = true;
        break;
      case 'edit':
        // Edit logic
        localStorage.setItem('selectedAuctionId', data?._id);
        this.router.navigate(
          ['/dashboard/seller-listing/seller-details/vehicle-info'],
          {
            state: { isEditMode: true },
          }
        );
        break;
    }
  }

  handleClose() {
    this.fetchAuctionDetails(this.query);
    this.openDenialModal = false;
    this.openApproveModal = false;
    this.openRejectModal = false;
  }
}
