import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Directive({
  selector: '[appPrivilege]',
  standalone: true,
})
export class PrivilegeDirective {
  @Input('appPrivilege') privilegeName!: string;
  @Input('appPrivilegeAction') action!: 'read' | 'write';
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkPrivilege();
    console.log('check', this.checkPrivilege());
  }

  private checkPrivilege(): void {
    let hasAccess = false;

    if (this.action === 'write') {
      hasAccess = this.authService.hasWriteAccess(this.privilegeName);
    } else {
      hasAccess = this.authService.hasReadAccess(this.privilegeName);
    }
    if (!hasAccess) {
      this.renderer.addClass(this.el.nativeElement, 'disabled');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'disabled');
    }
  }
}
