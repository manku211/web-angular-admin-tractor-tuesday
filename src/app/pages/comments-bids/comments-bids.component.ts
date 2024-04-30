import { Component, Input } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CommentsBidsService } from '../../core/services/comments-bids/comments-bids.service';

@Component({
  selector: 'app-comments-bids',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './comments-bids.component.html',
  styleUrl: './comments-bids.component.css',
})
export class CommentsBidsComponent {
  @Input() tractorId!: string;
  commentsQuery: any;
  newestQuery: any;
  bidHistory: any[] = [];
  commentHistory: any[] = [];
  newest: any[] = [];
  totalCommentsAndBids!: number;
  replies: any[] = [];
  activeLink: string = 'newest';
  constructor(private commentsBidsService: CommentsBidsService) {}

  ngOnInit() {
    this.newestQuery = { ...this.newestQuery, tractorId: this.tractorId };
    this.fetchData('newest');
  }

  fetchData(link: string) {
    // Update active link
    this.activeLink = link;

    // Fetch data based on the provided link type
    switch (link) {
      case 'newest':
        this.fetchNewest(this.newestQuery);
        break;
      case 'comments':
        this.fetchComments(this.newestQuery);
        break;
      case 'bids':
        this.fetchBids(this.newestQuery);
        break;
      default:
        this.fetchNewest(this.newestQuery);
    }
  }

  fetchNewest(params: any) {
    console.log(params);
    this.commentsBidsService.getCommentsAndBidsByTractorId(params).subscribe({
      next: (data) => {
        console.log(data);
        this.totalCommentsAndBids = data?.data?.totalCount;
        this.newest = data?.data?.bidsAndComments;
        this.activeLink = 'newest';
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  fetchComments(params: any) {
    this.commentsBidsService.getCommentsByTractorID(params).subscribe({
      next: (data) => {
        console.log(data);
        this.activeLink = 'comments';
        this.commentHistory = data?.data?.comments;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  fetchBids(params: any) {
    this.commentsBidsService.getBidsById(params).subscribe({
      next: (data) => {
        console.log(data);
        this.activeLink = 'bids';
        this.bidHistory = data?.data?.bids;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  fetchReplies(params: any) {
    this.commentsBidsService.getRepliesForComment(params).subscribe({
      next: (data) => {
        console.log(data);
        this.replies = data?.data?.comments;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  handleReplies(commentId: any) {
    const params = { commentId: commentId };
    this.fetchReplies(params);
  }

  calculateTimeDifference(createdAt: string): string {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const difference = Math.abs(currentDate.getTime() - createdDate.getTime());
    const minutesDifference = Math.floor(difference / (1000 * 60));
    if (minutesDifference < 60) {
      return minutesDifference + 'm';
    }
    const hoursDifference = Math.floor(difference / (1000 * 3600));
    if (hoursDifference < 24) {
      return hoursDifference + 'h';
    }
    const daysDifference = Math.floor(difference / (1000 * 3600 * 24));
    if (daysDifference < 7) {
      return daysDifference + 'd';
    }
    const weeksDifference = Math.floor(daysDifference / 7);
    if (weeksDifference < 4) {
      return weeksDifference + 'w';
    }
    const monthsDifference = Math.floor(daysDifference / 30);
    if (monthsDifference < 12) {
      return monthsDifference + 'm';
    }
    const yearsDifference = Math.floor(daysDifference / 365);
    return yearsDifference + 'y';
  }
}
