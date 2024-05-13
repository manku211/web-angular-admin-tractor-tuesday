import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { Privileges } from '../models/rolePrivileges';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  if (localStorage.getItem('token')) {
    const requiredPrivileges = route.data['privileges'];
    console.log(
      route.data,
      requiredPrivileges,
      authService.hasReadAccess(requiredPrivileges)
    );
    if (requiredPrivileges && !authService.hasReadAccess(requiredPrivileges)) {
      // Redirect to login page if the user doesn't have required privileges
      router.navigate(['/']);
      return false;
    }
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
