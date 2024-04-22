import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  baseUrl = 'https://api-dev.tractortuesday.xyz/api/v1/';
  constructor(private http: HttpClient) {}

  getAuctionDetailsById(id: string) {
    return this.http.get<any>(this.baseUrl + `admin/get-auction/${id}`);
  }
}
