import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PhotographService {
  baseUrl = environment.API_URL + '/api/v1/';
  constructor(private http: HttpClient) {}

  getPhotoshootRequest(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(
      this.baseUrl + `photographer/get-all-photoshoot-requests`,
      {
        params: queryParams,
      }
    );
  }

  getAllPhotographers(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(
      this.baseUrl + `photographer/get-all-photographers`,
      {
        params: queryParams,
      }
    );
  }

  getPhotoshootRequestById(id: string, params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(
      this.baseUrl + `photographer/get-photoshoot-request/${id}`,
      {
        params: queryParams,
      }
    );
  }

  getPhotograherById(id: string) {
    return this.http.get<any>(
      this.baseUrl + `photographer/get-photographer/${id}`
    );
  }

  updatePhotoshootRequest(id: string, payload: any) {
    return this.http.patch<any>(
      this.baseUrl + `admin/update-photoshoot-request/${id}`,
      payload
    );
  }

  updatePhotographerByAdmin(id: string, payload: any) {
    return this.http.patch<any>(
      this.baseUrl + `photographer/update-photographer-admin/${id}`,
      payload
    );
  }
}
