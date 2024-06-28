import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContentManagementService } from '../../core/services/content-management/content-management.service';
import { MessageService } from '../../core/services/message/message.service';

@Component({
  selector: 'app-platform-management',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './platform-management.component.html',
  styleUrl: './platform-management.component.css',
})
export class PlatformManagementComponent {
  platformForm!: FormGroup;
  capForm!: FormGroup;
  referralForm!: FormGroup;
  usageForm!: FormGroup;
  isReserveEnabled: boolean = false;
  isReferralEnabled: boolean = false;

  constructor(
    private fb: FormBuilder,
    private platformService: ContentManagementService,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.initializeForms();
    this.fetchPlatformSettings();
  }

  initializeForms() {
    this.platformForm = this.fb.group({
      platformFeesSeller: [
        null,
        [Validators.required, Validators.min(0), Validators.max(1000)],
      ],
      platformFeesBuyer: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });

    this.capForm = this.fb.group({
      maxFees: [
        null,
        [Validators.required, Validators.min(0), Validators.max(2000)],
      ],
      minFees: [
        null,
        [Validators.required, Validators.min(0), Validators.max(1000)],
      ],
    });

    this.referralForm = this.fb.group({
      sellerDiscount: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      buyerDiscount: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });

    this.usageForm = this.fb.group({
      referralUsageCount: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      referralUsedCount: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
  }

  fetchPlatformSettings() {
    this.platformService.getAllPlatformSettings().subscribe({
      next: (data) => {
        const settings = data?.data;
        this.platformForm.patchValue({
          platformFeesSeller: String(
            settings.find((item: any) => item.key === 'platformFeesSeller')
              ?.setting
          ),
          platformFeesBuyer: String(
            settings.find((item: any) => item.key === 'platformFeesBuyer')
              ?.setting
          ),
        });

        this.capForm.patchValue({
          maxFees: String(
            settings.find((item: any) => item.key === 'maxFees')?.setting
          ),
          minFees: String(
            settings.find((item: any) => item.key === 'minFees')?.setting
          ),
        });

        this.referralForm.patchValue({
          sellerDiscount: String(
            settings.find((item: any) => item.key === 'sellerDiscount')?.setting
          ),
          buyerDiscount: String(
            settings.find((item: any) => item.key === 'buyerDiscount')?.setting
          ),
        });

        this.usageForm.patchValue({
          referralUsageCount: String(
            settings.find((item: any) => item.key === 'referralUsageCount')
              ?.setting
          ),
          referralUsedCount: String(
            settings.find((item: any) => item.key === 'referralUsedCount')
              ?.setting
          ),
        });

        this.isReferralEnabled =
          settings.find((item: any) => item.key === 'isReferralEnabled')
            ?.setting == 1
            ? true
            : false;
        this.isReserveEnabled =
          settings.find((item: any) => item.key === 'isReserveEnabled')
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
    const stringPayload = Object.keys(payload).reduce((acc, key) => {
      acc[key] = String(payload[key]);
      return acc;
    }, {} as any);
    this.platformService.updatePlatformSettings(stringPayload).subscribe({
      next: (data) => {
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
    if (this.platformForm.valid) {
      this.updatePlatformSettings(this.platformForm.value);
    }
  }

  handleCap() {
    if (this.capForm.valid) {
      this.updatePlatformSettings(this.capForm.value);
    }
  }

  handleReferralFees() {
    if (this.referralForm.valid) {
      // let payload = {
      //   sellersReward: this.referralForm?.value?.sellerDiscount,
      //   buyersReward: this.referralForm?.value?.buyerDiscount,
      // };
      this.updatePlatformSettings(this.referralForm.value);
    }
  }

  handleReferralUsage() {
    if (this.usageForm.valid) {
      this.updatePlatformSettings(this.usageForm.value);
    }
  }

  handleRefferalEnable(event: boolean) {
    this.updatePlatformSettings({ isReferralEnabled: event ? '1' : '-1' });
  }
  handleReserveStatus(event: boolean) {
    this.updatePlatformSettings({ isReserveEnabled: event ? '1' : '-1' });
  }
}
