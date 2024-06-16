import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SellerListComponent } from '../../../pages/seller-list/seller-list.component';
import { DetailsComponent } from '../../../pages/seller-list/details/details.component';
import { VehicleInfoComponent } from '../../../pages/vehicle-info/vehicle-info.component';
import { CommentListingComponent } from '../../../pages/seller-list/comment-listing/comment-listing.component';

@Component({
  selector: 'app-seller-listing',
  standalone: true,
  imports: [
    SharedModule,
    SellerListComponent,
    DetailsComponent,
    VehicleInfoComponent,
    CommentListingComponent
  ],
  templateUrl: './seller-listing.component.html',
  styleUrl: './seller-listing.component.css',
})
export class SellerListingComponent {
  routePath!: string;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.routePath = this.router.url;
  }
  ngOnInit() {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.routePath = this.router.url;
      });
  }
}
