import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { SharedModule } from '../../shared.module';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NzTableFilterList,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';
import { NzJustify } from 'ng-zorro-antd/flex';
import { debounceTime } from 'rxjs';

interface TableColumn {
  key: string;
  label: string;
  sort: boolean;
  sortOrder?: NzTableSortOrder | undefined;
  sortFn?: NzTableSortFn<any> | undefined;
  sortDirections?: any;
  filter?: boolean;
  listOfFilter?: any;
  isMultiple?: boolean;
}

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
  templateUrl: './table-view.component.html',
  styleUrl: './table-view.component.css',
})
export class TableViewComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() enablePagination: boolean = false;
  @Input() enableSorting: boolean = false;
  @Input() enableSearch: boolean = false;
  @Input() enableActions: boolean = false;
  @Input() loader: boolean = false;
  @Input() totalRecords: number = 0;
  @Input() isDetailTable: boolean = false;
  @Input() isHeader: boolean = false;
  @Input() isBordered: boolean = true;
  @Input() tableRowTemplate!: TemplateRef<any>;
  @Input() tableTitleTemplate!: TemplateRef<any>;
  @Output() sortChange: EventEmitter<TableColumn> =
    new EventEmitter<TableColumn>();
  @Output() filteredList: EventEmitter<{
    column: TableColumn;
    event: any;
  }> = new EventEmitter();
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  searchInput = new FormControl('');

  constructor() {
    this.searchInput.valueChanges
      .pipe(debounceTime(300))
      .subscribe((searchText: any) => {
        this.search.emit(searchText);
      });
  }

  onSortChange(column: TableColumn, event: any): void {
    this.columns.forEach((col) => {
      if (col !== column) {
        col.sortOrder = null;
      }
    });

    column.sortOrder =
      event === 'ascend' ? 'ASC' : event === 'descend' ? 'DESC' : null;
    this.sortChange.emit(column);
  }

  onFilterHandler(column: TableColumn, event: any): void {
    this.filteredList.emit({ column: column, event: event });
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageChange.emit(pageIndex);
  }
}
