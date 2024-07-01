import { Component } from '@angular/core';
import {
  getExteriorImageUrl,
  styleObject,
} from '../../../utilities/helpers/helper';
import { MessageService } from '../../../core/services/message/message.service';
import { Router } from '@angular/router';
import { CountryHelperService } from '../../../utilities/helpers/country-helper.service';
import { AlgoliaSearchService } from '../../../utilities/helpers/algolia-search.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';
import { CommonModule } from '@angular/common';

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
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [TableViewComponent, CommonModule],
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
  page: number = 0;
  totalRecords: number = 0;
  query: any = { skip: 1, take: 10, auctionStatus: 'ONGOING,ENDED' };
  styleObject: any = styleObject;
  loader: boolean = false;
  searchResults: any;
  exteriorImageUrl: string = '';
  reasons = [
    'Violation of terms of service',
    'Inappropriate behavior',
    'Fraudulent activity',
    'Security concerns',
    'Legal compliance',
    'Disruption of services',
  ];
  auctionInfo: any;
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
      sort: false,
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
    private messageService: MessageService,
    private router: Router,
    public countryHelper: CountryHelperService,
    private algoliaService: AlgoliaSearchService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    const category = localStorage.getItem('selectedUserId');
    this.query = { ...this.query, equipmentCategories: category };
    this.fetchAuctionDetails(this.query);
  }

  fetchAuctionDetails(query: any) {
    this.loader = true;
    this.categoryService.getCategory(query).subscribe({
      next: (data: any) => {
        if (data) {
          this.loader = false;
          const auctionsWithImageUrl = data?.data?.categories.map(
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
        this.loader = false;
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }

  onSortChange(column: any): void {
    if (column?.sortOrder === null) {
      const { sortOrder, sortField, ...newQuery } = this.query;
      this.query = newQuery;
    } else {
      this.query = {
        ...this.query,
        sortOrder: column.sortOrder,
        sortField: 'tractorId.name',
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
      this.fetchAuctionDetails({
        ...updatedQuery,
        auctionStatus: 'ONGOING,ENDED',
      });
    }
  }

  onPageChange(page: number): void {
    this.page = page;
    this.query = { ...this.query, skip: page };
    this.fetchAuctionDetails(this.query);
  }

  async onSearchInput(search: any): Promise<void> {
    if (search !== '') {
      const res: any = await this.algoliaService.auctionSearch(search, {
        page: this.page,
        hitsPerPage: 10,
      });

      this.auctionInfo = res.map((item: any) => ({
        tractorId: {
          category: item?.tractorId?.category,
          name: item?.tractorName,
          vin: item?.vin,
        },
        exteriorImageUrl: getExteriorImageUrl(item),
        auctionStatus: item?.auctionStatus,
        createdAt: item?.createdAt,
        currentBid: item?.currentBid,
      }));
      console.log(this.auctionInfo);

      this.totalRecords = this.auctionInfo.length;
    }
    if (search === '') {
      this.fetchAuctionDetails(this.query);
    }
  }

  handleViewMore(id: any) {
    localStorage.setItem('selectedAuctionId', id);
    this.router.navigate([
      '/dashboard/category-listing/category-details/vehicle-info',
    ]);
  }
}
