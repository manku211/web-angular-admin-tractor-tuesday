import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ContentManagementService } from '../../../core/services/content-management/content-management.service';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService } from '../../../core/services/message/message.service';
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
  contentData?: any;
  constructor(
    private contentService: ContentManagementService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.fetchTerms();
  }

  fetchTerms() {
    this.contentService.getPolicyandTerms().subscribe({
      next: (data) => {
        this.contentData = data?.data;
        this.privacyPolicy = data?.data?.privacyPolicy;
        this.termsAndCond = data?.data?.termsAndConditions;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  checkForChanges(): boolean {
    return (
      this.privacyPolicy !== this.contentData?.privacyPolicy ||
      this.termsAndCond !== this.contentData?.termsAndConditions
    );
  }

  sendData() {
    const payload = {
      privacyPolicy: this.privacyPolicy,
      termsAndConditions: this.termsAndCond,
    };
    this.contentService.updatePolicyandTerms(payload).subscribe({
      next: (data) => {
        this.messageService.success('Content Updated Successfully');
        this.fetchTerms();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
