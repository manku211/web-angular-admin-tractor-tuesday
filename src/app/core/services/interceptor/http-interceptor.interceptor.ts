import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const httpInterceptorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: any
) => {
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
