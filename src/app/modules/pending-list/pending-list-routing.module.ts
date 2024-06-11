import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingListComponent } from '../../pages/pending-list/pending-list.component';

const routes: Routes = [{ path: '', component: PendingListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PendingListRoutingModule {}
