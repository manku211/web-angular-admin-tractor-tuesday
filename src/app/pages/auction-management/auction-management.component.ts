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
import { AlgoliaSearchService } from '../../utilities/helpers/algolia-search.service';

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
    auctionStatus: 'ONGOING,ENDED',
  };
  loader: boolean = false;
  totalRecords: number = 0;
  countryFlag!: string;
  styleObject: any = styleObject;
  countryName!: string;
  exteriorImageUrl: string = '';
  auctionDetails: any;
  page: number = 0;
  showAuctionDetailsModal: boolean = false;
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

  constructor(
    private auctionService: AuctionService,
    private algoliaService: AlgoliaSearchService
  ) {}

  ngOnInit() {
    this.fetchDetails(this.query);
  }

  fetchDetails(params: any) {
    this.loader = true;
    this.auctionService.getAllAuctions(params).subscribe((res) => {
      const auctionsWithImageUrl = res?.data?.auctions.map((auction: any) => {
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

  onSortChange(column: any): void {
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

  async onSearchInput(search: any): Promise<void> {
    if (search !== '') {
      const res: any = await this.algoliaService.auctionSearch(search, {
        page: this.page,
        hitsPerPage: 10,
      });

      this.listOfData = res.map((item: any) => ({
        tractorId: {
          name: item?.tractorName,
          vin: item?.vin,
        },
        auctionStatus: item?.auctionStatus,
        createdAt: item?.createdAt,
        currentBid: item?.currentBid,
      }));
      console.log(this.listOfData);

      this.totalRecords = this.listOfData.length;
    } else {
      this.fetchDetails(this.query);
    }
  }

  openAuctionDetailsModal(id: any) {
    this.auctionDetailsLoader = true;
    this.showAuctionDetailsModal = true;
    this.auctionService.getAuctionById(id).subscribe({
      next: (data) => {
        if (data?.data) {
          this.auctionDetails = data?.data;
          (this.auctionDetails['exteriorImageUrl'] = getExteriorImageUrl(
            data?.data
          )),
            (this.auctionDetailsLoader = false);
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
