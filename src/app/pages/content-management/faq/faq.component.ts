import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ContentManagementService } from '../../../core/services/content-management/content-management.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

  constructor(
    private contentService: ContentManagementService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.faqForm = this.fb.group({
      question: [''],
      answer: [''],
    });
    this.fetchFaqs();
  }

  fetchFaqs() {
    this.contentService.getAllFaqs({}).subscribe({
      next: (data) => {
        console.log(data);
        this.panels = data?.data.map((item: any) => ({
          id: item._id,
          active: false,
          disabled: false,
          name: item.faq,
          content: item.answer,
        }));
        console.log(this.panels);
      },
    });
  }

  addNew() {
    this.openFaqForm = true;
    this.isEdit = false;
  }

  editFaq(event: Event, id: string) {
    console.log(id);
    this.editFaqId = id;
    event.stopPropagation();
    this.openFaqForm = true;
    this.isEdit = true;
    this.contentService.getFaqById(id).subscribe({
      next: (data) => {
        console.log(data);
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
    console.log(id);
    event.stopPropagation();
    this.deleteFaqId = id;
    this.openDeleteModal = true;
    this.openFaqForm = false;
  }
  submitNewQuestion() {
    // Logic to submit new question here
    const formData = this.faqForm.value;
    const payload = {
      faq: formData.question,
      answer: formData.answer,
    };
    if (!this.isEdit) {
      this.contentService.createFaq(payload).subscribe({
        next: (data) => {
          console.log(data);
          if (data?.success) {
            this.messageService.success('FAQ created successfully');
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
          console.log(data);
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
    // Reset form
    this.faqForm.reset();
    this.openFaqForm = false;
  }

  handleDeleteFaq() {
    this.contentService.deleteFaq(this.deleteFaqId).subscribe({
      next: (data) => {
        console.log(data);
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
