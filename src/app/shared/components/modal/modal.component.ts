import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() showModal: boolean = false;
  @Output() handleCancelModal: EventEmitter<any> = new EventEmitter();
  handleCancel() {
    this.handleCancelModal.emit();
  }
}
