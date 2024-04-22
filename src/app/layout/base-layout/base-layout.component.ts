import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.css',
})
export class BaseLayoutComponent {
  isCollapsed = false;
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  handleUserList() {
    this.router.navigate(['dashboard/user-listing']);
  }

  handleSellerList() {
    this.router.navigate(['dashboard/seller-listing']);
  }

  logout() {
    console.log('logout');
    this.authService.logout().subscribe({
      next: (data) => {
        console.log(data);
        if (data) {
          localStorage.clear();
          this.authService.stopTokenRefreshCheck();
          this.messageService.success('Logged out!');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
        this.messageService.error(error);
      },
    });
  }
}
