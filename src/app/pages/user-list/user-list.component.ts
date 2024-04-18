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

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SharedModule, TableViewComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  listOfData: User[] = [];

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}
  ngOnInit() {
    this.authService.getAllUsers().subscribe((res) => {
      console.log('Response', res?.data?.users);
      this.listOfData = res.data?.users;
    });
  }

  handleSort(args: any) {}
  handlePageChange(args: any) {}
  handleSearch(args: any) {}
  handleActionClick(args: any) {}
}
