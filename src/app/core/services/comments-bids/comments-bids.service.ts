import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentsBidsService {
  baseUrl = environment.API_URL + '/api/v1/';
  constructor(private http: HttpClient) {}

  getCommentsByTractorID(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(this.baseUrl + `comment`, {
      params: queryParams,
    });
  }

  getRepliesForComment(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(this.baseUrl + `comment/replies`, {
      params: queryParams,
    });
  }

  getBidsById(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(this.baseUrl + `bids/get-all-bids`, {
      params: queryParams,
    });
  }

  getCommentsAndBidsByTractorId(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(this.baseUrl + `admin/get-comments-and-bids`, {
      params: queryParams,
    });
  }

  getCommentEditorData(params: any) {
    let queryParams = new HttpParams();
    Object.keys(params).forEach((key) => {
      queryParams = queryParams.set(key, params[key]);
    });
    return this.http.get<any>(this.baseUrl + `comment/comment-editor`, {
      params: queryParams,
    });
  }

  updateComment(params: any) {
    return this.http.patch<any>(this.baseUrl + `comment/edit-comment`, params);
  }

  deleteComment(params: any) {
    return this.http.delete<any>(this.baseUrl + `comment`, params);
  }
}
