import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from '../../core/services/profile/profile.service';
import { Privileges, Roles } from '../../core/models/rolePrivileges';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { BehaviorSubject } from 'rxjs';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  privilege?: Privileges;
}
interface Privilege {
  name: string;
  read: boolean;
  write: boolean;
  _id: string;
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
  menuItems: any[] = [];
  logoutLoader: boolean = false;
  privileges: Privilege[] = [];
  roles = Roles;

  private adminDetailsSubject = new BehaviorSubject<any>(null);
  public adminDetails$ = this.adminDetailsSubject.asObservable();

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private profileService: ProfileService
  ) {}
  ngOnInit() {
    this.fetchAdminDetails();
    this.profileService.getProfileData().subscribe({
      next: (data) => {
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
        if (data?.data) {
          this.adminDetails = data?.data;
          this.privileges = data?.data?.privileges;
          this.authService.setRole(data?.data?.role);
          this.authService.setPrivileges(data?.data?.privileges);

          const allMenuItems = [
            { label: 'Dashboard', icon: 'home', route: '/dashboard' },
            {
              label: 'User List',
              icon: 'unordered-list',
              route: '/dashboard/user-listing',
              privilege: 'USER_LISTING',
            },
            {
              label: 'Seller List',
              icon: 'unordered-list',
              route: '/dashboard/seller-listing',
              privilege: 'SELLER_LISTING',
            },
            {
              label: 'Pending List',
              icon: 'field-time',
              route: '/dashboard/pending-auctions',
              privilege: 'SELLER_LISTING',
            },
            {
              label: 'Photographers',
              icon: 'camera',
              route: '/dashboard/photographers',
              privilege: 'PHOTOGRAPHER_MANAGEMENT',
            },
            {
              label: 'Photoshoot Requests',
              icon: 'camera',
              route: '/dashboard/photographers/photoshoot-requests',
              privilege: 'PHOTOGRAPHER_MANAGEMENT',
            },
            {
              label: 'Category Listing',
              icon: 'appstore',
              route: '/dashboard/category-listing',
              privilege: 'CATEGORY_LISTING',
            },
            {
              label: 'Control Panel',
              icon: 'setting',
              route: '/dashboard/control-panel',
              privilege: 'CONTROL_PANEL',
            },
          ];

          if (data?.data?.role === Roles.SUPER_ADMIN) {
            this.menuItems = allMenuItems;
          } else {
            this.menuItems = allMenuItems.filter((item) => {
              if (!item.privilege) return true;
              const privilege = this.privileges.find(
                (p) => p.name === item.privilege
              );
              return privilege && privilege.read;
            });
          }
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
    this.logoutLoader = true;
    this.authService.logout().subscribe({
      next: (data) => {
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

  hasAccess(privilege: any) {
    // return (
    //   this.authService.hasReadAccess(privilege) ||
    //   this.authService.hasWriteAccess(privilege)
    // );
  }

  handleCancel() {
    this.openLogoutModal = false;
  }
}
