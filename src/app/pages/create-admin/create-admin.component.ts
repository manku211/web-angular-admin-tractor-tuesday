import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './create-admin.component.html',
  styleUrl: './create-admin.component.css',
})
export class CreateAdminComponent {
  privileges: string[] = [
    'User Listing',
    'Seller Listing',
    'Control Panel',
    'Category Listing',
    'Photoshoot Request',
    'Photographer Form',
  ];
}
