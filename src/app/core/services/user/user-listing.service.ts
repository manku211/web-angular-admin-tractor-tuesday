import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserListingService {
  baseUrl = 'https://api-dev.tractortuesday.xyz/api/v1/';
  constructor(private http: HttpClient) {}

  getAllUsers(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(this.baseUrl + 'admin/get-all-users', {
      params: queryParams,
    });
  }

  getUserDetailsById(id: string) {
    return this.http.get<any>(this.baseUrl + `admin/get-user-by-id/${id}`);
  }
}
