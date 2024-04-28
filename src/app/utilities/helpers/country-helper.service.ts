import { Injectable } from '@angular/core';
import { countryCodes } from '../../core/models/countryCodes';

@Injectable({
  providedIn: 'root',
})
export class CountryHelperService {
  countryCodes = countryCodes;
  constructor() {}
  getFlag(dialCode: string): string {
    const country = this.countryCodes.find(
      (code) => code.dialCode === dialCode
    );
    return country ? country.flag : '';
  }

  getCountryName(dialCode: string): string {
    const country = this.countryCodes.find(
      (code) => code.dialCode === dialCode
    );
    return country ? country.countryName : '';
  }
}
