import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PhotographService {
  baseUrl = 'https://api-dev.tractortuesday.xyz/api/v1/';
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

  getPhotoshootRequestById(id: string, params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(
      this.baseUrl + `photographer/get-all-photoshoot-request/${id}`,
      {
        params: queryParams,
      }
    );
  }
}
