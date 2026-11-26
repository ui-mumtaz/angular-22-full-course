import { Component, signal } from '@angular/core';
import { FormField, debounce, form, minLength, pattern, required, validate, validateHttp } from '@angular/forms/signals';

interface Account {
  username: string;
  password: string;
  confirm: string;
  isBusiness: boolean;
  gst: string;
}

@Component({
  selector: 'app-account-form',
  imports: [FormField],
  template: `
    <h2 class="text-xl font-semibold">Create account</h2>
    <div class="mt-4 max-w-md space-y-2">
      <input [formField]="f.username" placeholder="Username" class="block w-full rounded-lg border border-slate-300 px-3 py-2" />
      @if (f.username().pending()) { <p class="text-sm text-slate-500">Checking…</p> }
      @for (e of f.username().errors(); track e.kind) { <p class="text-sm text-red-600">{{ e.message }}</p> }

      <input type="password" [formField]="f.password" placeholder="Password" class="block w-full rounded-lg border border-slate-300 px-3 py-2" />
      @for (e of f.password().errors(); track e.kind) { <p class="text-sm text-red-600">{{ e.message }}</p> }

      <input type="password" [formField]="f.confirm" placeholder="Confirm password" class="block w-full rounded-lg border border-slate-300 px-3 py-2" />
      @for (e of f.confirm().errors(); track e.kind) { <p class="text-sm text-red-600">{{ e.message }}</p> }

      <label class="flex items-center gap-2"><input type="checkbox" [formField]="f.isBusiness" /> Business account</label>
      <input [formField]="f.gst" placeholder="GST number" class="block w-full rounded-lg border border-slate-300 px-3 py-2" />
      @for (e of f.gst().errors(); track e.kind) { <p class="text-sm text-red-600">{{ e.message }}</p> }

      <p class="text-sm" [class.text-green-700]="f().valid()">{{ f().valid() ? '✓ Ready to create the account' : 'Please fix the fields above' }}</p>
    </div>
  `,
})
export default class AccountForm {
  protected readonly model = signal<Account>({ username: '', password: '', confirm: '', isBusiness: false, gst: '' });

  protected readonly f = form(this.model, (s) => {
    // 1. custom rule
    required(s.username, { message: 'Username is required.' });
    validate(s.username, ({ value }) =>
      /\s/.test(value()) ? { kind: 'noSpaces', message: 'No spaces allowed.' } : undefined);

    // 2. async (server) rule, after the user pauses
    debounce(s.username, 400);
    validateHttp(s.username, {
      request: ({ value }) => value().length >= 3
        ? `https://dummyjson.com/users/filter?key=username&value=${encodeURIComponent(value())}`
        : undefined,                                            // undefined → no request
      onSuccess: (res: { total: number }) =>
        res.total > 0 ? { kind: 'taken', message: 'This username is taken.' } : undefined,
      onError: () => ({ kind: 'checkFailed', message: 'Could not check the username.' }),
    });

    // built-in rules for the password
    minLength(s.password, 8, { message: 'At least 8 characters.' });
    pattern(s.password, /\d/, { message: 'Add at least one number.' });

    // 3. cross-field rule
    validate(s.confirm, ({ value, valueOf }) =>
      value() !== valueOf(s.password) ? { kind: 'mismatch', message: "Passwords don't match." } : undefined);

    // 4. conditional rule
    required(s.gst, { when: ({ valueOf }) => valueOf(s.isBusiness), message: 'GST number is required for businesses.' });
  });
}
