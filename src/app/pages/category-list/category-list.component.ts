import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { MessageService } from '../../core/services/message/message.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../core/services/category/category.service';
import { TableViewComponent } from '../../shared/components/table-view/table-view.component';
import { CommonModule } from '@angular/common';
import { CountryHelperService } from '../../utilities/helpers/country-helper.service';

interface Category {
  _id: string;
  categoryName: string;
  country: string;
  numberOfBidder: string;
  auctionDate: Date;
}

interface ColumnInfo {
  key: string;
  label: string;
  sort: boolean;
  sortOrder?: string;
  type?: string;
}

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [TableViewComponent, CommonModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent {
  listOfData: Category[] = [];
  loader: boolean = false;
  totalRecords: number = 0;
  listOfColumns: ColumnInfo[] = [
    {
      key: 'categoryName',
      label: 'Category Name',
      sort: false,
      sortOrder: 'DESC',
    },
    {
      key: 'country',
      label: 'Country',
      sort: false,
    },
    {
      key: 'noOfBidder',
      label: 'Number Of Bidders',
      sort: false,
    },
  ];

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private categoryService: CategoryService,
    public countryHelper: CountryHelperService
  ) {}
  ngOnInit() {
    this.fetchDetails();
  }

  fetchDetails() {
    this.loader = true;
    this.categoryService.getCategoryList().subscribe((res) => {
      console.log('Response', res?.data);
      this.loader = false;
      this.listOfData = res.data;
    });
  }

  handleViewMore(category: any) {
    console.log(category);
    localStorage.setItem('selectedUserId', category);
    this.router.navigate(['/dashboard/category-listing/category-details']);
  }
}
