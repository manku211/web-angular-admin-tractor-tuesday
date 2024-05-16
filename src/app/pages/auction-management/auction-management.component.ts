import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuctionService } from '../../core/services/auction/auction.service';
import { TableViewComponent } from '../../shared/components/table-view/table-view.component';
import { SharedModule } from '../../shared/shared.module';
import {
  getExteriorImageUrl,
  styleObject,
} from '../../utilities/helpers/helper';
import { ModalComponent } from '../../shared/components/modal/modal.component';

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
  selector: 'app-auction-management',
  standalone: true,
  imports: [TableViewComponent, SharedModule, ModalComponent],
  templateUrl: './auction-management.component.html',
  styleUrl: './auction-management.component.css',
})
export class AuctionManagementComponent {
  listOfData: AuctionInfo[] = [];
  query: any = {
    skip: 1,
    take: 10,
    fetch: 'all',
    auctionsFilter: 'CREATED_AT_LAST',
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
  listOfColumns: ColumnInfo[] = [
    {
      key: 'tractor_name',
      label: 'Tractor Name',
      sort: true,
      sortOrder: 'DESC',
    },
    // {
    //   key: 'category',
    //   label: 'Category',
    //   sort: true,
    // },
    {
      key: 'seller_name',
      label: 'Seller Name',
      sort: false,
    },
    {
      key: 'bid_winner',
      label: 'Bid Winner',
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
      key: 'auctionStatus',
      label: 'Auction Status',
      sort: false,
      filter: true,
      listOfFilter: [
        { text: 'Ongoing', value: 'ONGOING' },
        { text: 'Ended', value: 'ENDED' },
        { text: 'Denied', value: 'DENIED' },
      ],
    },
    {
      key: 'createdAt',
      label: 'Auction Date',
      sort: false,
    },
    {
      key: 'winning_bid_amount',
      label: 'Winning Bid Amount',
      sort: false,
    },
  ];

  constructor(private auctionService: AuctionService) {}

  ngOnInit() {
    this.fetchDetails(this.query);
  }

  fetchDetails(params: any) {
    console.log(params);
    this.loader = true;
    this.auctionService.getAllAuctions(params).subscribe((res) => {
      console.log('Response', res?.data?.auctions);
      this.exteriorImageUrl = getExteriorImageUrl(res?.data?.auctions);
      this.loader = false;
      this.listOfData = res.data?.auctions;
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
    console.log(column);
    let auctionsFilter: any;
    if (column?.key === 'tractor_name') {
      auctionsFilter =
        column?.sortOrder === 'ASC' ? 'TRACTOR_ASC' : 'TRACTOR_DESC';
    }
    this.query = {
      ...this.query,
      auctionsFilter: auctionsFilter,
    };
    console.log(this.query);
    this.fetchDetails(this.query);
  }

  onFilterHandler(filteredColumn: any): void {
    console.log(filteredColumn);
    const key = filteredColumn?.column?.key;
    if (filteredColumn.event != null) {
      this.query = { ...this.query, [key]: filteredColumn.event };
      console.log(this.query);
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
    console.log(search);
    if (search !== '') {
      this.query = { ...this.query, search: search };
    } else {
      delete this.query.search;
    }
    this.fetchDetails(this.query);
  }

  openAuctionDetailsModal(id: any) {
    console.log(id);
    this.auctionDetailsLoader = true;
    this.showAuctionDetailsModal = true;
    this.auctionService.getAuctionById(id).subscribe({
      next: (data) => {
        console.log(data);
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

  handleCancel(): void {
    this.showAuctionDetailsModal = false;
  }
}
