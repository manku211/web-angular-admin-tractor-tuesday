import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  baseUrl = 'https://api-dev.tractortuesday.xyz/api/v1/';
  constructor(private http: HttpClient) {}

  getAuctionDetailsById(params: any) {
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
}
