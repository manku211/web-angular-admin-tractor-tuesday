import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { Router } from '@angular/router';
import { TableViewComponent } from '../../shared/components/table-view/table-view.component';

interface User {
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
  selector: 'app-user-list',
  standalone: true,
  imports: [SharedModule, TableViewComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  listOfData: User[] = [];
  query: any = { page: 1, limit: 10 };
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
      key: 'createdAt',
      label: 'Joining Date',
      sort: false,
    },
  ];
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}
  ngOnInit() {
    this.fetchDetails(this.query);
  }

  fetchDetails(params: any) {
    console.log(params);
    this.loader = true;
    this.authService.getAllUsers(params).subscribe((res) => {
      console.log('Response', res?.data?.users);
      this.loader = false;
      this.listOfData = res.data?.users;
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

  handleViewMore() {
    this.router.navigate(['/dashboard/user-listing/user-details']);
  }
}
