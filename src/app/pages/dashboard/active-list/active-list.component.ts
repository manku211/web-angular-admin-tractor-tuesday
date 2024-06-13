import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';
import { countryCodes } from '../../../core/models/countryCodes';
import { Router, RouterModule } from '@angular/router';
import { UserListingService } from '../../../core/services/user/user-listing.service';
import { CountryHelperService } from '../../../utilities/helpers/country-helper.service';
import { MessageService } from '../../../core/services/message/message.service';

interface User {
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
  sortField?: string;
  altSortField?: string;
  listOfFilter?: any[];
  filter?: boolean;
}

@Component({
  selector: 'app-active-list',
  standalone: true,
  imports: [SharedModule, TableViewComponent, RouterModule],
  templateUrl: './active-list.component.html',
  styleUrl: './active-list.component.css',
})
export class ActiveListComponent {
  listOfData: User[] = [];
  listOfSellerData: User[] = [];
  query: any = { skip: 1, take: 5, fetch: 'all' };
  sellerQuery: any = { skip: 1, take: 5, fetch: 'seller' };
  loader: boolean = false;
  totalRecords: number = 0;
  countryFlag!: string;
  countryName!: string;
  countryCodes = countryCodes;
  listOfColumns: ColumnInfo[] = [
    {
      key: 'fullName',
      label: 'Full Name',
      sort: true,
      sortOrder: 'DESC',
      sortField: 'fullName',
      altSortField: 'username',
    },
    // {
    //   key: 'email',
    //   label: 'Email Address',
    //   sort: true,
    //   sortField: 'email',
    //   sortOrder: 'DESC',
    // },
    {
      key: 'country',
      label: 'Country',
      sort: false,
    },
    {
      key: 'blockStatus',
      label: 'Block Status',
      sort: false,
      filter: false,
      listOfFilter: [
        { text: 'Blocked', value: 'Blocked' },
        { text: 'N/A', value: 'UnBlocked' },
      ],
    },
  ];

  listOfSellerColumns: ColumnInfo[] = [
    {
      key: 'fullName',
      label: 'Name',
      sort: true,
      sortField: 'fullName',
      sortOrder: 'DESC',
    },
    // {
    //   key: 'email',
    //   label: 'Email',
    //   sort: true,
    // },
    {
      key: 'country',
      label: 'Country',
      sort: false,
    },
    {
      key: 'auctions',
      label: 'Number of auctions',
      sort: false,
    },
  ];

  constructor(
    private router: Router,
    private userService: UserListingService,
    public countryHelper: CountryHelperService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.fetchDetails(this.query);
    this.fetchSellerDetails(this.sellerQuery);
  }

  fetchDetails(params: any) {
    this.loader = true;
    this.userService.getAllUsers(params).subscribe({
      next: (res) => {
        this.loader = false;
        this.listOfData = res.data?.users;
      },
      error: (err) => {
        this.loader = false;
        this.messageService.error(err?.error?.error);
        console.error(err?.error?.error);
      },
    });
  }

  fetchSellerDetails(params: any) {
    this.loader = true;
    this.userService.getAllUsers(params).subscribe({
      next: (res) => {
        this.loader = false;
        this.listOfSellerData = res.data?.users;
      },
      error: (err) => {
        this.loader = false;
        this.messageService.error(err?.error?.error);
        console.error(err?.error?.error);
      },
    });
  }

  onSortChange(column: any): void {
    this.query = {
      ...this.query,
      sortOrder: column.sortOrder,
      sortField: column.sortField ? column.sortField : column.altSortField,
    };
    this.fetchDetails(this.query);
  }

  onSortChangeSeller(column: any): void {
    this.sellerQuery = {
      ...this.sellerQuery,
      sortOrder: column.sortOrder,
      sortField: column.sortField ? column.sortField : column.altSortField,
    };
    this.fetchSellerDetails(this.sellerQuery);
  }
}
