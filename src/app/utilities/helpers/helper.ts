import { AbstractControl, ValidatorFn } from '@angular/forms';

export const styleObject = (status: any) => {
  if (status === 'ONGOING') {
    return { background: '#DED1F7', color: '#000' };
  }
  return {};
};

export const getExteriorImageUrl = (tractorData: any) => {
  if (tractorData && tractorData?.tractorId?.images) {
    const exteriorImage = tractorData?.tractorId?.images.find(
      (image: any) => image.type === 'All'
    );

    if (exteriorImage) {
      return exteriorImage.link;
    }
  }
  return '';
};

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const isValid = /^[0-9]{10,15}$/.test(value);
    return isValid
      ? null
      : {
          phoneNumber:
            'Phone number must be numeric and between 10 to 15 digits',
        };
  };
}
