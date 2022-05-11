import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const hashSymbolValidator =
  (): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const { value } = control;

    if (!value) {
      return null;
    }

    return value.includes('#') ? { hashSymbol: true } : null;
  };
