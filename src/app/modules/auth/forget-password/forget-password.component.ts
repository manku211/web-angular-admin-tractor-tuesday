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
  validateForm: FormGroup<{
    email: FormControl<string>;
    phone: FormControl<string>;
  }> = this.fb.group(
    {
      email: ['', Validators.email],
      phone: ['', Validators.pattern(/^\d{10}$/)],
    },
    { validators: atLeastOneRequiredValidator }
  );
  updatingDisabledState: boolean = false;
  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.validateForm.get('email')?.valueChanges.subscribe(() => {
      if (!this.updatingDisabledState) {
        this.updatePhoneDisabledState();
      }
    });

    this.validateForm.get('phone')?.valueChanges.subscribe(() => {
      if (!this.updatingDisabledState) {
        this.updateEmailDisabledState();
      }
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      let payload;
      if (this.validateForm.controls.email.value != '') {
        payload = {
          email: this.validateForm.controls.email.value,
        };
        this.authService.verifyViaEmail(payload).subscribe({
          next: (data) => {
            console.log(data);
          },
          error: (error) => {
            console.error('An error occurred during admin login:', error);
          },
        });
      } else if (this.validateForm.controls.phone.value != '') {
        payload = {
          phoneNumber: this.validateForm.controls.phone.value,
        };
        localStorage.setItem(
          'phoneNumber',
          this.validateForm.controls.phone.value
        );
        this.authService.verifyViaPhone(payload).subscribe({
          next: (data) => {
            console.log(data);
            if (data?.data) {
              this.router.navigate(['/otp-verification']);
              localStorage.setItem('otp_token', data?.data?.otpToken);
              localStorage.setItem('otp', data?.data?.otp); // Remove once aws subscription is taken for sns services.
            }
          },
          error: (error) => {
            console.error('An error occurred during admin login:', error);
          },
        });
      }
      console.log(payload);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updatePhoneDisabledState(): void {
    this.updatingDisabledState = true;
    const emailControl = this.validateForm.get('email');
    const phoneControl = this.validateForm.get('phone');

    if (emailControl && emailControl.value !== '') {
      phoneControl?.disable();
    } else {
      phoneControl?.enable();
    }
    this.updatingDisabledState = false;
  }

  updateEmailDisabledState(): void {
    this.updatingDisabledState = true;
    const emailControl = this.validateForm.get('email');
    const phoneControl = this.validateForm.get('phone');

    if (phoneControl && phoneControl.value !== '') {
      emailControl?.disable();
    } else {
      emailControl?.enable();
    }
    this.updatingDisabledState = false;
  }
}
