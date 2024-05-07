import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  baseUrl = 'https://api-dev.tractortuesday.xyz/api/v1/';
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
}
