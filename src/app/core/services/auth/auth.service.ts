import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, interval } from 'rxjs';
// import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private refreshSubscription!: Subscription;
  baseUrl = 'https://api-dev.tractortuesday.xyz/api/v1/';
  public $refreshToken = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {
    // console.log(environment.API_URL);
    this.$refreshToken.subscribe((res: any) => {
      this.getRefreshToken();
    });
  }

  adminLogin(credentials: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'admin/login', credentials);
  }

  verifyViaEmail(payload: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + 'admin/send-reset-password-email',
      payload
    );
  }

  verifyViaPhone(payload: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + 'admin/send-reset-password-sms',
      payload
    );
  }

  otpVerify(payload: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + 'admin/verify-reset-password-sms',
      payload
    );
  }

  resetPasswordPhone(payload: any): Observable<any> {
    return this.http.post<any>(
      this.baseUrl + 'admin/update-Password-using-phoneNumber',
      payload
    );
  }

  resetPasswordEmail(payload: any) {
    return this.http.patch<any>(this.baseUrl + 'admin/reset-password', payload);
  }

  getRefreshToken() {
    this.http
      .patch<any>(this.baseUrl + 'admin/generateAccessTokenUser', {})
      .subscribe((res: any) => {
        if (res) {
          localStorage.setItem('token', res?.data?.accessToken);
        } else {
          this.router.navigate(['/']);
        }
      });
  }

  logout() {
    return this.http.patch<any>(this.baseUrl + 'admin/logoutUser', {});
  }

  startTokenRefreshCheck() {
    this.refreshSubscription = interval(60000).subscribe(() => {
      const expiresAt = localStorage.getItem('expiresAt');
      if (expiresAt) {
        const expiryTime = new Date(expiresAt).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = expiryTime - currentTime;
        const threshold = 300000;
        if (timeDifference < threshold) {
          this.getRefreshToken();
        }
      }
    });
  }

  stopTokenRefreshCheck(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
