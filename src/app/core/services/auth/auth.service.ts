import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, interval, of } from 'rxjs';
import { Privileges, Roles } from '../../models/rolePrivileges';
// import { environment } from '../../../../environments/environment';

interface Privilege {
  name: string;
  read: boolean;
  write: boolean;
  _id: string;
}

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

  userPrivileges: any[] = []; // Populate this array with user privileges after login

  // hasReadAccess(privilege: Privileges): boolean {
  //   if (!this.admin) {
  //     return false;
  //   }
  //   if (this.isSuperAdmin()) {
  //     return true;
  //   } else {
  //     const userPrivileges = this.admin.privileges;
  //     const matchedPrivilege = userPrivileges.find(
  //       (p: any) => p.name === privilege
  //     );
  //     return matchedPrivilege ? matchedPrivilege.read : false;
  //   }
  // }

  // hasWriteAccess(privilege: Privileges): boolean {
  //   if (!this.admin) {
  //     return false; // Return false if admin data is not available
  //   }

  //   if (this.isSuperAdmin()) {
  //     return true;
  //   } else {
  //     const userPrivileges = this.admin.privileges;
  //     const matchedPrivilege = userPrivileges.find(
  //       (p: any) => p.name === privilege
  //     );
  //     return matchedPrivilege ? matchedPrivilege.write : false;
  //   }
  // }

  hasRequiredPrivilege(
    userPrivileges: any[],
    requiredPrivileges: Privileges[]
  ): boolean {
    const userPrivilegeNames = userPrivileges.map(
      (privilege) => privilege.name
    );
    return requiredPrivileges.every((requiredPrivilege) =>
      userPrivilegeNames.includes(requiredPrivilege)
    );
  }

  private privileges: Privilege[] = [];
  private role!: string;
  setPrivileges(privileges: Privilege[]): void {
    this.privileges = privileges;
  }

  setRole(role: string): void {
    this.role = role;
  }

  hasReadAccess(privilegeName: string): boolean {
    if (this.role === Roles.SUPER_ADMIN) {
      return true;
    }
    const privilege = this.privileges.find((p) => p.name === privilegeName);
    return privilege ? privilege.read : false;
  }

  hasWriteAccess(privilegeName: string): boolean {
    if (this.role === Roles.SUPER_ADMIN) {
      return true;
    }
    const privilege = this.privileges.find((p) => p.name === privilegeName);
    return privilege ? privilege.write : false;
  }
}
