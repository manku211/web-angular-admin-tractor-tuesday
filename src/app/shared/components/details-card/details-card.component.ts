import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { CountryHelperService } from '../../../utilities/helpers/country-helper.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details-card',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './details-card.component.html',
  styleUrl: './details-card.component.css',
})
export class DetailsCardComponent {
  @Input() userInfo: any;
  @Input() userBlockText: any;
  @Input() isUser: boolean = false;
  @Output() showBlockReason = new EventEmitter();
  constructor(public countryHelper: CountryHelperService) {
    console.log('dataaa');
  }
  ngOnInit() {
    console.log('data');
    console.log(this.userInfo);
  }

  displayBlockReason() {
    this.showBlockReason.emit();
  }
}
