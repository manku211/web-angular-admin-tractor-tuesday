import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private message: NzMessageService) {}

  success(message: string): void {
    this.message.success(message);
  }

  error(message: string): void {
    this.message.error(message);
  }

  warning(message: string): void {
    this.message.warning(message);
  }

  info(message: string): void {
    this.message.info(message);
  }
}
