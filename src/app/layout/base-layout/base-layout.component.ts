import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../core/services/profile/profile.service';
import { Privileges } from '../../core/models/rolePrivileges';
import { ModalComponent } from '../../shared/components/modal/modal.component';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  privilege?: Privileges;
}

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [SharedModule, RouterModule, ModalComponent],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.css',
})
export class BaseLayoutComponent {
  isCollapsed = false;
  adminDetails: any = {};
  hasUserListingAccess: boolean = true;
  hasSellerListingAccess: boolean = true;
  hasControlPanelAccess: boolean = true;
  openLogoutModal: boolean = false;
  menuItems: MenuItem[] = [];
  logoutLoader: boolean = false;
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private profileService: ProfileService
  ) {}
  ngOnInit() {
    this.fetchAdminDetails();
    this.menuItems = [
      { label: 'Dasboard', icon: 'home', route: '/dashboard' },
      {
        label: 'User List',
        icon: 'unordered-list',
        route: '/dashboard/user-listing',
        privilege: Privileges.USER_LISTING,
      },
      {
        label: 'Seller List',
        icon: 'unordered-list',
        route: '/dashboard/seller-listing',
        privilege: Privileges.SELLER_LISTING,
      },
      {
        label: 'Category Listing',
        icon: 'appstore',
        route: '/dashboard/category-listing',
        privilege: Privileges.CATEGORY_LISTING,
      },
      {
        label: 'Control Panel',
        icon: 'setting',
        route: '/dashboard/control-panel',
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

  handleDashboard() {
    this.router.navigate(['dashboard']);
  }

  handleOpenLogoutModal() {
    this.openLogoutModal = true;
  }

  logout() {
    console.log('logout');
    this.logoutLoader = true;
    this.authService.logout().subscribe({
      next: (data) => {
        console.log(data);
        if (data) {
          localStorage.clear();
          this.logoutLoader = false;
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

  hasAccess(privilege: any): boolean {
    return (
      this.authService.hasReadAccess(privilege) ||
      this.authService.hasWriteAccess(privilege)
    );
  }

  handleCancel() {
    this.openLogoutModal = false;
  }
}
