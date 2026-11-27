import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function belarusPhoneValidator(): ValidatorFn {
  const regex = /^375\d{9}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const clearPhone = control.value.replace(/\D/g, '');

    const isValid = regex.test(String(clearPhone));
    return isValid ? null : { belarusPhone: true };
  };
}

export function hasUpperAndDigitValidator(): ValidatorFn {
  const letters = /[A-Z]/;
  const numbers = /\d/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const isValid = letters.test(value) && numbers.test(value);
    return isValid ? null : { upperAndDigit: true };
  };
}

export function hasSpecialCharValidator(): ValidatorFn {
  const regex = /[!@#$%_]/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const isValid = regex.test(value);
    return isValid ? null : { specialChar: true };
  };
}
