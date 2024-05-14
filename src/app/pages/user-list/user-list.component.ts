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
  sortOrder?: string;
  type?: string;
  sortField?: string;
  altSortField?: string;
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
      label: 'Name',
      sort: true,
      sortOrder: 'DESC',
      sortField: 'fullName',
      altSortField: 'username',
    },
    {
      key: 'email',
      label: 'Email',
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
    console.log(params);
    this.loader = true;
    this.userService.getAllUsers(params).subscribe({
      next: (res) => {
        console.log('Response', res?.data?.users);
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
    console.log(column);
    this.query = {
      ...this.query,
      sortOrder: column.sortOrder,
      sortField: column.sortField ? column.sortField : column.altSortField,
    };
    console.log(this.query);
    this.fetchDetails(this.query);
  }

  onPageChange(page: number): void {
    this.query = { ...this.query, skip: page };
    this.fetchDetails(this.query);
  }

  async onSearchInput(search: any): Promise<void> {
    search = search.trim();
    console.log(search.length);
    // this.searchResults = await this.algoliaService.userSearch(search);
    // console.log(this.searchResults);
    if (search.length < 3 && search.length >= 1) {
      this.messageService.warning(
        'Please search for atleast three characters.'
      );
      return;
    }

    if (search !== '') {
      this.query = { ...this.query, search: search };
      this.fetchDetails(this.query);
    } else {
      delete this.query.search;
    }
  }

  handleViewMore(id: any) {
    console.log(id);
    localStorage.setItem('selectedUserId', id);
    this.router.navigate(['/dashboard/user-listing/user-details']);
  } // Assign the imported countryCodes array to a property in your component
}
