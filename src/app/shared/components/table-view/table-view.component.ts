import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';

interface TableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [SharedModule, FormsModule],
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

  // Events
  @Output() sortChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() actionClick: EventEmitter<any> = new EventEmitter<any>();

  // Pagination
  currentPage: number = 1;

  // Sorting
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Search
  searchText: string = '';

  // Methods
  onPageChange(page: number) {
    this.currentPage = page;
    this.pageChange.emit(page);
  }

  onSort(key: string) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({ key: this.sortKey, direction: this.sortDirection });
  }

  onSearch() {
    this.searchChange.emit(this.searchText);
  }

  onActionClick(data: any) {
    this.actionClick.emit(data);
  }
}
