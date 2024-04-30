import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { AuctionService } from '../../../core/services/auction/auction.service';
import { getExteriorImageUrl } from '../../../utilities/helpers/helper';

@Component({
  selector: 'app-approve-modal',
  standalone: true,
  imports: [SharedModule, ModalComponent, FormsModule],
  templateUrl: './approve-modal.component.html',
  styleUrl: './approve-modal.component.css',
})
export class ApproveModalComponent {
  @Input() tractorData: any;
  @Output() handleClose: EventEmitter<any> = new EventEmitter();
  exteriorImageUrl: string | null = null;
  date: Date | null = null;
  start_time: Date | null = null;
  end_time: Date | null = null;

  constructor(private auctionService: AuctionService) {}

  ngOnInit() {
    console.log('tractor', this.tractorData);
    this.exteriorImageUrl = getExteriorImageUrl(this.tractorData);
    this.populateDateTime();
  }

  // getExteriorImageUrl(): void {
  //   if (this.tractorData && this.tractorData?.tractorId?.images) {
  //     const exteriorImage = this.tractorData.tractorId.images.find(
  //       (image: any) => image.type === 'exterior'
  //     );
  //     console.log(exteriorImage);
  //     if (exteriorImage) {
  //       this.exteriorImageUrl = exteriorImage.link;
  //     }
  //   }
  // }

  populateDateTime(): void {
    if (this.tractorData) {
      this.date = new Date(this.tractorData.proposedStartTime * 1000);
      this.start_time = new Date(this.tractorData.proposedStartTime * 1000);
      this.end_time = new Date(this.tractorData.proposedEndTime * 1000);
    }
  }

  onChange(result: Event): void {
    console.log('onChange: ', result);
  }

  start_time_log(time: Date): void {
    console.log(time && time.toTimeString());
  }

  end_time_log(time: Date): void {
    console.log(time && time.toTimeString());
  }
  handleCancel() {
    this.handleClose.emit();
  }

  handleUserAccount() {
    const startTimeStamp = this.combineDateTime(this.date, this.start_time);
    const endTimeStamp = this.combineDateTime(this.date, this.end_time);

    console.log(startTimeStamp, endTimeStamp);
    const payload = {
      startTime: startTimeStamp,
      endTime: endTimeStamp,
      auctionStatus: 'PENDING',
      // title: 'Auction Title',
      // subtitle: 'Auction SubTitle',
      tractorId: this.tractorData?.tractorId?._id,
      isApprovedByAdmin: true,
      // denialReason: 'Inaccurate Information about the vehicle',
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

  combineDateTime(date: Date | null, time: Date | null): number | null {
    if (date && time) {
      const combinedDateTime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
      );
      return combinedDateTime.getTime() / 1000; // Convert to Unix timestamp
    }
    return null;
  }
}
