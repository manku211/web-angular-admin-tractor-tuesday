import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommentsBidsService } from '../../../core/services/comments-bids/comments-bids.service';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { getStatusStyles } from '../../../utilities/helpers/helper';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-listing',
  standalone: true,
  imports: [SharedModule, CommonModule, ModalComponent, FormsModule],
  templateUrl: './comment-listing.component.html',
  styleUrl: './comment-listing.component.css',
})
export class CommentListingComponent {
  commentData: any;
  comments!: any[];
  totalComments!: number;
  editModal: boolean = false;
  editCommentModal: boolean = false;
  deleteModal: boolean = false;
  editLoader: boolean = false;
  deleteLoader: boolean = false;
  commentSelected: any;
  editedComment!: string;
  getStatusStyles = getStatusStyles;

  constructor(private commentService: CommentsBidsService) {}
  ngOnInit() {
    const data: any = localStorage.getItem('commentData');
    this.commentData = JSON.parse(data);
    this.fetchComments(this.commentData?.tractorId);
  }

  fetchComments(id: string) {
    this.commentService.getCommentsByTractorID({ tractorId: id }).subscribe({
      next: (data) => {
        this.comments = data?.data?.comments;
        this.totalComments = data?.data?.count;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  handleEditModal(data: any) {
    this.commentSelected = data;
    this.editModal = true;
  }

  handleEditCommentModal() {
    this.editModal = false;
    this.editCommentModal = true;
  }

  handleDeleteModal(data: any) {
    this.commentSelected = data;
    this.deleteModal = true;
  }

  handleEdit() {
    this.editLoader = true;
    let payload = {
      commentId: this.commentSelected?._id,
      message: this.editedComment,
    };
    this.commentService.updateComment(payload).subscribe({
      next: (data) => {
        this.editLoader = false;
        this.fetchComments(this.commentData?.tractorId);
        this.editCommentModal = false;
      },
      error: (err) => {
        console.error(err);
        this.editLoader = false;
        this.editCommentModal = false;
      },
    });
  }

  handleDelete() {
    this.deleteLoader = true;
    let payload = {
      commentId: this.commentSelected?._id,
    };
    this.commentService.deleteComment(payload).subscribe({
      next: (data) => {
        this.fetchComments(this.commentData?.tractorId);
        this.deleteModal = false;
        this.deleteLoader = false;
      },
      error: (err) => {
        console.error(err);
        this.deleteModal = false;
        this.deleteLoader = false;
      },
    });
  }

  handleCancel() {
    this.editModal = false;
    this.deleteModal = false;
    this.editCommentModal = false;
  }
}
