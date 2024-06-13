import { Component } from '@angular/core';
import { PhotographService } from '../../../core/services/photograph/photograph.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-photographer-detail',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './photographer-detail.component.html',
  styleUrl: './photographer-detail.component.css',
})
export class PhotographerDetailComponent {
  photographerData: any;
  loading: boolean = false;
  constructor(
    private photographService: PhotographService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = String(localStorage.getItem('photographerId'));
    this.fetchPhotographerById(id);
  }

  fetchPhotographerById(id: string) {
    this.photographService.getPhotograherById(id).subscribe({
      next: (data) => {
        this.photographerData = data?.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }
}
