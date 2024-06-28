import { Component } from '@angular/core';
import { CommentsBidsService } from '../../../core/services/comments-bids/comments-bids.service';
import { TableViewComponent } from '../../../shared/components/table-view/table-view.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import {
  getExteriorImageUrl,
  styleObject,
} from '../../../utilities/helpers/helper';
import { Router } from '@angular/router';

interface ColumnInfo {
  key: string;
  label: string;
  sort: boolean;
  sortOrder?: string;
  type?: string;
  listOfFilter?: any[];
  filter?: boolean;
  isMultiple?: boolean;
}

@Component({
  selector: 'app-comment-editor',
  standalone: true,
  imports: [TableViewComponent, CommonModule, SharedModule],
  templateUrl: './comment-editor.component.html',
  styleUrl: './comment-editor.component.css',
})
export class CommentEditorComponent {
  query: any = { skip: 1, take: 10, auctionStatus: 'ONGOING,ENDED' };
  totalRecords!: number;
  commentEditorData: any[] = [];
  userId: any;
  loader: boolean = false;
  styleObject: any = styleObject;
  listOfColumns: ColumnInfo[] = [
    {
      key: 'message',
      label: 'Comments',
      sort: true,
    },
    {
      key: 'fullName',
      label: 'UserName',
      sort: true,
    },
    {
      key: 'tractorName',
      label: 'Tractor Name',
      sort: false,
    },
    {
      key: 'auctionStatus',
      label: 'Auction Status',
      sort: false,
      filter: true,
      listOfFilter: [
        { text: 'Ongoing', value: 'ONGOING' },
        { text: 'Ended', value: 'ENDED' },
      ],
    },
    {
      key: 'startTime',
      label: 'Auction Date',
      sort: false,
    },
    {
      key: 'currentBid.amount',
      label: 'Bidding Amount',
      sort: true,
    },
  ];
  constructor(
    private commentEditorService: CommentsBidsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = localStorage.getItem('selectedUserId');
    this.query = {
      ...this.query,
      sellerId: this.userId,
    };
    this.fetchCommentEditorDetails(this.query);
  }

  fetchCommentEditorDetails(params: any) {
    this.loader = true;
    this.commentEditorService.getCommentEditorData(params).subscribe({
      next: (data) => {
        this.loader = false;
        this.commentEditorData = data?.data?.comments;

        this.totalRecords = data?.data?.count;
      },
      error: (err) => {
        this.loader = false;
        console.error(err);
      },
    });
  }

  onSortChange(column: any): void {
    if (column?.sortOrder === null) {
      const { sortOrder, sortField, ...newQuery } = this.query;
      this.query = newQuery;
    } else {
      this.query = {
        ...this.query,
        sortOrder: column.sortOrder,
        sortField: column.key,
      };
    }
    this.fetchCommentEditorDetails(this.query);
  }

  onFilterHandler(filteredColumn: any): void {
    const key = filteredColumn?.column?.key;
    if (filteredColumn.event != null) {
      this.query = { ...this.query, [key]: filteredColumn.event };
      this.fetchCommentEditorDetails(this.query);
    } else {
      const updatedQuery = { ...this.query };
      delete updatedQuery[key];
      this.fetchCommentEditorDetails(updatedQuery);
    }
  }

  onPageChange(page: number): void {
    this.query = { ...this.query, skip: page };
    this.fetchCommentEditorDetails(this.query);
  }

  handleViewMore(data: any) {
    const commentData = {
      tractorId: data?.tractorId?._id,
      image: getExteriorImageUrl(data),
      name: data?.tractorId?.name,
      status: data?.status,
      currentBid: data?.auctionId?.amount,
      auctionEndDate: data?.auctionId?.endTime,
      totalBids: data?.auctionId?.totalBids,
    };
    localStorage.setItem('commentData', JSON.stringify(commentData));
    this.router.navigate([
      '/dashboard/seller-listing/seller-details/comment-listing',
    ]);
  }
}
