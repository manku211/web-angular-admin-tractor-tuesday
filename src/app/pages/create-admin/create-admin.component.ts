import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProfileService } from '../../core/services/profile/profile.service';
import { MessageService } from '../../core/services/message/message.service';
import { phoneNumberValidator } from '../../utilities/helpers/helper';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [SharedModule, ModalComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css',
})
export class CreateAdminComponent {
  addAdminModal: boolean = false;
  addAdminForm!: FormGroup;
  visibleIndex: number | null = null;
  adminList: any[] = [];
  removeAdminId!: string;
  editAdminId!: string;
  totalAdmins!: number;
  openDeleteModal: boolean = false;
  editAdminDetails: boolean = false;
  initialFormValues: any;
  privileges: { label: string; value: string }[] = [
    { label: 'User Listing', value: 'USER_LISTING' },
    { label: 'Seller Listing', value: 'SELLER_LISTING' },
    { label: 'Control Panel', value: 'CONTROL_PANEL' },
    { label: 'Content Management', value: 'CONTENT_MANAGEMENT' },
    { label: 'Category Listing', value: 'CATEGORY_LISTING' },
    { label: 'Photoshoot Request', value: 'PHOTOSHOOT_REQUEST' },
    { label: 'Photographer Form', value: 'PHOTOGRAPHER_FORM' },
  ];
  constructor(
    private fb: FormBuilder,
    private adminService: ProfileService,
    private messageService: MessageService
  ) {
    this.addAdminForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]*$/),
          Validators.maxLength(20),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      code: ['', Validators.required],
      phoneNumber: ['', [Validators.required, phoneNumberValidator()]],
    });
  }

  ngOnInit() {
    this.fetchAllAdmin();
  }

  fetchAllAdmin() {
    this.adminService.getAllAdmins().subscribe({
      next: (data) => {
        this.adminList = data?.data?.admins.filter(
          (item: any) => item.role === 'admin'
        );
        this.totalAdmins = this.adminList.length;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getPrivilegeStatus(
    adminId: string,
    privilege: any,
    type: 'read' | 'write'
  ): boolean {
    const admin = this.adminList.find((a) => a._id === adminId);
    if (admin) {
      const priv = admin.privileges.find((p: any) => p.name === privilege);
      if (priv) {
        return priv[type];
      }
    }
    return false;
  }

  updatePrivilege(
    event: any,
    adminId: string,
    privilege: any,
    type: 'read' | 'write'
  ) {
    let payload = {
      adminId: adminId,
      privilege: privilege,
      accessType:
        type === 'read' && event
          ? 'read'
          : type === 'read' && !event
          ? 'remove'
          : type == 'write' && event
          ? 'read_write'
          : 'remove',
    };
    this.adminService.updatePrivilege(payload).subscribe({
      next: (data) => {
        if (data) {
          this.messageService.success('Updated Successfully!');
          this.fetchAllAdmin();
        }
      },
      error: (err) => {
        console.error(err), this.fetchAllAdmin();
        this.messageService.error(err?.error?.message);
      },
    });
  }

  openAddAdminModal() {
    this.addAdminForm.reset();
    this.editAdminDetails = false;
    this.addAdminModal = true;
  }

  handleAddAdmin() {
    if (this.editAdminDetails) {
      let payload = {
        adminId: this.editAdminId,
        email: this.addAdminForm.value.email,
        phoneNumber: String(this.addAdminForm.value.phoneNumber),
        countryCode: this.addAdminForm.value.code,
      };
      this.adminService.updateAdmin(payload).subscribe({
        next: (data) => {
          this.addAdminModal = false;
          this.messageService.success('Details updated successfully');
          this.fetchAllAdmin();
        },
        error: (err) => {
          console.error(err?.error?.error);
          this.messageService.error(err?.error?.message);
        },
      });
    } else {
      let payload = {
        email: this.addAdminForm.value.email,
        name: this.addAdminForm.value.username,
        phoneNumber: String(this.addAdminForm.value.phoneNumber),
        countryCode: this.addAdminForm.value.code,
      };
      this.adminService.addAdmin(payload).subscribe({
        next: (data) => {
          this.addAdminModal = false;
          this.messageService.success('Admin added successfully');
          this.fetchAllAdmin();
        },
        error: (err) => {
          console.error(err?.error?.error);
          this.messageService.error(err?.error?.message);
        },
      });
    }
    this.addAdminForm.reset();
  }

  handleCancel() {
    this.addAdminModal = false;
    this.openDeleteModal = false;
  }

  removeAdmin(id: any): void {
    this.removeAdminId = id;
    this.openDeleteModal = true;
  }

  remove() {
    let payload = { adminId: this.removeAdminId };
    this.adminService.removeAdmin(payload).subscribe({
      next: (data) => {
        this.openDeleteModal = false;
        this.messageService.success('Account is Removed successfully');
        this.fetchAllAdmin();
      },
      error: (err) => {
        this.openDeleteModal = false;
        console.error(err);
      },
    });
  }
  editAdmin(id: any) {
    this.editAdminDetails = true;
    this.editAdminId = id;
    this.adminService.getAdminById(id).subscribe({
      next: (data) => {
        this.initialFormValues = {
          username: data?.data?.name,
          email: data?.data?.email,
          code: data?.data?.countryCode,
          phoneNumber: data?.data?.phoneNumber,
        };
        this.addAdminForm.patchValue(this.initialFormValues);
        this.addAdminModal = true;
      },
      error: (err) => console.error(err),
    });
  }

  hasFormChanged(): boolean {
    const currentValues = this.addAdminForm.value;
    return (
      JSON.stringify(currentValues) !== JSON.stringify(this.initialFormValues)
    );
  }

  change(visible: boolean, index: number): void {
    if (visible) {
      this.visibleIndex = index;
    } else {
      this.visibleIndex = null;
    }
  }

  get username() {
    return this.addAdminForm.get('username');
  }
  get email() {
    return this.addAdminForm.get('email');
  }
  get code() {
    return this.addAdminForm.get('code');
  }
  get phoneNumber() {
    return this.addAdminForm.get('phoneNumber');
  }
}
