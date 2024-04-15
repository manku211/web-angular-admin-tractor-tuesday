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
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      let payload = {
        email: this.validateForm.controls.userName.value,
        password: this.validateForm.controls.password.value,
      };
      this.authService.adminLogin(payload).subscribe({
        next: (data) => {
          console.log(data);
          if (data) {
            localStorage.setItem('token', data?.data?.accessToken);
            localStorage.setItem('refresh_token', data?.data?.refreshToken);
            this.messageService.success('Login Successful!');
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('An error occurred during admin login:', error);
          this.messageService.error(error);
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
