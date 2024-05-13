import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../core/services/profile/profile.service';
import { Privileges } from '../../core/models/rolePrivileges';

interface MenuItem {
  label: string;
  icon: string;
  action: () => void;
  privilege: Privileges;
}

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.css',
})
export class BaseLayoutComponent {
  isCollapsed = false;
  adminDetails: any = {};
  hasUserListingAccess: boolean = true;
  hasSellerListingAccess: boolean = true;
  hasControlPanelAccess: boolean = true;
  menuItems: MenuItem[] = [];
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private profileService: ProfileService
  ) {}
  ngOnInit() {
    this.fetchAdminDetails();
    this.menuItems = [
      {
        label: 'User List',
        icon: 'unordered-list',
        action: this.handleUserList,
        privilege: Privileges.USER_LISTING,
      },
      {
        label: 'Seller List',
        icon: 'unordered-list',
        action: this.handleSellerList,
        privilege: Privileges.SELLER_LISTING,
      },
      {
        label: 'Control Panel',
        icon: 'setting',
        action: this.handleControlPanel,
        privilege: Privileges.CONTROL_PANEL,
      },
      // Add other menu items here
    ];
    this.profileService.getProfileData().subscribe({
      next: (data) => {
        console.log('Admin details updated: ', data);
        if (data) {
          this.adminDetails.name = data.fullName;
          this.adminDetails.profilePicture = data.profilePicture;
        }
      },
      error: (err) => {
        console.error('Error fetching admin details: ', err);
      },
    });
  }

  fetchAdminDetails() {
    this.profileService.getAdmin().subscribe({
      next: (data) => {
        console.log(data);
        if (data?.data) {
          this.adminDetails = data?.data;
          this.hasUserListingAccess =
            this.authService.hasReadAccess(Privileges.USER_LISTING) ||
            this.authService.hasWriteAccess(Privileges.USER_LISTING);
          this.hasSellerListingAccess =
            this.authService.hasReadAccess(Privileges.SELLER_LISTING) ||
            this.authService.hasWriteAccess(Privileges.SELLER_LISTING);
          this.hasControlPanelAccess =
            this.authService.hasReadAccess(Privileges.CONTROL_PANEL) ||
            this.authService.hasWriteAccess(Privileges.CONTROL_PANEL);
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

  hasAccess(privilege: Privileges): boolean {
    return (
      this.authService.hasReadAccess(privilege) ||
      this.authService.hasWriteAccess(privilege)
    );
  }
}
