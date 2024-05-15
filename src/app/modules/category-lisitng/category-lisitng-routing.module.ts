import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListingComponent } from './category-listing/category-listing.component';
import { DetailsComponent } from '../../pages/category-list/details/details.component';
import { VehicleInfoComponent } from '../../pages/vehicle-info/vehicle-info.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryListingComponent,
    children: [
      {
        path: 'category-details',
        component: DetailsComponent,
        data: {
          breadcrumb: 'CategoryDetails',
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
export class CategoryLisitngRoutingModule {}
