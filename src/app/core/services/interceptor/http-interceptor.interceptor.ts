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
  const token = localStorage.getItem('token');
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        authorization: 'Bearer ' + token,
      },
    });
    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP error occurred:', error);
        if (error?.status === 401) {
          console.log('session is expired');
          authService.$refreshToken.next(true);
        }
        return throwError(() => error);
      })
    );
  } else {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('HTTP error occurred:', error);
        return throwError(() => error);
      })
    );
  }
};
