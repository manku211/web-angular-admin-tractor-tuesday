import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    component: BaseLayoutComponent,
    canActivate: [authGuard],
    children: [
      // {
      //   path: '',
      //   loadChildren: () =>
      //     import('./modules/dashboard/dashboard.module').then(
      //       (m) => m.DashboardModule
      //     ),
      // },
      {
        path: 'user-listing',
        loadChildren: () =>
          import('./modules/user-listing/user-listing.module').then(
            (m) => m.UserListingModule
          ),
        data: {
          breadcrumb: 'User Listing',
        },
      },
      {
        path: 'seller-listing',
        loadChildren: () =>
          import('./modules/seller-listing/seller-listing.module').then(
            (m) => m.SellerListingModule
          ),
        data: {
          breadcrumb: 'Seller Listing',
        },
      },
      {
        path: 'control-panel',
        loadChildren: () =>
          import('./modules/control-panel/control-panel.module').then(
            (m) => m.ControlPanelModule
          ),
        data: {
          breadcrumb: 'Control Panel',
        },
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./pages/welcome/welcome.routes').then((m) => m.WELCOME_ROUTES),
  },
];
