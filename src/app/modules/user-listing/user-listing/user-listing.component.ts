import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { UserListComponent } from '../../../pages/user-list/user-list.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DetailsComponent } from '../../../pages/user-list/details/details.component';
import { filter } from 'rxjs';
import { VehicleInfoComponent } from '../../../pages/vehicle-info/vehicle-info.component';

@Component({
  selector: 'app-user-listing',
  standalone: true,
  imports: [
    SharedModule,
    UserListComponent,
    DetailsComponent,
    VehicleInfoComponent,
  ],
  templateUrl: './user-listing.component.html',
  styleUrl: './user-listing.component.css',
})
export class UserListingComponent {
  routePath!: string;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.routePath = this.router.url;
  }
  ngOnInit() {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.routePath = this.router.url;
        console.log('Current route path:', this.routePath);
      });
  }
}
