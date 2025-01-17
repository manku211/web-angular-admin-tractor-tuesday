import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {
  BlockUserParams,
  UserListingService,
} from '../../../core/services/user/user-listing.service';
import { MessageService } from '../../../core/services/message/message.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';
import { Router } from '@angular/router';
import { AuctionService } from '../../../core/services/auction/auction.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { CountryHelperService } from '../../../utilities/helpers/country-helper.service';
import { DetailsCardComponent } from '../../../shared/components/details-card/details-card.component';
import {
  getExteriorImageUrl,
  styleObject,
} from '../../../utilities/helpers/helper';
import { AlgoliaSearchService } from '../../../utilities/helpers/algolia-search.service';
import { EquipmentCategory } from '../../../core/models/equipmentCategories';
interface User {
  _id: string;
  username: string;
  phoneNumber: number;
  country: string;
  blockStatus: boolean;
  auctionStatus: string;
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
    ReactiveFormsModule,
    FormsModule,
    TableViewComponent,
    ModalComponent,
    DetailsCardComponent,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  userId: any;
  userInfo: any;
  userBlockText!: string;
  showBlockReasonModal: boolean = false;
  selectedReason!: string;
  otherReason!: string;
  totalRecords: number = 0;
  query: any = { skip: 1, take: 10 };
  styleObject: any = styleObject;
  loader: boolean = false;
  searchResults: any;
  reasons = [
    'Violation of terms of service',
    'Inappropriate behavior',
    'Fraudulent activity',
    'Security concerns',
    'Legal compliance',
    'Disruption of services',
  ];
  auctionInfo: any;

  getCategoryFilters = () => {
    return Object.entries(EquipmentCategory).map(([key, value]) => ({
      text: value,
      value: value,
    }));
  };

  listOfColumns: ColumnInfo[] = [
    {
      key: 'TRACTOR_NAME',
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
      key: 'reserveStatus',
      label: 'Reserve Status',
      sort: false,
      filter: true,
      listOfFilter: [
        { text: 'Reserved', value: 'reserved' },
        { text: 'Non-reserved', value: 'unreserved' },
      ],
    },
    {
      key: 'auctionStatus',
      label: 'Auction Status',
      sort: false,
      filter: true,
      listOfFilter: [
        { text: 'Ongoing', value: 'ONGOING' },
        { text: 'Ended', value: 'ENDED' },
      ],
    },

    {
      key: 'auctionDate',
      label: 'Auction Date',
      sort: false,
    },
    {
      key: 'bidAmount',
      label: 'Bidding Amount',
      sort: false,
    },
  ];
  constructor(
    private userService: UserListingService,
    private messageService: MessageService,
    private router: Router,
    private auctionService: AuctionService,
    public countryHelper: CountryHelperService,
    private algoliaService: AlgoliaSearchService
  ) {}
  ngOnInit(): void {
    this.userId = localStorage.getItem('selectedUserId');
    this.fetchUserDetails(this.userId);
    this.query = {
      ...this.query,
      userId: this.userId,
    };
    this.fetchAuctionDetails(this.query);
  }

  fetchUserDetails(userId: string) {
    this.userService.getUserDetailsById(this.userId).subscribe({
      next: (data: any) => {
        if (data) {
          this.userInfo = data?.data;
          this.userBlockText = this.userInfo?.isDeleted ? 'UnBlock' : 'Block';
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }

  fetchAuctionDetails(query: any) {
    this.auctionService.getAuctionDetailsByUserId(query).subscribe({
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
          this.auctionInfo = auctionsWithImageUrl;
          this.totalRecords = data?.data?.count;
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }

  handleUserAccount() {
    let action = this.userBlockText === 'Block' ? 'deactivate' : 'activate';
    let payload: BlockUserParams = {
      email: this.userInfo?.email,
      action: action,
      reason: this.selectedReason ? this.selectedReason : this.otherReason,
    };
    this.userService.blockUnblockUser(payload).subscribe({
      next: (data) => {
        if (data) {
          const successMessage = `User ${
            action === 'deactivate' ? 'deactivated' : 'activated'
          } successfully.`;
          this.messageService?.success(successMessage);
          this.showBlockReasonModal = false;
          this.otherReason = '';
          this.selectedReason = '';
          this.fetchUserDetails(this.userId);
        }
      },
      error: (err) => {
        this.showBlockReasonModal = false;
        this.otherReason = '';
        this.selectedReason = '';
      },
    });
  }

  showBlockReason() {
    this.showBlockReasonModal = true;
  }

  handleCancel(): void {
    this.showBlockReasonModal = false;
    this.otherReason = '';
    this.selectedReason = '';
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

  onSortChange(column: any): void {
    if (column?.sortOrder === null) {
      const { sortOrder, sortField, ...newQuery } = this.query;
      this.query = newQuery;
    } else {
      this.query = {
        ...this.query,
        sortOrder: column.sortOrder,
        sortField: column?.key,
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

  async onSearchInput(search: any): Promise<void> {
    this.searchResults = await this.algoliaService.tractorSearch(search);
    if (search !== '') {
      this.query = { ...this.query, search: search };
    } else {
      delete this.query.search;
    }
    this.fetchAuctionDetails(this.query);
  }

  handleViewMore(id: any) {
    localStorage.setItem('selectedAuctionId', id);
    this.router.navigate(['/dashboard/user-listing/user-details/vehicle-info']);
  }
}
