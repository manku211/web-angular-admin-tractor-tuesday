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
import { MessageService } from '../../../core/services/message/message.service';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.startTimer();
  }

  // Remove this later
  ngAfterViewInit(): void {
    const storedOTP = localStorage.getItem('otp');
    this.isOtpFilled = Array(this.otpInputs.length).fill(false);
    if (storedOTP) {
      this.otpValue = storedOTP;
      this.populateOtpInputs(storedOTP);
    }
  }

  populateOtpInputs(otp: string): void {
    const otpLength = Math.min(otp.length, this.isOtpFilled.length);
    for (let i = 0; i < otpLength; i++) {
      const input = this.otpInputs.toArray()[i]
        .nativeElement as HTMLInputElement;
      input.value = otp[i];
      this.isOtpFilled[i] = true;
    }
  }

  startTimer(): void {
    this.timer = 60;
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
    let payload = {
      otp: this.otpValue,
      hash: localStorage.getItem('otp_token'),
    };
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
      },
    });
  }

  onResendOtp(): void {
    this.resendDisabled = false;
    this.startTimer();
    let payload = {
      phoneNumber: String(localStorage.getItem('phoneNumber')),
    };
    this.authService.verifyViaPhone(payload).subscribe({
      next: (data) => {
        if (data?.data) {
          this.messageService.success('Otp sent successfully!');
          localStorage.setItem('otp_token', data?.data?.otpToken);
          localStorage.setItem('otp', data?.data?.otp); // Remove once aws subscription is taken for sns services.
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
      },
    });
  }
}
