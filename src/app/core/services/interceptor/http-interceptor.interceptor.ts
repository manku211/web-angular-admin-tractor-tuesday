import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

export const httpInterceptorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: any
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const refresh_token = localStorage.getItem('refresh_token');
  console.log('req', req);
  let cloned: any;
  if (token || refresh_token) {
    if (req.url.includes('generateAccessTokenUser')) {
      cloned = req.clone({
        setHeaders: {
          authorization: 'Bearer ' + refresh_token,
        },
      });
    } else {
      cloned = req.clone({
        setHeaders: {
          authorization: 'Bearer ' + token,
        },
      });
    }
    // authService.startTokenRefreshCheck();
    return next(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP error occurred:', error);
        if (error?.status === 401) {
          console.log('session is expired');
          localStorage.clear();
          router.navigate(['/']);
        }
        return throwError(() => error);
      })
    );
  } else {
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP error occurred:', error);
        return throwError(() => error);
      })
    );
  }
};
