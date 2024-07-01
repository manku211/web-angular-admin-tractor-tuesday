import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  baseUrl = environment.API_URL + '/api/v1/';
  constructor(private http: HttpClient) {}

  getLocationGraph(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(this.baseUrl + `analytics/location-graph`, {
      params: queryParams,
    });
  }

  getSalesGraph(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(this.baseUrl + `analytics/sales-report`, {
      params: queryParams,
    });
  }

  getAuctionGraph(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(this.baseUrl + `analytics/auction-report`, {
      params: queryParams,
    });
  }

  getDashboardStats() {
    return this.http.get<any>(
      this.baseUrl + `analytics/get-total-revenue-generated`
    );
  }

  getCategoryAnalytics() {
    return this.http.get<any>(this.baseUrl + `analytics/top-selling-category`);
  }
}
