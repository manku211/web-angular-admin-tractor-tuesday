import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from '../../pages/user-list/user-list.component';
import { DetailsComponent } from '../../pages/user-list/details/details.component';
import { UserListingComponent } from './user-listing/user-listing.component';
import { VehicleInfoComponent } from '../../pages/vehicle-info/vehicle-info.component';

const routes: Routes = [
  {
    path: '',
    component: UserListingComponent,

    children: [
      {
        path: 'user-details',
        component: DetailsComponent,
        data: {
          breadcrumb: 'UserDetails',
        },
        children: [
          {
            path: 'vehicle-info',
            component: VehicleInfoComponent,
            data: {
              breadcrumb: 'Vehicle Information',
            },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserListingRoutingModule {}
