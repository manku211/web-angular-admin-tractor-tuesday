import { ChangeDetectorRef, Component } from '@angular/core';
import { AuctionService } from '../../core/services/auction/auction.service';
import { SharedModule } from '../../shared/shared.module';
import { CommentsBidsComponent } from '../comments-bids/comments-bids.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../core/services/profile/profile.service';
import { MessageService } from '../../core/services/message/message.service';

@Component({
  selector: 'app-vehicle-info',
  standalone: true,
  imports: [
    SharedModule,
    CommentsBidsComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './vehicle-info.component.html',
  styleUrl: './vehicle-info.component.css',
})
export class VehicleInfoComponent {
  auctionId!: any;
  vehicleInfo: any;
  timeLeft: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  isCarouselVisible = false;
  tractorImages: string[] = [];
  additionalInfo: any[] = [
    { label: 'Name Of The Vehicle', key: 'tractorId', subkey: 'name' },
    { label: 'VIN', key: 'tractorId', subkey: 'vin' },
    { label: 'Vehicle Number', key: 'tractorId', subkey: 'number' },
    { label: 'Model Number', key: 'tractorId', subkey: 'brand' },
    { label: 'Vehicle Year', key: 'tractorId', subkey: 'year' },
    { label: 'Brand Category', key: 'tractorId', subkey: 'category' },
    { label: 'Engine Power', key: 'tractorId', subkey: 'power' },
    { label: 'Seller Name', key: 'userId', subkey: 'username' },
    { label: 'Seller Type', key: 'sellerType', subkey: '' },
    { label: 'Vehicle Color', key: 'tractorId', subkey: 'name' },
    { label: 'Transmission', key: 'tractorId', subkey: 'transmissionType' },
    { label: 'Tyre Conditions', key: 'tractorId', subkey: 'condition' },
    { label: 'Used/Unused', key: 'tractorId', subkey: 'isUsed' },
    { label: 'Reserve', key: 'reservedPrice', subkey: '' },
    { label: 'Location', key: 'tractorId', subkey: 'location' },
    { label: 'Total Number of Hours', key: 'tractorId', subkey: 'totalHrs' },
  ];
  isEditMode: boolean = false;
  isFlawEditMode: boolean = false;
  flawsForm!: FormGroup;
  editIndex: number | null = null;
  flaws: any[] = [];
  imageLoaded: boolean = false;
  isModificationEditMode: boolean = false;
  modificationsForm!: FormGroup;
  isServiceLogEditMode: boolean = false;
  serviceLogsForm!: FormGroup;

  constructor(
    private auctionService: AuctionService,
    private router: Router,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private msg: MessageService,
    private cdr: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.auctionId = localStorage.getItem('selectedAuctionId');
    console.log('Auction ID:', this.auctionId);
    const state = history.state as { isEditMode?: boolean };
    console.log(state);
    if (state && typeof state.isEditMode === 'boolean') {
      this.isEditMode = state.isEditMode;
    }
    this.fetchVehicleDetails(this.auctionId);
  }

  fetchVehicleDetails(auctionId: string) {
    this.auctionService.getAuctionById(auctionId).subscribe({
      next: (data: any) => {
        console.log(data);
        if (data) {
          this.vehicleInfo = data?.data;
          this.tractorImages = data?.data?.tractorId?.images.map(
            (image: any) => image.link
          );
          this.additionalInfo = this.generateAdditionalInfo(this.vehicleInfo);
          this.flaws = data?.data?.tractorId?.flaws || [];
          this.createForm();
          this.calculateTimeLeft(this.vehicleInfo?.endTime);
          console.log(this.additionalInfo);
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
      },
    });
  }

  get flawControls() {
    return (this.flawsForm.get('flaws') as FormArray).controls;
  }

  createFlawGroup(flaw: any): FormGroup {
    return this.fb.group({
      flaw: [flaw.flaw, Validators.required],
      image: [flaw.image],
    });
  }

  createForm() {
    this.flawsForm = this.fb.group({
      flaws: this.fb.array(
        this.flaws.map((flaw) => this.createFlawGroup(flaw))
      ),
    });
  }

  viewAllImages() {
    this.isCarouselVisible = true;
  }

  calculateTimeLeft(endTime: number): {
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const now = Math.floor(Date.now() / 1000);
    let timeLeft = Math.max(0, endTime - now);

    const hours = Math.floor(timeLeft / 3600);
    timeLeft %= 3600;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return { hours, minutes, seconds };
  }

  generateAdditionalInfo(vehicleInfo: any): { label: string; value: string }[] {
    return this.additionalInfo.map((info) => {
      let value = '';
      switch (info.label) {
        case 'Name':
        case 'Vin':
        case 'Vehicle Number':
        case 'Model Number':
        case 'Brand Category':
        case 'Engine Power':
        case 'Transmission':
        case 'Tyre Conditions':
        case 'Location':
          value = vehicleInfo[info.key]?.[info.subkey] || 'N/A';
          break;
        case 'Vehicle Year':
          value = vehicleInfo[info.key]?.[info.subkey]?.toString() || 'N/A';
          break;
        case 'Seller Name':
          value = vehicleInfo[info.key]?.[info.subkey] || 'N/A';
          break;
        case 'Seller Type':
          value = 'Seller';
          break;
        case 'Vehicle Color':
          value = 'Color';
          break;
        case 'Used/Unused':
          value = vehicleInfo[info.key]?.[info.subkey] ? 'Used' : 'Unused';
          break;
        case 'Reserve':
          value = vehicleInfo[info.key] > 0 ? 'Reserved' : 'No Reserve';
          break;
        case 'Total Number of Hours':
          value = vehicleInfo[info.key]?.[info.subkey]?.toString() || 'N/A';
          break;
        default:
          value = 'N/A';
      }
      return { label: info.label, value, editMode: false };
    });
  }

  toggleEditMode(index: number): void {
    this.additionalInfo[index].editMode = !this.additionalInfo[index].editMode;
  }

  saveEdit(index: number): void {
    const editedItem = this.additionalInfo[index];
    // Implement save logic here, e.g., call a service to update the data on the server
    console.log('Saved value:', editedItem.value);

    // Exit edit mode
    this.additionalInfo[index].editMode = false;
  }

  toggleFlawEditMode() {
    this.isFlawEditMode = !this.isFlawEditMode;
    if (!this.isFlawEditMode) {
      this.editIndex = null;
    }
  }

  addFlaw() {
    (this.flawsForm.get('flaws') as FormArray).push(
      this.createFlawGroup({ flaw: '', image: '' })
    );
  }

  removeFlaw(index: number) {
    (this.flawsForm.get('flaws') as FormArray).removeAt(index);
  }

  editFlawImage(index: number): void {
    this.editIndex = index;
  }

  onSubmit(): void {
    if (this.flawsForm.valid) {
      console.log('Flaws:', this.flaws);
      console.log(this.flawsForm.value);
      this.toggleFlawEditMode();
    }
  }

  get modificationControls() {
    return (this.modificationsForm.get('modifications') as FormArray).controls;
  }

  createModificationsForm() {
    this.modificationsForm = this.fb.group({
      modifications: this.fb.array(
        this.vehicleInfo?.tractorId?.modifications.map((mod: string) =>
          this.createModificationGroup(mod)
        ) || []
      ),
    });
  }

  createModificationGroup(modification: string): FormGroup {
    return this.fb.group({
      modification: [modification, Validators.required],
    });
  }

  addModification() {
    (this.modificationsForm.get('modifications') as FormArray).push(
      this.createModificationGroup('')
    );
  }

  removeModification(index: number) {
    (this.modificationsForm.get('modifications') as FormArray).removeAt(index);
  }

  onModificationsSubmit(): void {
    if (this.modificationsForm.valid) {
      console.log(this.modificationsForm.value);
      this.toggleModificationEditMode();
    }
  }

  toggleModificationEditMode() {
    this.isModificationEditMode = !this.isModificationEditMode;
    if (this.isModificationEditMode) {
      this.createModificationsForm();
    }
  }

  get serviceLogControls() {
    return (this.serviceLogsForm.get('serviceLogs') as FormArray).controls;
  }

  createServiceLogsForm() {
    this.serviceLogsForm = this.fb.group({
      serviceLogs: this.fb.array(
        this.vehicleInfo?.tractorId?.serviceLogs.map((log: any) =>
          this.createServiceLogGroup(log)
        ) || []
      ),
    });
  }

  createServiceLogGroup(log: any): FormGroup {
    return this.fb.group({
      serviceDate: [new Date(log.serviceDate * 1000), Validators.required],
      fileUrl: [log.fileUrl],
      fileName: [log.fileName],
      message: [log.message],
    });
  }

  addServiceLog() {
    (this.serviceLogsForm.get('serviceLogs') as FormArray).push(
      this.createServiceLogGroup({
        serviceDate: '',
        fileUrl: '',
        fileName: '',
        message: '',
      })
    );
  }

  removeServiceLog(index: number) {
    (this.serviceLogsForm.get('serviceLogs') as FormArray).removeAt(index);
  }

  onServiceLogsSubmit(): void {
    if (this.serviceLogsForm.valid) {
      const serviceLogs = this.serviceLogsForm.value.serviceLogs.map(
        (log: any) => ({
          ...log,
          serviceDate: Math.floor(new Date(log.serviceDate).getTime() / 1000),
        })
      );
      this.vehicleInfo.tractorId.serviceLogs = serviceLogs;
      this.toggleServiceLogEditMode();
    }
  }

  toggleServiceLogEditMode() {
    this.isServiceLogEditMode = !this.isServiceLogEditMode;
    if (this.isServiceLogEditMode) {
      this.createServiceLogsForm();
    }
  }

  handleCustomRequest =
    (index: number) =>
    (item: NzUploadXHRArgs): Subscription => {
      this.imageLoaded = true;
      console.log(item);
      const uploadData = {
        fileName: item.file.name,
        filePath: 'images',
        fileType: item.file.type,
      };
      return this.profileService.getPresignedUrl(uploadData).subscribe({
        next: (data) => {
          const { url, key } = data?.data;
          const flawurl = data?.data?.key;
          const flawControl = (this.flawsForm.get('flaws') as FormArray).at(
            index
          );
          flawControl.get('image')?.setValue(key);
          console.log('avatar url', flawurl);

          this.uploadFile(item.file, url);
        },
        error: (error) => {
          console.error('Error getting pre-signed URL:', error);
          this.msg.error('Failed to get pre-signed URL for upload.');
        },
      });
    };

  private uploadFile(file: any, url: any): void {
    console.log('Uploading file:', file);
    console.log('To URL:', url);

    this.profileService.uploadFile(url, file).subscribe(
      (data) => {
        console.log('Upload', data);
        this.imageLoaded = false;
        this.cdr.detectChanges();
      },
      (error) => {
        this.imageLoaded = true;
      }
    );
  }
}
