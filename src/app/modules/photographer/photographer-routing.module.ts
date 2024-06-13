import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoshootReqComponent } from './photoshoot-req/photoshoot-req.component';
import { PhotographReqDetailsComponent } from '../../pages/photographer/photograph-req-details/photograph-req-details.component';
import { PhotographerDetailComponent } from '../../pages/photographer/photographer-detail/photographer-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PhotoshootReqComponent,
    children: [
      {
        path: 'details',
        component: PhotographReqDetailsComponent,
        data: {
          breadcrumb: 'Photoshoot Details',
        },
        children: [
          {
            path: 'photographer',
            component: PhotographerDetailComponent,
            data: {
              breadcrumb: 'Photographer Details',
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
export class PhotographerRoutingModule {}
