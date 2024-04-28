import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-approve-modal',
  standalone: true,
  imports: [SharedModule, ModalComponent],
  templateUrl: './approve-modal.component.html',
  styleUrl: './approve-modal.component.css',
})
export class ApproveModalComponent {
  @Input() tractorData: any;
  @Output() handleClose: EventEmitter<any> = new EventEmitter();
  exteriorImageUrl: string | null = null;
  ngOnInit() {
    console.log('tractor', this.tractorData);
    this.getExteriorImageUrl();
  }

  getExteriorImageUrl(): void {
    if (this.tractorData && this.tractorData?.tractorId?.images) {
      const exteriorImage = this.tractorData.tractorId.images.find(
        (image: any) => image.type === 'exterior'
      );
      console.log(exteriorImage);
      if (exteriorImage) {
        this.exteriorImageUrl = exteriorImage.link;
      }
    }
  }

  handleCancel() {
    this.handleClose.emit();
  }

  handleUserAccount() {}
}
