import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PhotoshootReqComponent } from './photoshoot-req/photoshoot-req.component';
import { PhotographService } from '../../core/services/photograph/photograph.service';

const routes: Routes = [{ path: '', component: PhotoshootReqComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotographerRoutingModule {
  query: any = { skip: 1, take: 10 };
  constructor(private photographService: PhotographService) {}
  ngOnInit() {
    this.fetchPhotoshootRequests();
  }

  fetchPhotoshootRequests() {
    this.photographService.getPhotoshootRequest(this.query).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
