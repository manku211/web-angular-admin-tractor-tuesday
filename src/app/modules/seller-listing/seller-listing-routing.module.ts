import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SellerListingComponent } from './seller-listing/seller-listing.component';
import { DetailsComponent } from '../../pages/seller-list/details/details.component';

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
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerListingRoutingModule {}
