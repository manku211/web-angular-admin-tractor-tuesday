import { Component } from '@angular/core';
import { PhotographService } from '../../../core/services/photograph/photograph.service';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-photograph-req-details',
  standalone: true,
  imports: [SharedModule, CommonModule, FormsModule],
  templateUrl: './photograph-req-details.component.html',
  styleUrl: './photograph-req-details.component.css',
})
export class PhotographReqDetailsComponent {
  photographRequestData: any;
  loading: boolean = false;
  photographerPrice!: number;
  constructor(private photographService: PhotographService) {}

  ngOnInit() {
    const id = String(localStorage.getItem('selectedUserId'));
    this.fetchPhotograhRequestsById(id);
  }

  fetchPhotograhRequestsById(id: string) {
    this.loading = true;
    this.photographService.getPhotoshootRequest(id).subscribe({
      next: (data) => {
        console.log(data);
        this.photographRequestData = data?.data?.photographerRequests[0];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  handleSubmit() {}
}
