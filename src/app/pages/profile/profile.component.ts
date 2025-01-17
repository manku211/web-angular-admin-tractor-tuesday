import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { MessageService } from '../../core/services/message/message.service';
import { ProfileService } from '../../core/services/profile/profile.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  loading = false;
  avatarUrl: string | undefined;
  selectedFile: any;
  profileName!: string;
  resetPasswordForm: FormGroup;
  imageLoaded: boolean = false;
  pageLoad: boolean = true;
  profileDetailsUpdated: boolean = false;
  profileDetails: any;
  constructor(
    private msg: MessageService,
    private profileService: ProfileService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      oldPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/
          ),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/
          ),
        ],
      ],
      confirmPassword: ['', [this.confirmValidator]],
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.pageLoad = false;
    }, 100);
    this.profileService.getAdmin().subscribe({
      next: (data) => {
        this.profileDetails = data?.data;
        this.profileName = data?.data?.name;
        this.avatarUrl = data?.data?.profilePicture;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  confirmValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (
      control.value !== this.resetPasswordForm.controls['password'].value
    ) {
      return { confirm: true, error: true };
    }
    return {};
  };

  validateConfirmPassword(): void {
    setTimeout(() =>
      this.resetPasswordForm.controls[
        'confirmPassword'
      ].updateValueAndValidity()
    );
  }

  updateProfileDetails() {
    let payload = {
      fullName: this.profileName,
      profilePicture: this.avatarUrl,
      oldPassword: null,
      newPassword: null,
    };
    this.profileService.updateProfileDetails(payload).subscribe({
      next: (data) => {
        this.profileService.updateProfileData(payload);
        this.messageService.success('Profile updated successfully!');
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  submitForm(): void {
    if (this.resetPasswordForm.valid) {
      let payload = {
        oldPassword: this.resetPasswordForm.get('oldPassword')!.value,
        newPassword: this.resetPasswordForm.get('password')!.value,
      };
      this.profileService.updateProfileDetails(payload).subscribe({
        next: (data) => {
          if (data?.success) {
            this.messageService.success('Password changed successfully!');
            localStorage.clear();
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.messageService.error(error?.error?.message);
          console.error('An error occurred during resetting password:', error);
        },
      });
    } else {
      Object.values(this.resetPasswordForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onProfileNameInputChange() {
    if (
      this.profileDetails?.name === this.profileName ||
      this.profileName.length < 3 ||
      this.profileName.length > 50
    )
      this.profileDetailsUpdated = false;
    else {
      this.profileDetailsUpdated = true;
    }
  }

  handleCustomRequest = (item: NzUploadXHRArgs): Subscription => {
    this.imageLoaded = true;
    this.profileDetailsUpdated = true;
    const uploadData = {
      fileName: item.file.name,
      filePath: 'images',
      fileType: item.file.type,
    };
    return this.profileService.getPresignedUrl(uploadData).subscribe({
      next: (data) => {
        const { url } = data?.data;
        this.avatarUrl = data?.data?.key;

        this.uploadFile(item.file, url);
      },
      error: (error) => {
        console.error('Error getting pre-signed URL:', error);
        this.msg.error('Failed to get pre-signed URL for upload.');
      },
    });
  };

  private uploadFile(file: any, url: any): void {
    this.profileService.uploadFile(url, file).subscribe((data) => {
      this.imageLoaded = false;
      this.cdr.detectChanges();
    });
  }
}
