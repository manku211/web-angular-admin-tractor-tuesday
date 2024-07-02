import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MessageService } from '../../../core/services/message/message.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group({
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
    localStorage.setItem('resetpassword_token_email', this.getUserToken());
  }

  getUserToken = () => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);

      const tokenVal = searchParams.get('token');

      return decodeURIComponent(String(tokenVal));
    }
    return '';
  };

  validateConfirmPassword(): void {
    setTimeout(() =>
      this.resetPasswordForm.controls[
        'confirmPassword'
      ].updateValueAndValidity()
    );
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

  submitForm(): void {
    if (this.resetPasswordForm.valid) {
      const password = this.resetPasswordForm.get('password')!.value;
      const resettoken_email = localStorage.getItem(
        'resetpassword_token_email'
      );
      if (resettoken_email != 'null') {
        let payload = {
          password: password,
          token: resettoken_email,
        };
        this.authService.resetPasswordEmail(payload).subscribe({
          next: (data) => {
            if (data?.data) {
              this.messageService.success('Password reset successfully!');
              this.router.navigate(['/']);
            }
          },
          error: (error) => {
            this.messageService.error(error?.error?.message);
            console.error(
              'An error occurred during resetting password:',
              error
            );
          },
        });
      } else {
        let payload = {
          password: password,
          token: localStorage.getItem('resetpassword_token'),
        };
        this.authService.resetPasswordPhone(payload).subscribe({
          next: (data) => {
            if (data?.data) {
              this.messageService.success('Password reset successfully!');
              this.router.navigate(['/']);
            }
          },
          error: (error) => {
            this.messageService.error(error?.error?.message);
            console.error(
              'An error occurred during resetting password:',
              error
            );
          },
        });
      }
    } else {
      Object.values(this.resetPasswordForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
