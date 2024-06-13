import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ContentManagementService } from '../../../core/services/content-management/content-management.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from '../../../core/services/message/message.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
})
export class FaqComponent {
  panels: any[] = [];
  openFaqForm: boolean = false;
  faqForm!: FormGroup;
  isEdit: boolean = false;
  editFaqId: string = '';
  deleteFaqId: string = '';
  openDeleteModal: boolean = false;
  loading: boolean = false;
  constructor(
    private contentService: ContentManagementService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.faqForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });
    this.fetchFaqs();
  }

  fetchFaqs() {
    this.loading = true;
    this.contentService.getAllFaqs({}).subscribe({
      next: (data) => {
        this.panels = data?.data.map((item: any) => ({
          id: item._id,
          active: false,
          disabled: false,
          name: item.faq,
          content: item.answer,
        }));
        this.loading = false;
      },
    });
  }

  addNew() {
    this.openFaqForm = true;
    this.isEdit = false;
  }

  editFaq(event: Event, id: string) {
    this.editFaqId = id;
    event.stopPropagation();
    this.openFaqForm = true;
    this.isEdit = true;
    this.contentService.getFaqById(id).subscribe({
      next: (data) => {
        if (data?.data) {
          this.faqForm.patchValue({
            question: data.data?.faq,
            answer: data?.data?.answer,
          });
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteFaq(event: Event, id: string) {
    event.stopPropagation();
    this.deleteFaqId = id;
    this.openDeleteModal = true;
    this.openFaqForm = false;
  }
  submitNewQuestion() {
    // Logic to submit new question here
    if (this.faqForm.valid) {
      const formData = this.faqForm.value;
      const payload = {
        faq: formData.question,
        answer: formData.answer,
      };
      if (!this.isEdit) {
        this.contentService.createFaq(payload).subscribe({
          next: (data) => {
            if (data?.success) {
              this.messageService.success('FAQ created successfully');
              this.faqForm.reset();
              this.openFaqForm = false;
              this.fetchFaqs();
            }
          },
          error: (err) => {
            console.error(err);
          },
        });
      } else if (this.isEdit) {
        this.contentService.updateFaq(this.editFaqId, payload).subscribe({
          next: (data) => {
            if (data?.success) {
              this.messageService.success('FAQ updated successfully');
              this.fetchFaqs();
            }
          },
          error: (err) => {
            console.error(err);
          },
        });
      }
      this.faqForm.reset();
      this.openFaqForm = false;
    }
    // Reset form
    else {
      Object.values(this.faqForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleDeleteFaq() {
    this.contentService.deleteFaq(this.deleteFaqId).subscribe({
      next: (data) => {
        if (data?.success) {
          this.messageService.success('Faq deleted successfully');
          this.fetchFaqs();
          this.openDeleteModal = false;
        }
      },
      error: (err) => {
        console.error(err);
        this.openDeleteModal = false;
      },
    });
  }

  handleCancel() {
    this.openDeleteModal = false;
  }

  cancelEdit() {
    this.openFaqForm = false;
    this.faqForm.reset();
  }
}
