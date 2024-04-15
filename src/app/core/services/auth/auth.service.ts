import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
// import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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

  getRefreshToken() {
    const refresh_token = localStorage.getItem('refresh_token');
    const options = {
      headers: new HttpHeaders({ Authorization: `Bearer ${refresh_token}` }),
    };
    this.http
      .patch<any>(this.baseUrl + 'admin/generateAccessTokenUser', {}, options)
      .subscribe((res: any) => {
        if (res) {
          console.log('Refresh token', res);
          localStorage.setItem('token', res?.data?.accessToken);
          localStorage.setItem('refresh_token', res?.data?.refreshToken);
        } else {
          this.router.navigate(['/']);
        }
      });
  }
}
