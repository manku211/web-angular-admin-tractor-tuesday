import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerListingComponent } from './seller-listing/seller-listing.component';
import { DetailsComponent } from '../../pages/seller-list/details/details.component';
import { VehicleInfoComponent } from '../../pages/vehicle-info/vehicle-info.component';
import { CommentListingComponent } from '../../pages/seller-list/comment-listing/comment-listing.component';

const routes: Routes = [
  {
    path: '',
    component: SellerListingComponent,
    children: [
      {
        path: 'seller-details',
        component: DetailsComponent,
        data: {
          breadcrumb: 'SellerDetails',
        },
        children: [
          {
            path: 'vehicle-info',
            component: VehicleInfoComponent,
            data: {
              breadcrumb: 'Vehicle Information',
            },
          },
          {
            path: 'comment-listing',
            component: CommentListingComponent,
            data: {
              breadcrumb: 'Comment Listing',
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
export class SellerListingRoutingModule {}
