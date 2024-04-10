import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-otp-verify',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './otp-verify.component.html',
  styleUrl: './otp-verify.component.css',
})
export class OtpVerifyComponent {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  isOtpFilled: boolean[] = [false, false, false, false, false, false];
  otpValue: string = '';
  resendDisabled: boolean = false;
  timer: number = 60;
  timerSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.startTimer();
  }

  startTimer(): void {
    this.timer = 10;
    this.timerSubscription = interval(1000).subscribe(() => {
      this.timer--;
      if (this.timer === 0) {
        this.resendDisabled = true;
        this.timerSubscription?.unsubscribe();
      }
    });
  }

  onOtpInput(event: any, index: number): void {
    const inputElement = event.target as HTMLInputElement;
    this.isOtpFilled[index] = inputElement.value.length === 1;
    this.otpValue = this.isOtpFilled.every((filled) => filled)
      ? this.getOtpValue()
      : '';
    if (inputElement.value.length === 1 && index < this.otpInputs.length - 1) {
      const nextInput = this.otpInputs.toArray()[index + 1];
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (
      (event.key === 'Backspace' || event.key === 'Delete') &&
      index > 0 &&
      (event.target as HTMLInputElement).value.length === 0
    ) {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  isVerifyButtonDisabled(): boolean {
    return this.isOtpFilled.some((filled) => !filled);
  }

  private getOtpValue(): string {
    return this.otpInputs
      .toArray()
      .map((input) => input.nativeElement.value)
      .join('');
  }

  onSubmit(): void {
    console.log('Entered OTP:', this.otpValue);
    let payload = {
      otp: this.otpValue,
      hash: localStorage.getItem('otp_token'),
    };
    this.authService.otpVerify(payload).subscribe({
      next: (data) => {
        console.log(data);
        if (data?.data) {
          this.router.navigate(['/reset-password']);
          localStorage.setItem(
            'resetpassword_token',
            data?.data?.passwordChangeToken
          );
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
      },
    });
  }

  onResendOtp(): void {
    this.resendDisabled = false;
    this.startTimer();
  }
}
