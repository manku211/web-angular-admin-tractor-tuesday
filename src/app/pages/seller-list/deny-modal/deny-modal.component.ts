import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AuctionService } from '../../../core/services/auction/auction.service';

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
  @Input() tractorData: any;
  reasons = [
    'Inaccurate Information about the  vehicle',
    'Documentation Insufficiency about the vehicle',
    'Verification Failure about the vehicle',
    'Discrepancies in Description  about the vehicle',
    'Failure to Meet Criteria about the vehicle',
    'Unverified Claims about the vehicle',
    'VIN Number not correct',
  ];
  constructor(private auctionService: AuctionService) {}
  handleCancel() {
    this.handleClose.emit();
  }
  handleUserAccount() {
    const payload = {
      // startTime: startTimeStamp,
      // endTime: endTimeStamp,
      auctionStatus: 'DENIED',
      // title: 'Auction Title',
      // subtitle: 'Auction SubTitle',
      tractorId: this.tractorData?.tractorId?._id,
      isApprovedByAdmin: false,
      denialReason: this.selectedReason
        ? this.selectedReason
        : this.otherReason,
    };
    console.log(payload);
    const auctionId = this.tractorData?._id;
    this.auctionService.updateAuction(auctionId, payload).subscribe({
      next: (data) => {
        console.log(data);
        this.handleClose.emit();
      },
      error: (err) => {
        this.handleClose.emit();
      },
    });
  }
}
