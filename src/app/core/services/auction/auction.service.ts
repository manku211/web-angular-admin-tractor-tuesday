import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  baseUrl = 'https://api-dev.tractortuesday.xyz/api/v1/';
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

  getVehicleDetailsByAuctionId(id: string) {
    return this.http.get<any>(this.baseUrl + `auctions/get-auction/${id}`);
  }

  updateAuction(id: any, payload: any) {
    return this.http.patch<any>(
      this.baseUrl + `auctions/update-auction/${id}`,
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
}
