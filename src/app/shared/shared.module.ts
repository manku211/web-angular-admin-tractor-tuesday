import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';

const modules = [ NzButtonModule, NzIconModule, NzLayoutModule, NzMenuModule, NzGridModule, NzFormModule, NzInputModule, NzCheckboxModule, NzCardModule]
@NgModule({
  imports: [CommonModule, RouterOutlet, ...modules],
  exports: [CommonModule, RouterOutlet, ...modules],
  declarations: [],
})
export class SharedModule {}
