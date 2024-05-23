import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoshootReqComponent } from './photoshoot-req/photoshoot-req.component';

const routes: Routes = [{ path: '', component: PhotoshootReqComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotographerRoutingModule {}
