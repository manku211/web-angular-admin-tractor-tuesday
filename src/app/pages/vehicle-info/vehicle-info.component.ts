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
import { EquipmentCategory } from '../../core/models/equipmentCategories';
import { TranmissionTypes } from '../../core/models/transmissionTypes';

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
  avatarUrl!: string;
  additionalInfo: any[] = [
    {
      label: 'Name Of The Vehicle',
      key: 'tractorId',
      subkey: 'name',
      id: 'name',
      isEdit: true,
    },
    { label: 'VIN', key: 'tractorId', subkey: 'vin', id: 'vin', isEdit: true },
    {
      label: 'Vehicle Number',
      key: 'tractorId',
      subkey: 'number',
      id: 'number',
      isEdit: true,
    },
    {
      label: 'Model Number',
      key: 'tractorId',
      subkey: 'brand',
      id: 'brand',
      isEdit: true,
    },
    {
      label: 'Vehicle Year',
      key: 'tractorId',
      subkey: 'year',
      id: 'year',
      isEdit: true,
    },
    {
      label: 'Brand Category',
      key: 'tractorId',
      subkey: 'category',
      id: 'category',
      isEdit: true,
    },
    {
      label: 'Engine Power',
      key: 'tractorId',
      subkey: 'power',
      id: 'power',
      isEdit: true,
    },
    {
      label: 'Seller Name',
      key: 'userId',
      subkey: 'username',
      isEdit: false,
      id: 'sellerName',
    },
    {
      label: 'Seller Type',
      key: 'sellerType',
      subkey: '',
      isEdit: true,
      id: 'sellerType',
    },
    {
      label: 'Vehicle Color',
      key: 'tractorId',
      subkey: 'name',
      id: 'color',
      isEdit: true,
    },
    {
      label: 'Transmission',
      key: 'tractorId',
      subkey: 'transmissionType',
      id: 'transmissionType',
      isEdit: true,
    },
    {
      label: 'Tyre Conditions',
      key: 'tractorId',
      subkey: 'tyreConditions',
      id: 'tyreConditions',
      isEdit: true,
    },
    {
      label: 'Used/Unused',
      key: 'tractorId',
      subkey: 'isUsed',
      id: 'isUsed',
      isEdit: true,
    },
    {
      label: 'Reserve',
      key: 'reservedPrice',
      subkey: '',
      isEdit: true,
      id: 'reserve',
    },
    {
      label: 'Location',
      key: 'tractorId',
      subkey: 'location',
      id: 'location',
      isEdit: false,
    },
    {
      label: 'Total Number of Hours',
      key: 'tractorId',
      subkey: 'totalHrs',
      id: 'totalHrs',
      isEdit: true,
    },
  ];
  isEditMode: boolean = false;
  isFlawEditMode: boolean = false;
  flawsForm!: FormGroup;
  editIndex: number | null = null;
  flaws: any[] = [];
  serviceLogs: any[] = [];
  imageLoaded: boolean = false;
  isModificationEditMode: boolean = false;
  modificationsForm!: FormGroup;
  isServiceLogEditMode: boolean = false;
  serviceLogsForm!: FormGroup;
  equipmentCategories = Object.values(EquipmentCategory);
  transmissions = Object.values(TranmissionTypes);
  isEditImagesVisible: boolean = false;
  tractorImage!: any[];

  constructor(
    private auctionService: AuctionService,
    private router: Router,
    private fb: FormBuilder,
    private profileService: ProfileService,
    private msg: MessageService,
    private cdr: ChangeDetectorRef
  ) {
    this.createForm();
    this.createServiceForm();
  }

  ngOnInit(): void {
    this.auctionId = localStorage.getItem('selectedAuctionId');
    const state = history.state as { isEditMode?: boolean };
    if (state && typeof state.isEditMode === 'boolean') {
      this.isEditMode = state.isEditMode;
    }
    this.fetchVehicleDetails(this.auctionId);
  }

  fetchVehicleDetails(auctionId: string) {
    this.auctionService.getAuctionById(auctionId).subscribe({
      next: (data: any) => {
        if (data) {
          this.vehicleInfo = data?.data;
          this.tractorImages = data?.data?.tractorId?.images.map(
            (image: any) => image.link
          );
          this.additionalInfo = this.generateAdditionalInfo(this.vehicleInfo);
          this.flaws = data?.data?.tractorId?.flaws || [];
          this.serviceLogs = data?.data?.tractorId?.serviceLogs || [];
          this.createForm();
          this.createServiceForm();
          this.calculateTimeLeft(this.vehicleInfo?.endTime);
        }
      },
      error: (error) => {
        console.error('An error occurred during admin login:', error);
      },
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
      let value: any;
      switch (info.id) {
        case 'name':
        case 'vin':
        case 'number':
        case 'brand':
        case 'category':
        case 'power':
        case 'transmissionType':
          value = vehicleInfo[info.key]?.[info.subkey] || 'N/A';
          break;
        case 'tyreConditions':
          value = {
            condition: vehicleInfo[info.key]?.[info.subkey]?.[info?.condiotion],
            width: vehicleInfo[info.key]?.[info.subkey]?.[info?.width],
            size: vehicleInfo[info.key]?.[info.subkey]?.[info?.size],
          };
          break;
        case 'location':
          value = vehicleInfo[info.key]?.[info.subkey]
            ? vehicleInfo[info.key]?.[info.subkey]?.['streetAddress'] +
              ', ' +
              vehicleInfo[info.key]?.[info.subkey]?.['city'] +
              ', ' +
              vehicleInfo[info.key]?.[info.subkey]?.['stateOrProvince'] +
              ', ' +
              vehicleInfo[info.key]?.[info.subkey]?.['country'] +
              ', ' +
              vehicleInfo[info.key]?.[info.subkey]?.['zipOrPlace']
            : '';
          break;
        case 'year':
          value = vehicleInfo[info.key]?.[info.subkey]?.toString() || 'N/A';
          break;
        case 'sellerName':
          value = vehicleInfo[info.key]?.[info.subkey] || 'N/A';
          break;
        case 'sellerType':
          value = 'Seller';
          break;
        case 'color':
          value = 'Color';
          break;
        case 'isUsed':
          value = vehicleInfo[info.key]?.[info.subkey] ? 'Used' : 'Unused';
          break;
        case 'reserve':
          value = vehicleInfo[info.key] > 0 ? 'Reserved' : 'No Reserve';
          break;
        case 'totalHrs':
          value = vehicleInfo[info.key]?.[info.subkey]?.toString() || 'N/A';
          break;
        default:
          value = 'N/A';
      }
      return {
        value,
        editMode: false,
        ...info,
      };
    });
  }

  toggleEditMode(index: number): void {
    this.additionalInfo[index].editMode = !this.additionalInfo[index].editMode;
  }

  updateVehicleInfo(payload: any) {
    this.auctionService
      .updateVehicleInfo(this.vehicleInfo?.tractorId?._id, payload)
      .subscribe({
        next: (data) => {
          this.fetchVehicleDetails(this.auctionId);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  saveEdit(index: number): void {
    const editedItem = this.additionalInfo[index];
    // Exit edit mode
    this.additionalInfo[index].editMode = false;
    let payload = {
      [editedItem?.id]: editedItem?.value,
    };
    this.updateVehicleInfo(payload);
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
      const modifications = this.modificationsForm.value.modifications.map(
        (mod: { modification: string }) => mod.modification
      );

      const payload = { modifications };
      this.updateVehicleInfo(payload);
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

  createServiceLogGroup(serviceLog: any): FormGroup {
    return this.fb.group({
      fileName: [serviceLog.fileName, Validators.required],
      fileUrl: [serviceLog.fileUrl, Validators.required],
      serviceDate: [serviceLog.serviceDate, Validators.required],
    });
  }

  createServiceForm() {
    this.serviceLogsForm = this.fb.group({
      serviceLogs: this.fb.array(
        this.serviceLogs.map((log) => this.createServiceLogGroup(log))
      ),
    });
  }

  toggleServiceLogEditMode() {
    this.isServiceLogEditMode = !this.isServiceLogEditMode;
    if (!this.isServiceLogEditMode) {
      this.editIndex = null;
    }
  }

  addServiceLog() {
    (this.serviceLogsForm.get('serviceLogs') as FormArray).push(
      this.createServiceLogGroup({
        fileName: '',
        fileUrl: '',
        serviceDate: new Date(),
      })
    );
  }

  removeServiceLog(index: number) {
    (this.serviceLogsForm.get('serviceLogs') as FormArray).removeAt(index);
  }

  editServiceLog(index: number): void {
    this.editIndex = index;
  }

  onServiceLogsSubmit(): void {
    if (this.serviceLogsForm.valid) {
      console.log(this.serviceLogsForm.value);
      this.toggleServiceLogEditMode();
    }
  }

  handleCustomRequest =
    (index: number, type: string) =>
    (item: NzUploadXHRArgs): Subscription => {
      this.imageLoaded = true;
      const uploadData = {
        fileName: item.file.name,
        filePath: 'images',
        fileType: item.file.type,
      };
      console.log('Updating', type);
      return this.profileService.getPresignedUrl(uploadData).subscribe({
        next: (data) => {
          const { url, key } = data?.data;
          this.uploadFile(item.file, url, key, type, index);
        },
        error: (error) => {
          console.error('Error getting pre-signed URL:', error);
          this.msg.error('Failed to get pre-signed URL for upload.');
        },
      });
    };

  handleImageEdit = (item: NzUploadXHRArgs): Subscription => {
    const uploadData = {
      fileName: item.file.name,
      filePath: 'images',
      fileType: item.file.type,
    };
    return this.profileService.getPresignedUrl(uploadData).subscribe({
      next: (data) => {
        const { url, key } = data?.data;
        this.uploadFile(item.file, url, key, 'tractor');
      },
      error: (error) => {
        console.error('Error getting pre-signed URL:', error);
        this.msg.error('Failed to get pre-signed URL for upload.');
      },
    });
  };

  updateImages(file: any, index?: any, key?: any, type?: string) {
    console.log('Updating', file, type);
    if (type === 'flaw') {
      const flawControl = (this.flawsForm.get('flaws') as FormArray).at(index);
      flawControl.get('image')?.setValue(key);
    }
    if (type === 'servicelog') {
      const serviceControl = (
        this.serviceLogsForm.get('serviceLogs') as FormArray
      ).at(index);
      serviceControl.get('fileUrl')?.setValue(key);
    }
    if (type === 'tractor') {
      this.tractorImage.push({
        link: key,
        type: file.type,
      });
    }
  }

  private uploadFile(
    file: any,
    url: any,
    key: any,
    type: string,
    index?: any
  ): void {
    this.profileService.uploadFile(url, file).subscribe(
      (data) => {
        this.imageLoaded = false;
        this.updateImages(file, index, key, type);
        this.cdr.detectChanges();
      },
      (error) => {
        this.imageLoaded = false;
      }
    );
  }

  editImages() {
    this.tractorImage = [...this.vehicleInfo.tractorId.images];
    this.isEditImagesVisible = true;
  }

  editTractorImages() {
    console.log('Available Images:', this.tractorImage);
    let payload = {
      images: this.tractorImage,
    };
    this.updateVehicleInfo(payload);
    this.isEditImagesVisible = false;
  }

  deleteImage(index: number) {
    this.vehicleInfo.tractorId.images.splice(index, 1);
  }

  uploadImage() {
    // Handle image upload logic
  }
}
