import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { CountryHelperService } from '../../../utilities/helpers/country-helper.service';
import { CommonModule } from '@angular/common';
import { Privileges } from '../../../core/models/rolePrivileges';
import { PrivilegeDirective } from '../../../core/directives/privilege.directive';

@Component({
  selector: 'app-details-card',
  standalone: true,
  imports: [SharedModule, CommonModule, PrivilegeDirective],
  templateUrl: './details-card.component.html',
  styleUrl: './details-card.component.css',
})
export class DetailsCardComponent {
  @Input() userInfo: any;
  @Input() userBlockText: any;
  @Input() isUser: boolean = false;
  @Output() showBlockReason = new EventEmitter();
  privileges = Privileges;
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
