import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Privileges, Roles } from '../models/rolePrivileges';
import { ProfileService } from '../services/profile/profile.service';
import { Observable, map, of, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (localStorage.getItem('token')) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};

export const PrivilegeGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const profileService = inject(ProfileService);
  const requiredPrivileges = route.data['privileges'] as Privileges[];

  if (localStorage.getItem('token')) {
    return new Observable<boolean>((observer) => {
      profileService.getAdmin().subscribe({
        next: (adminDetails) => {
          console.log('profile', adminDetails);
          if (!adminDetails?.data) {
            // Admin details not yet fetched, handle appropriately
            router.navigate(['/']);
            observer.next(false);
            observer.complete();
            return;
          }
          const isAdmin = adminDetails?.data.role === Roles.ADMIN;
          console.log('isAdmin', isAdmin);
          if (!isAdmin) {
            observer.next(true);
            observer.complete();
            return;
          }
          console.log(
            'test',
            requiredPrivileges &&
              !authService.hasRequiredPrivilege(
                adminDetails?.data.privileges,
                requiredPrivileges
              )
          );
          if (
            requiredPrivileges &&
            !authService.hasRequiredPrivilege(
              adminDetails?.data.privileges,
              requiredPrivileges
            )
          ) {
            router.navigate(['/']);
            observer.next(false);
            observer.complete();
            return;
          }

          observer.next(true);
          observer.complete();
        },
        error: (error) => {
          console.error('Error fetching admin details:', error);
          router.navigate(['/']);
          observer.next(false);
          observer.complete();
        },
      });
    });
  } else {
    router.navigate(['/']);
    return of(false);
  }
};
