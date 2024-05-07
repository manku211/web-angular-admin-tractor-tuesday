import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile/profile.service';

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.css',
})
export class BaseLayoutComponent {
  isCollapsed = false;
  adminDetails: any;
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private profileService: ProfileService
  ) {}
  ngOnInit() {
    this.fetchAdminDetails();
  }

  fetchAdminDetails() {
    this.profileService.getAdmin().subscribe({
      next: (data) => {
        console.log(data);
        if (data?.data) {
          this.adminDetails = data?.data;
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  handleUserList() {
    this.router.navigate(['dashboard/user-listing']);
  }

  handleSellerList() {
    this.router.navigate(['dashboard/seller-listing']);
  }

  handleControlPanel() {
    this.router.navigate(['dashboard/control-panel']);
  }

  handleDashboard() {
    this.router.navigate(['dashboard']);
  }

  handleProfile() {
    this.router.navigate(['dashboard/profile']);
  }

  logout() {
    console.log('logout');
    this.authService.logout().subscribe({
      next: (data) => {
        console.log(data);
        if (data) {
          localStorage.clear();
          this.authService.stopTokenRefreshCheck();
          this.messageService.success('Logged out!');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }
}
