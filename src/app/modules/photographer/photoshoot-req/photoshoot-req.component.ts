import { Component } from '@angular/core';
import { PhotographService } from '../../../core/services/photograph/photograph.service';
import { SharedModule } from '../../../shared/shared.module';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { PhotographReqDetailsComponent } from '../../../pages/photographer/photograph-req-details/photograph-req-details.component';

@Component({
  selector: 'app-photoshoot-req',
  standalone: true,
  imports: [SharedModule, PhotographReqDetailsComponent],
  templateUrl: './photoshoot-req.component.html',
  styleUrl: './photoshoot-req.component.css',
})
export class PhotoshootReqComponent {
  query: any = { skip: 1, take: 10 };
  photographRequests!: any[];
  totalRecords!: number;
  loading: boolean = false;
  routePath!: string;
  constructor(
    private photographService: PhotographService,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.routePath = this.router.url;
        console.log('Current route path:', this.routePath);
      });
    this.fetchPhotograhRequests();
  }

  fetchPhotograhRequests() {
    this.loading = true;
    this.photographService.getPhotoshootRequest(this.query).subscribe({
      next: (data) => {
        console.log(data);
        this.photographRequests = data?.data?.photographerRequests;
        this.loading = false;
        this.totalRecords = data?.data?.totalCount;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  handleViewMore(data: any) {
    localStorage.setItem('selectedUserId', data?._id);
    this.router.navigate(['/dashboard/photoshoot-requests/details']);
  }
}
