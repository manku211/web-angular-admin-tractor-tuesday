import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {
  BlockUserParams,
  UserListingService,
} from '../../../core/services/user/user-listing.service';
import { MessageService } from '../../../core/services/message/message.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, FormsModule],
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
  reasons = [
    'Violation of terms of service',
    'Inappropriate behavior',
    'Fraudulent activity',
    'Security concerns',
    'Legal compliance',
    'Disruption of services',
  ];
  constructor(
    private userService: UserListingService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.userId = history.state.userId;
    console.log('User ID:', this.userId);
    this.fetchUserDetails(this.userId);
  }

  fetchUserDetails(userId: string) {
    this.userService.getUserDetailsById(this.userId).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data) {
          this.userInfo = data?.data;
          this.userBlockText = this.userInfo?.isDeleted ? 'UnBlock' : 'Block';
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }

  handleUserAccount() {
    let action = this.userBlockText === 'Block' ? 'deactivate' : 'activate';
    let payload: BlockUserParams = {
      email: this.userInfo?.email,
      action: action,
      reason: this.selectedReason ? this.selectedReason : this.otherReason,
    };
    this.userService.blockUnblockUser(payload).subscribe({
      next: (data) => {
        if (data) {
          const successMessage = `User ${
            action === 'deactivate' ? 'deactivated' : 'activated'
          } successfully.`;
          this.messageService?.success(successMessage);
          this.showBlockReasonModal = false;
          this.otherReason = '';
          this.selectedReason = '';
          this.fetchUserDetails(this.userId);
        }
      },
      error: (err) => {
        this.showBlockReasonModal = false;
        this.otherReason = '';
        this.selectedReason = '';
      },
    });
  }

  showBlockReason() {
    this.showBlockReasonModal = true;
  }

  handleCancel(): void {
    this.showBlockReasonModal = false;
    this.otherReason = '';
    this.selectedReason = '';
  }

  shouldDisableButton(): boolean {
    if (
      this.userBlockText === 'Block' &&
      !this.selectedReason &&
      !this.otherReason
    ) {
      return true;
    }
    return false;
  }
}
