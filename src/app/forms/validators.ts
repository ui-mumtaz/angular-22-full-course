import { ValidatorFn } from '@angular/forms';

// The same ideas for reactive forms (Lesson 51)
export const noSpaces: ValidatorFn = (control) => (/\s/.test(control.value ?? '') ? { noSpaces: true } : null);

export const matchPasswords: ValidatorFn = (group) =>
  group.get('password')?.value === group.get('confirm')?.value ? null : { mismatch: true };
