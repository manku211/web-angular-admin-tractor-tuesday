import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CategoryListComponent } from '../../../pages/category-list/category-list.component';
import { DetailsComponent } from '../../../pages/category-list/details/details.component';
import { VehicleInfoComponent } from '../../../pages/vehicle-info/vehicle-info.component';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-category-listing',
  standalone: true,
  imports: [
    SharedModule,
    CategoryListComponent,
    DetailsComponent,
    VehicleInfoComponent,
  ],
  templateUrl: './category-listing.component.html',
  styleUrl: './category-listing.component.css',
})
export class CategoryListingComponent {
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
