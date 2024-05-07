import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from '../../../core/services/message/message.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [true],
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const isToken = localStorage.getItem('token');
    if (isToken) {
      this.router.navigate(['/dashboard']);
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      let payload = {
        email: this.validateForm.controls.userName.value,
        password: this.validateForm.controls.password.value,
      };
      this.authService.adminLogin(payload).subscribe({
        next: (data: any) => {
          console.log(data);
          if (data) {
            localStorage.setItem(
              'token',
              data?.data?.accessToken ? data?.data?.accessToken : ''
            );
            localStorage.setItem(
              'refresh_token',
              data?.data?.refreshToken ? data?.data?.refreshToken : ''
            );
            localStorage.setItem(
              'expiresAt',
              data?.data?.accessTokenExpiresAt
                ? data?.data?.accessTokenExpiresAt
                : ''
            );
            this.authService.startTokenRefreshCheck();
            this.messageService.success('Login Successful!');
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('An error occurred during admin login:', error);
          this.messageService.error(error?.error?.message);
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
