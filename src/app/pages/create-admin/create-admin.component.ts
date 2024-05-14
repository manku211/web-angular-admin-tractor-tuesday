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
  privileges: string[] = [
    'User Listing',
    'Seller Listing',
    'Control Panel',
    'Category Listing',
    'Photoshoot Request',
    'Photographer Form',
  ];

  constructor(private fb: FormBuilder) {
    this.addAdminForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]*$/),
          Validators.maxLength(20),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
  }

  openAddAdminModal() {
    this.addAdminModal = true;
  }

  handleAddAdmin() {
    let payload = {};
  }

  handleCancel() {
    this.addAdminModal = false;
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
