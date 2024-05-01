import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { FaqComponent } from './faq/faq.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsCondComponent } from './terms-cond/terms-cond.component';

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [
    SharedModule,
    FormsModule,
    FaqComponent,
    PrivacyPolicyComponent,
    TermsCondComponent,
  ],
  templateUrl: './content-management.component.html',
  styleUrl: './content-management.component.css',
})
export class ContentManagementComponent {
  selectedMenuItem: string = 'faq';

  selectMenuItem(menuItem: string) {
    this.selectedMenuItem = menuItem;
  }
}
