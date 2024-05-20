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
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchAllAdmin();
  }

  fetchAllAdmin() {
    this.adminService.getAllAdmins().subscribe({
      next: (data) => {
        console.log('admins list', data?.data?.admins);
        this.adminList = data?.data?.admins;
        this.totalAdmins = data?.data?.count;
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
    console.log(event, adminId, privilege, type);
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
        console.log(data);
        if (data) {
          this.messageService.success('Updated Successfully!');
          this.fetchAllAdmin();
        }
      },
      error: (err) => {
        console.error(err), this.fetchAllAdmin();
        this.messageService.error(err?.error?.error);
      },
    });
  }

  openAddAdminModal() {
    this.editAdminDetails = false;
    this.addAdminModal = true;
  }

  handleAddAdmin() {
    console.log(this.addAdminForm.value);
    if (this.editAdminDetails) {
      let payload = {
        adminId: this.editAdminId,
        email: this.addAdminForm.value.email,
        phoneNumber: String(this.addAdminForm.value.phoneNumber),
        countryCode: this.addAdminForm.value.code,
      };
      this.adminService.updateAdmin(payload).subscribe({
        next: (data) => {
          console.log(data);
          this.addAdminModal = false;
          this.fetchAllAdmin();
        },
        error: (err) => {
          console.error(err?.error?.error);
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
          console.log(data);
          this.addAdminModal = false;
          this.fetchAllAdmin();
        },
        error: (err) => {
          console.error(err?.error?.error);
        },
      });
    }
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
        console.log(data);
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
        console.log(data);
        this.addAdminForm.patchValue({
          username: data?.data?.name,
          email: data?.data?.email,
          phoneNumber: data?.data?.phoneNumber,
          code: data?.data?.countryCode,
        });
        this.addAdminModal = true;
      },
      error: (err) => console.error(err),
    });
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
