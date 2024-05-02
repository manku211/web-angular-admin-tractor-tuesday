import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ContentManagementService } from '../../../core/services/content-management/content-management.service';
import { SharedModule } from '../../../shared/shared.module';
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [QuillModule, FormsModule, SharedModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.css',
})
export class PrivacyPolicyComponent {
  @Input() selectedMenuItem: any = 'privacy';
  privacyPolicy: string = '';
  termsAndCond: string = '';
  constructor(private contentService: ContentManagementService) {
    console.log('selectedMenuItem', this.selectedMenuItem);
  }

  ngOnInit() {
    this.fetchTerms();
  }

  fetchTerms() {
    this.contentService.getPolicyandTerms().subscribe({
      next: (data) => {
        console.log(data);
        this.privacyPolicy = data?.data?.privacyPolicy;
        this.termsAndCond = data?.data?.termsAndConditions;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  sendData() {
    console.log('HTML Content:', this.privacyPolicy);
    const payload = {
      privacyPolicy: this.privacyPolicy,
      termsAndConditions: this.termsAndCond,
    };
    this.contentService.updatePolicyandTerms(payload).subscribe({
      next: (data) => {
        console.log(data);
        this.fetchTerms();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
