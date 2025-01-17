import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { Router } from '@angular/router';
import { UserListingService } from '../../core/services/user/user-listing.service';
import { SharedModule } from '../../shared/shared.module';
import { TableViewComponent } from '../../shared/components/table-view/table-view.component';

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
}

@Component({
  selector: 'app-seller-list',
  standalone: true,
  imports: [SharedModule, TableViewComponent],
  templateUrl: './seller-list.component.html',
  styleUrl: './seller-list.component.css',
})
export class SellerListComponent {
  listOfData: Seller[] = [];
  query: any = { page: 1, limit: 10, fetch: 'seller' };
  loader: boolean = false;
  totalRecords: number = 0;
  listOfColumns: ColumnInfo[] = [
    {
      key: 'fullName',
      label: 'Name',
      sort: true,
      sortOrder: 'DESC',
    },
    {
      key: 'email',
      label: 'Email',
      sort: true,
    },
    {
      key: 'phoneNumber',
      label: 'Phone Number',
      sort: false,
    },
    {
      key: 'auctions',
      label: 'Number of auctions',
      sort: false,
    },
    {
      key: 'createdAt',
      label: 'Joining Date',
      sort: false,
    },
  ];

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private userService: UserListingService
  ) {}
  ngOnInit() {
    this.fetchDetails(this.query);
  }

  fetchDetails(params: any) {
    this.loader = true;
    this.userService.getAllUsers(params).subscribe((res) => {
      this.loader = false;
      this.listOfData = res.data?.users;
      this.totalRecords = res.data?.count;
    });
  }

  onSortChange(column: any): void {
    if (column.sortOrder === null) {
      const { sortOrder, sortField, ...newQuery } = this.query;
      this.query = newQuery;
    } else {
      this.query = {
        ...this.query,
        sortOrder: column.sortOrder,
        sortField: column.key,
      };
    }
    this.fetchDetails(this.query);
  }

  onPageChange(page: number): void {
    this.query = { ...this.query, skip: page };
    this.fetchDetails(this.query);
  }

  onSearchInput(search: any): void {
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
    this.router.navigate(['/dashboard/seller-listing/seller-details']);
  }
}
