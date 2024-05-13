import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ContentManagementService } from '../../core/services/content-management/content-management.service';
import { MessageService } from '../../core/services/message/message.service';

@Component({
  selector: 'app-platform-management',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './platform-management.component.html',
  styleUrl: './platform-management.component.css',
})
export class PlatformManagementComponent {
  platformFeesSeller: any;
  platformFeesBuyer: any;
  maxFees: any;
  minFees: any;
  referralUsageCount: any;
  referralUsedCount: any;
  sellerDiscount: any;
  buyerDiscount: any;
  isReferralEnabled: any;
  platformFeesModified: boolean = false;
  capModified: boolean = false;
  referralFeesModified: boolean = false;
  referralUsageModified: boolean = false;
  referralEnableModified: boolean = false;

  platformFeesChanged: boolean = true;
  capChanged: boolean = true;
  referralFeesChanged: boolean = true;
  referralUsageChanged: boolean = true;

  constructor(
    private platformService: ContentManagementService,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.fetchPlatformSettings();
  }
  fetchPlatformSettings() {
    this.platformService.getAllPlatformSettings().subscribe({
      next: (data) => {
        console.log(data);
        const settings = data?.data;
        this.platformFeesSeller = settings.find(
          (item: any) => item.key === 'platformFeesSeller'
        )?.setting;
        this.platformFeesBuyer = settings.find(
          (item: any) => item.key === 'platformFeesBuyer'
        )?.setting;
        this.referralUsageCount = settings.find(
          (item: any) => item.key === 'referralUsageCount'
        )?.setting;
        this.referralUsedCount = settings.find(
          (item: any) => item.key === 'referralUsedCount'
        )?.setting;
        this.sellerDiscount = settings.find(
          (item: any) => item.key === 'sellerDiscount'
        )?.setting;
        this.buyerDiscount = settings.find(
          (item: any) => item.key === 'buyerDiscount'
        )?.setting;
        this.minFees = settings.find(
          (item: any) => item.key === 'minFees'
        )?.setting;
        this.maxFees = settings.find(
          (item: any) => item.key === 'maxFees'
        )?.setting;
        this.isReferralEnabled =
          settings.find((item: any) => item.key === 'isReferralEnabled')
            ?.setting == 1
            ? true
            : false;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  updatePlatformSettings(payload: any) {
    this.platformService.updatePlatformSettings(payload).subscribe({
      next: (data) => {
        console.log(data);
        if (data?.success) {
          this.messageService.success('Updated Successfully');
          this.fetchPlatformSettings();
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  handlePlatformFees() {
    let payload = {
      platformFeesSeller: String(this.platformFeesSeller),
      platformFeesBuyer: String(this.platformFeesBuyer),
    };
    this.updatePlatformSettings(payload);
    this.platformFeesModified = true;
  }

  handleCap() {
    let payload = {
      minFees: String(this.minFees),
      maxFees: String(this.maxFees),
    };
    this.updatePlatformSettings(payload);
  }

  handleReferralFees() {
    let payload = {
      buyersReward: String(this.buyerDiscount),
      sellersReward: String(this.sellerDiscount),
    };
    this.updatePlatformSettings(payload);
  }

  handleReferralUsage() {
    let payload = {
      referralUsedCount: String(this.referralUsedCount),
      referralUsageCount: String(this.referralUsageCount),
    };
    this.updatePlatformSettings(payload);
  }

  handleRefferalEnable(event: Event) {
    console.log(event);
    this.referralFeesChanged = false;
    let payload = {
      isReferralEnabled: event ? '1' : '0',
    };
    this.updatePlatformSettings(payload);
  }

  handlePlatformInputChange() {
    console.log('tested');
    this.platformFeesChanged = false;
  }

  handleCapInputChange() {
    console.log('tested cap');
    this.capChanged = false;
  }

  handleReferralFeeInputChange() {
    this.referralFeesChanged = false;
  }

  handleReferralUsageInputChange() {
    this.referralUsageChanged = false;
  }
  // Method to reset the changed state when a button is clicked
}
