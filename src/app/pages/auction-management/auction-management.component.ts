import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuctionService } from '../../core/services/auction/auction.service';
import { TableViewComponent } from '../../shared/components/table-view/table-view.component';
import { SharedModule } from '../../shared/shared.module';
import {
  getExteriorImageUrl,
  styleObject,
} from '../../utilities/helpers/helper';

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
}

@Component({
  selector: 'app-auction-management',
  standalone: true,
  imports: [TableViewComponent, SharedModule],
  templateUrl: './auction-management.component.html',
  styleUrl: './auction-management.component.css',
})
export class AuctionManagementComponent {
  listOfData: AuctionInfo[] = [];
  query: any = { page: 1, limit: 10, fetch: 'all' };
  loader: boolean = false;
  totalRecords: number = 0;
  countryFlag!: string;
  styleObject: any = styleObject;
  countryName!: string;
  exteriorImageUrl: string = '';
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
      key: 'reserve_status',
      label: 'Reserve Status',
      sort: false,
    },
    {
      key: 'auction_status',
      label: 'Auction Status',
      sort: false,
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

  onSortChange(column: any): void {
    console.log(column);
    this.query = { ...this.query, sortOrder: column.sortOrder };
    console.log(this.query);
    this.fetchDetails(this.query);
  }

  onPageChange(page: number): void {
    this.query = { ...this.query, page: page };
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

  handleSendEmail(id: any) {
    console.log(id);
  }
}
