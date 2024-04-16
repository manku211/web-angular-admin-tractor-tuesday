import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.css',
})
export class TableViewComponent {
  @Input() data: any[] = [];
  @Input() showPagination: boolean = true;
  @Input() bordered: boolean = false;
}
