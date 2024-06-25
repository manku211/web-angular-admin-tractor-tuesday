import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoshootReqComponent } from './photoshoot-req/photoshoot-req.component';
import { PhotographReqDetailsComponent } from '../../pages/photographer/photograph-req-details/photograph-req-details.component';
import { PhotographerDetailComponent } from '../../pages/photographer/photographer-detail/photographer-detail.component';
import { PhotographersListComponent } from './photographers-list/photographers-list.component';

const routes: Routes = [
  {
    path: 'photoshoot-requests',
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
  {
    path: '',
    component: PhotographersListComponent,
    children: [
      { path: 'photographer-detail', component: PhotographerDetailComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotographerRoutingModule {}
