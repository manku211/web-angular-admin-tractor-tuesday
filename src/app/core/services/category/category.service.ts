import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  baseUrl = environment.API_URL + '/api/v1/';
  constructor(private http: HttpClient) {}

  getCategory(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(this.baseUrl + `analytics/category-listing`, {
      params: queryParams,
    });
  }

  getCategoryList() {
    return this.http.get<any>(this.baseUrl + `analytics/list-all-categories`);
  }
}
