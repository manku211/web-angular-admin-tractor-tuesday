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
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

const modules = [
  NzButtonModule,
  NzIconModule,
  NzLayoutModule,
  NzMenuModule,
  NzGridModule,
  NzFormModule,
  NzInputModule,
  NzCheckboxModule,
  NzCardModule,
  NzTableModule,
  NzDividerModule,
  NzPaginationModule,
  NzFlexModule,
  NzBreadCrumbModule,
  NzSpaceModule,
  NzModalModule,
  NzRadioModule,
  NzTabsModule,
];
@NgModule({
  imports: [CommonModule, RouterOutlet, ...modules],
  exports: [CommonModule, RouterOutlet, ...modules],
  declarations: [],
})
export class SharedModule {}
