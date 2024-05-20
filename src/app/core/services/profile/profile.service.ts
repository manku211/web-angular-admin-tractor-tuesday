import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  baseUrl = 'https://api-dev.tractortuesday.xyz/api/v1/';
  private profileDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );
  constructor(private http: HttpClient) {}

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
    console.log(presignedURL, file);
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
