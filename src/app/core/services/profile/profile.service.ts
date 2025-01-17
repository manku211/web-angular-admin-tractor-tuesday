import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  baseUrl = environment.API_URL + '/api/v1/';

  private adminDetailsSubject = new BehaviorSubject<any>(null);
  public adminDetails$ = this.adminDetailsSubject.asObservable();

  private profileDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  constructor(private http: HttpClient) {}

  fetchAdminDetails() {
    this.getAdmin().subscribe({
      next: (data) => {
        if (data?.data) {
          this.adminDetailsSubject.next(data.data);
        }
      },
      error: (error) => {
        console.error('Error fetching admin details:', error);
      },
    });
  }

  getAdmin() {
    return this.http.get<any>(this.baseUrl + `admin`);
  }

  updateProfileDetails(payload: any) {
    return this.http.patch<any>(
      this.baseUrl + `admin/update-profile-details`,
      payload
    );
  }

  getPresignedUrl(payload: any) {
    return this.http.post<any>(
      this.baseUrl + `file/generate-presigned-url`,
      payload
    );
  }

  uploadFile(presignedURL: any, file: any) {
    const headers = new HttpHeaders({
      'Content-Type': file.type,
    });

    return this.http.put(presignedURL, file, { headers, responseType: 'text' });
  }

  updateProfileData(data: any) {
    this.profileDataSubject.next(data);
  }

  getProfileData(): Observable<any> {
    return this.profileDataSubject.asObservable();
  }

  getAllAdmins() {
    return this.http.get<any>(this.baseUrl + `admin/get-all-admins`);
  }

  getAdminById(id: string) {
    return this.http.get<any>(this.baseUrl + `admin/get-admin-by-id/${id}`);
  }

  addAdmin(payload: any) {
    return this.http.post<any>(
      this.baseUrl + `admin/create-sub-admin`,
      payload
    );
  }

  updateAdmin(payload: any) {
    return this.http.patch<any>(
      this.baseUrl + `admin/update-subadmin-details`,
      payload
    );
  }

  removeAdmin(payload: any) {
    return this.http.patch<any>(
      this.baseUrl + `admin/remove-subadmin`,
      payload
    );
  }

  updatePrivilege(payload: any) {
    return this.http.patch<any>(
      this.baseUrl + `admin/add-or-edit-privileges-sub-admin`,
      payload
    );
  }
}
