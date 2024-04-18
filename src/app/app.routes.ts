import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { ForgetPasswordComponent } from './modules/auth/forget-password/forget-password.component';
import { OtpVerifyComponent } from './modules/auth/otp-verify/otp-verify.component';
import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { DetailsComponent } from './pages/user-list/details/details.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'forgot-password', component: ForgetPasswordComponent },
  { path: 'otp-verification', component: OtpVerifyComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'dashboard',
    component: BaseLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'user-listing',
        loadChildren: () =>
          import('./modules/user-listing/user-listing.module').then(
            (m) => m.UserListingModule
          ),
        data: {
          breadcrumb: 'User-Listing',
        },
      },
    ],
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./pages/welcome/welcome.routes').then((m) => m.WELCOME_ROUTES),
  },
];
