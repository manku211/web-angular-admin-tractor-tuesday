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
  sortDirections?: NzTableSortOrder[] | undefined;
  filter?: boolean;
  listOfFilter?: any;
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
  @Input() tableRowTemplate!: TemplateRef<any>;
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
    // Subscribe to value changes of the search input and emit the event after debouncing
    console.log(this.searchInput);
    this.searchInput.valueChanges
      .pipe(debounceTime(300))
      .subscribe((searchText: any) => {
        // Emit the search event
        console.log(searchText);
        this.search.emit(searchText);
      });
  }

  onSortChange(column: TableColumn): void {
    console.log(column);

    this.columns.forEach((col) => {
      if (col !== column) {
        col.sortOrder = null;
      }
    });

    column.sortOrder = column.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    this.sortChange.emit(column);
  }

  onFilterHandler(column: TableColumn, event: any): void {
    console.log(column, event);

    this.filteredList.emit({ column: column, event: event });
  }

  onPageIndexChange(pageIndex: number): void {
    console.log('Page index changed to:', pageIndex);
    this.pageChange.emit(pageIndex);
  }
}
