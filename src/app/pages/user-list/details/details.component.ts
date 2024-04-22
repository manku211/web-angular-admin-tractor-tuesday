import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { UserListingService } from '../../../core/services/user/user-listing.service';
import { MessageService } from '../../../core/services/message/message.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  userId: any;
  userInfo: any;
  constructor(
    private userService: UserListingService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.userId = history.state.userId;
    console.log('User ID:', this.userId);
    this.userService.getUserDetailsById(this.userId).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data) {
          this.userInfo = data?.data;
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }
}
