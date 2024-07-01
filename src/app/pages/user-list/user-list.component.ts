import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { Router } from '@angular/router';
import { TableViewComponent } from '../../shared/components/table-view/table-view.component';
import { UserListingService } from '../../core/services/user/user-listing.service';
import { countryCodes } from '../../core/models/countryCodes';
import { CountryHelperService } from '../../utilities/helpers/country-helper.service';
import { AlgoliaSearchService } from '../../utilities/helpers/algolia-search.service';

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
  sortOrder?: string | null;
  type?: string;
  sortField?: string;
  altSortField?: string;
  sortDirections?: any[];
  listOfFilter?: any[];
  filter?: boolean;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SharedModule, TableViewComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  listOfData: User[] = [];
  query: any = { skip: 1, take: 10, fetch: 'all' };
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
      sortOrder: null,
      sortField: 'fullName',
      sortDirections: ['ascend', 'descend', null],
      altSortField: 'username',
    },
    {
      key: 'email',
      label: 'Email Address',
      sort: true,
      sortField: 'email',
      sortOrder: 'DESC',
    },
    {
      key: 'country',
      label: 'Country',
      sort: false,
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number',
      sort: false,
    },
    {
      key: 'blockStatus',
      label: 'Block Status',
      sort: false,
      filter: true,
      listOfFilter: [
        { text: 'Blocked', value: 'blocked' },
        { text: 'N/A', value: 'unblocked' },
      ],
    },
    {
      key: 'createdAt',
      label: 'Joining Date',
      sort: false,
    },
  ];
  algoliaquery: string = '';
  searchResults: any[] = [];
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserListingService,
    public countryHelper: CountryHelperService,
    private algoliaService: AlgoliaSearchService
  ) {}

  ngOnInit() {
    this.fetchDetails(this.query);
  }

  fetchDetails(params: any) {
    this.loader = true;
    this.userService.getAllUsers(params).subscribe({
      next: (res) => {
        this.loader = false;
        this.listOfData = res.data?.users;
        this.totalRecords = res.data?.count;
      },
      error: (err) => {
        this.loader = false;
        this.messageService.error(err?.error?.error);
        console.error(err?.error?.error);
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
        sortField: column.sortField ? column.sortField : column.altSortField,
      };
    }
    this.fetchDetails(this.query);
  }

  onPageChange(page: number): void {
    this.query = { ...this.query, skip: page };
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

  async onSearchInput(search: any): Promise<void> {
    search = search.trim();
    if (search.length < 3 && search.length >= 1) {
      this.messageService.warning(
        'Please search for atleast three characters.'
      );
      return;
    }

    if (search !== '') {
      this.query = { ...this.query, search: search };
    } else {
      delete this.query.search;
    }
    this.fetchDetails(this.query);
  }

  handleViewMore(id: any) {
    localStorage.setItem('selectedUserId', id);
    this.router.navigate(['/dashboard/user-listing/user-details']);
  }
}
