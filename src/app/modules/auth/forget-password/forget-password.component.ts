import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MessageService } from '../../../core/services/message/message.service';

const atLeastOneRequiredValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const email = control.get('email')!.value;
  const phone = control.get('phone')!.value;

  if (!email && !phone) {
    return { atLeastOneRequired: true };
  }

  return null;
};

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  showPhoneNumber: boolean = false;
  updateByText: string = 'Phone Number';

  otpHash!: string;
  validateForm: FormGroup<{
    email: FormControl<string>;
    phone: FormControl<string>;
    otp: FormControl<string>;
  }> = this.fb.group(
    {
      email: ['', Validators.email],
      phone: ['', Validators.pattern(/^\d{10}$/)],
      otp: ['', Validators.pattern(/^\d{4,}$/)],
    },
    { validators: atLeastOneRequiredValidator }
  );
  updatingDisabledState: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log(this.validateForm.value);
      let payload;
      if (this.validateForm.controls.email.value != '') {
        payload = {
          email: this.validateForm.controls.email.value,
        };
        this.authService.verifyViaEmail(payload).subscribe({
          next: (data) => {
            this.messageService.success('Email sent successfully!');
          },
          error: (error) => {
            console.error('An error occurred during admin login:', error);
            this.messageService.error(error?.error?.message);
          },
        });
      } else if (this.validateForm.controls.phone.value != '') {
        payload = {
          otp: this.validateForm?.value.otp,
          hash: this.otpHash,
        };
        console.log(payload);
        this.authService.otpVerify(payload).subscribe({
          next: (data) => {
            if (data?.data) {
              this.messageService.success('Otp verified successfully!');
              this.router.navigate(['/reset-password']);
              localStorage.setItem(
                'resetpassword_token',
                data?.data?.passwordChangeToken
              );
            }
          },
          error: (error) => {
            console.error('An error occurred during admin login:', error);
            this.messageService.error(error?.error?.message);
          },
        });
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  getOtp() {
    if (this.validateForm.controls.phone.value != '') {
      const payload = {
        phoneNumber: this.validateForm.controls.phone.value,
      };
      localStorage.setItem(
        'phoneNumber',
        this.validateForm.controls.phone.value
      );
      this.authService.verifyViaPhone(payload).subscribe({
        next: (data) => {
          if (data?.data) {
            this.otpHash = data?.data?.otpToken;
            this.messageService.success('Otp sent successfully!');

            // this.otp = data?.data?.otp;
            // localStorage.setItem('otp_token', data?.data?.otpToken);
            // localStorage.setItem('otp', data?.data?.otp);
          }
        },
        error: (error) => {
          console.error('An error occurred during admin login:', error);
          this.messageService.error(error?.error?.message);
        },
      });
    }
  }

  handleFormFields() {
    this.showPhoneNumber = !this.showPhoneNumber;
    if (this.showPhoneNumber) {
      this.updateByText = 'Email ID';
    } else {
      this.updateByText = 'Phone Number';
    }
  }

  isSubmitDisabled(): boolean {
    const emailControl = this.validateForm.get('email');
    const phoneControl = this.validateForm.get('phone');
    const otpControl = this.validateForm.get('otp');

    // If adding by email, enable submit after entering email
    if (emailControl && emailControl.value !== '') {
      return !emailControl.valid;
    }

    // If adding by phone number, enable submit after entering phone number and OTP
    if (
      phoneControl &&
      phoneControl.value !== '' &&
      otpControl &&
      otpControl.value !== ''
    ) {
      return !phoneControl.valid || !otpControl.valid;
    }

    // In all other cases, disable submit
    return true;
  }
}
