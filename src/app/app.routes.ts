import { Routes } from '@angular/router';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'dashboard',
    component: BaseLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'welcome',
        loadChildren: () =>
          import('./pages/welcome/welcome.routes').then(
            (m) => m.WELCOME_ROUTES
          ),
      },
    ],
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./pages/welcome/welcome.routes').then((m) => m.WELCOME_ROUTES),
  },
];
