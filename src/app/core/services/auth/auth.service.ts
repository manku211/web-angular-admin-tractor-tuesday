import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'https://api-dev.tractortuesday.xyz/api/v1/';

  constructor(private http: HttpClient) {
    // console.log(environment.API_URL);
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
}
