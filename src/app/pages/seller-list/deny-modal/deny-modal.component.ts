import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deny-modal',
  standalone: true,
  imports: [ModalComponent, SharedModule, FormsModule],
  templateUrl: './deny-modal.component.html',
  styleUrl: './deny-modal.component.css',
})
export class DenyModalComponent {
  selectedReason!: string;
  otherReason!: string;
  shouldDisableButton: boolean = false;
  @Output() handleClose: EventEmitter<any> = new EventEmitter();
  // @Input() userInfo: any;
  reasons = [
    'Inaccurate Information about the  vehicle',
    'Documentation Insufficiency about the vehicle',
    'Verification Failure about the vehicle',
    'Discrepancies in Description  about the vehicle',
    'Failure to Meet Criteria about the vehicle',
    'Unverified Claims about the vehicle',
    'VIN Number not correct',
  ];

  handleCancel() {
    this.handleClose.emit();
  }
  handleUserAccount() {}
}
