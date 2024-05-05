import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContentManagementService {
  baseUrl = 'https://api-dev.tractortuesday.xyz/api/v1/';
  constructor(private http: HttpClient) {}

  getFaqById(id: string) {
    return this.http.get<any>(
      this.baseUrl + `content-mananagement/get-faq/${id}`
    );
  }

  getAllFaqs(params: any) {
    return this.http.get<any>(
      this.baseUrl + `content-mananagement/get-all-faqs`
    );
  }

  createFaq(payload: any) {
    return this.http.post<any>(
      this.baseUrl + `content-mananagement/create-faq`,
      payload
    );
  }

  updateFaq(id: string, payload: any) {
    return this.http.patch<any>(
      this.baseUrl + `content-mananagement/update-faq/${id}`,
      payload
    );
  }

  deleteFaq(id: string) {
    return this.http.delete<any>(
      this.baseUrl + `content-mananagement/delete-faq/${id}`
    );
  }

  getPolicyandTerms() {
    return this.http.get<any>(this.baseUrl + `content-mananagement/get-tc-pp`);
  }

  updatePolicyandTerms(payload: any) {
    return this.http.patch<any>(
      this.baseUrl + `content-mananagement/update-terms`,
      payload
    );
  }

  getAllPlatformSettings() {
    return this.http.get<any>(this.baseUrl + `admin/get-all-platform-settings`);
  }

  updatePlatformSettings(payload: any) {
    return this.http.patch<any>(
      this.baseUrl + `admin/update-platform-settings`,
      payload
    );
  }
}
