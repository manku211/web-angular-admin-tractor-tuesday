import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { MessageService } from '../../core/services/message/message.service';
import { ProfileService } from '../../core/services/profile/profile.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  loading = false;
  avatarUrl?: string;
  selectedFile: any;
  constructor(
    private msg: MessageService,
    private profileService: ProfileService,
    private http: HttpClient
  ) {}

  handleChange({ file, fileList }: any): void {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.msg.error(`${file.name} file upload failed.`);
    }
    if (status === 'done') {
      const fileItem = fileList.find((f: any) => f.uid === file.uid);
      if (fileItem) {
        const uploadData = {
          fileName: fileItem.name,
          filePath: 'images',
          fileType: fileItem.type,
        };
        this.profileService.getPresignedUrl(uploadData).subscribe({
          next: (data) => {
            const { url } = data?.data;
            this.uploadFile(file.originFileObj, url);
          },
          error: (error) => {
            console.error('Error getting pre-signed URL:', error);
            this.msg.error('Failed to get pre-signed URL for upload.');
          },
        });
      }
    }
  }

  private uploadFile(file: any, url: any): void {
    console.log('Uploading file:', file);
    console.log('To URL:', url);

    this.profileService.uploadFile(url, file).subscribe((data) => {
      console.log('Upload', data);
    });
  }

  onFileSelected(event: any) {
    console.log(event);
    this.selectedFile = event.file;
  }

  onUpload() {
    const uploadData = {
      fileName: this.selectedFile.name,
      filePath: 'images',
      fileType: this.selectedFile.type,
    };
    this.profileService.getPresignedUrl(uploadData).subscribe({
      next: (data: any) => {
        if (data.data) {
          console.log(data);

          this.profileService
            .uploadFile(data?.data?.url, this.selectedFile?.originFileObj)
            .subscribe((data) => {
              this.loading = false;
            });
        } else if (data.errors) {
          // this.showError(data.errors[0].message);
        }
      },
      error: (e: any) => {
        // this.showError(e.message);
      },
    });
  }
}
