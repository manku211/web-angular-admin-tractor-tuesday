import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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

export function minMaxValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const minFees = parseFloat(control.get('minFees')?.value);
    const maxFees = parseFloat(control.get('maxFees')?.value);

    return minFees !== null && maxFees !== null && minFees >= maxFees
      ? { minMaxInvalid: true }
      : null;
  };
}

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

export const getStatusStyles = (
  status: string
): {
  'background-color': string;
  color: string;
  'border-radius': string;
  padding: string;
  'font-size': string;
} => {
  const styles: {
    [key: string]: { 'background-color': string; color: string };
  } = {
    'NOT STARTED': { 'background-color': '#CFFCF2', color: '#089171' },
    ONGOING: { 'background-color': '#DED1F7', color: '#4D20A3' },
    ENDED: { 'background-color': '#5E2EBA', color: '#FFF' },
    DENIED: { 'background-color': '#E57373', color: '#FFF' },
    COMPLETED: { 'background-color': '#81C784', color: '#FFF' },
  };
  return (
    {
      ...styles[status],
      'border-radius': '12px',
      padding: '4px 9px',
      'font-size': '12px',
    } || {
      'background-color': '#FFF',
      color: '#000',
      'border-radius': '12px',
      padding: '4px 9px',
      'font-size': '12px',
    }
  );
};
