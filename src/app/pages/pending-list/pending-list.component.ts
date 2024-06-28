import { Component } from '@angular/core';
import { AuctionService } from '../../core/services/auction/auction.service';
import {
  getExteriorImageUrl,
  styleObject,
} from '../../utilities/helpers/helper';
import { TableViewComponent } from '../../shared/components/table-view/table-view.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DenyModalComponent } from '../seller-list/deny-modal/deny-modal.component';
import { ApproveModalComponent } from '../seller-list/approve-modal/approve-modal.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { Router } from '@angular/router';

interface AuctionInfo {
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
  selector: 'app-pending-list',
  standalone: true,
  imports: [
    TableViewComponent,
    CommonModule,
    ModalComponent,
    SharedModule,
    DenyModalComponent,
    ApproveModalComponent,
  ],
  templateUrl: './pending-list.component.html',
  styleUrl: './pending-list.component.css',
})
export class PendingListComponent {
  listOfData: AuctionInfo[] = [];
  query: any = {
    skip: 1,
    take: 10,
  };
  loader: boolean = false;
  totalRecords: number = 0;
  countryFlag!: string;
  styleObject: any = styleObject;
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
  openRejectModal: boolean = false;
  listOfColumns: ColumnInfo[] = [
    {
      key: 'tractor_name',
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
      key: 'seller_name',
      label: 'Seller Name',
      sort: false,
    },

    {
      key: 'createdAt',
      label: 'Auction Date',
      sort: false,
    },
  ];

  constructor(private auctionService: AuctionService, private router: Router) {}

  ngOnInit() {
    this.fetchDetails(this.query);
  }

  fetchDetails(params: any) {
    this.loader = true;
    this.auctionService.getPendingRequests(params).subscribe((res) => {
      const auctionsWithImageUrl = res?.data?.map((auction: any) => {
        return {
          ...auction,
          exteriorImageUrl: getExteriorImageUrl(auction),
        };
      });
      this.loader = false;
      this.listOfData = auctionsWithImageUrl;
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
    let auctionsFilter: any;
    if (column?.key === 'tractor_name') {
      auctionsFilter =
        column?.sortOrder === 'ASC' ? 'TRACTOR_ASC' : 'TRACTOR_DESC';
    }
    this.query = {
      ...this.query,
      auctionsFilter: auctionsFilter,
    };
    this.fetchDetails(this.query);
  }

  onFilterHandler(filteredColumn: any): void {
    const key = filteredColumn?.column?.key;
    if (filteredColumn.event != null) {
      this.query = { ...this.query, [key]: filteredColumn.event };
      this.fetchDetails(this.query);
    } else {
      const updatedQuery = { ...this.query };
      delete updatedQuery[key];
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

  openAuctionDetailsModal(id: any) {
    this.auctionDetailsLoader = true;
    this.showAuctionDetailsModal = true;
    this.auctionService.getAuctionById(id).subscribe({
      next: (data) => {
        if (data?.data) {
          this.auctionDetails = data?.data;
          this.auctionDetailsLoader = false;
          this.populateDateTime();
        }
      },
      error: (err) => {
        console.error(err);
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
      // case 'edit':
      //   // Edit logic
      //   localStorage.setItem('selectedAuctionId', data?._id);
      //   this.router.navigate(
      //     ['/dashboard/seller-listing/seller-details/vehicle-info'],
      //     {
      //       state: { isEditMode: true },
      //     }
      //   );
      //   break;
    }
  }

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

  handleCancel(): void {
    this.showAuctionDetailsModal = false;
  }

  handleClose() {
    this.fetchDetails(this.query);
    this.openDenialModal = false;
    this.openApproveModal = false;
    this.openRejectModal = false;
  }

  handleViewMore(id: any) {
    localStorage.setItem('selectedAuctionId', id);
    this.router.navigate([
      '/dashboard/seller-listing/seller-details/vehicle-info',
    ]);
  }
}
