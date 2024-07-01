import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  baseUrl = environment.API_URL + '/api/v1/';
  constructor(private http: HttpClient) {}

  getAuctionDetailsBySellerId(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(
      this.baseUrl + `auctions/get-all-auctions-by-sellerId`,
      {
        params: queryParams,
      }
    );
  }

  getAuctionDetailsByUserId(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(
      this.baseUrl + `auctions/get-all-participated-auction-by-userId`,
      {
        params: queryParams,
      }
    );
  }

  getAuctionById(id: string) {
    return this.http.get<any>(this.baseUrl + `auctions/get-auction/${id}`);
  }

  updateAuction(id: any, payload: any) {
    return this.http.patch<any>(
      this.baseUrl + `admin/update-auction-admin/${id}`,
      payload
    );
  }

  getAllAuctions(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(this.baseUrl + `auctions/get-all-auctions`, {
      params: queryParams,
    });
  }

  getPendingRequests(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(
      this.baseUrl + `auctions/get-auction-for-approval`,
      {
        params: queryParams,
      }
    );
  }

  updateVehicleInfo(id: any, payload: any) {
    return this.http.patch<any>(
      this.baseUrl + `admin/update-tractor-admin/${id}`,
      payload
    );
  }
}
