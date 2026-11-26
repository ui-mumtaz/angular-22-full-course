import { Component, signal } from '@angular/core';
import { FormField, FormRoot, email, form, minLength, required } from '@angular/forms/signals';

interface Signup {
  name: string;
  email: string;
  age: number;
  terms: boolean;
}

@Component({
  selector: 'app-signup-form',
  imports: [FormField, FormRoot],
  template: `
    <h2 class="text-xl font-semibold">Sign up</h2>
    <form [formRoot]="signupForm" class="mt-4 max-w-md space-y-3">
      <input [formField]="signupForm.name" placeholder="Name"
        class="block w-full rounded-lg border border-slate-300 px-3 py-2" />
      @if (signupForm.name().touched() && signupForm.name().invalid()) {
        @for (e of signupForm.name().errors(); track e.kind) {
          <p class="text-sm text-red-600">{{ e.message }}</p>
        }
      }

      <input type="email" [formField]="signupForm.email" placeholder="Email"
        class="block w-full rounded-lg border border-slate-300 px-3 py-2" />
      @if (signupForm.email().touched() && signupForm.email().invalid()) {
        @for (e of signupForm.email().errors(); track e.kind) {
          <p class="text-sm text-red-600">{{ e.message }}</p>
        }
      }

      <input type="number" [formField]="signupForm.age"
        class="w-24 rounded-lg border border-slate-300 px-3 py-2" />
      <label class="flex items-center gap-2">
        <input type="checkbox" [formField]="signupForm.terms" /> I accept the terms
      </label>

      <div class="flex gap-2">
        <button type="submit" [disabled]="signupForm().invalid() || signupForm().submitting()"
          class="rounded-lg bg-brand px-4 py-2 font-medium text-white disabled:opacity-40">
          {{ signupForm().submitting() ? 'Saving…' : 'Create account' }}
        </button>
        <button type="button" (click)="loadRavi()" class="rounded-lg border border-slate-300 px-3 py-2">Load Ravi</button>
      </div>
    </form>
    @if (saved()) {
      <p class="mt-4 text-sm text-green-700">Saved: {{ saved() }}</p>
    }
  `,
})
export default class SignupForm {
  protected readonly model = signal<Signup>({ name: '', email: '', age: 18, terms: false });
  protected readonly saved = signal('');

  protected readonly signupForm = form(
    this.model,
    (s) => {
      required(s.name, { message: 'Name is required.' });
      minLength(s.name, 3, { message: 'At least 3 characters.' });
      required(s.email, { message: 'Email is required.' });
      email(s.email, { message: 'Not a valid email.' });
      required(s.terms, { message: 'Please accept the terms.' });
    },
    {
      submission: {
        action: async (f) => {
          await new Promise((r) => setTimeout(r, 800));   // pretend to call the server (Module 11: a real API)
          this.saved.set(JSON.stringify(f().value()));
          return undefined;
        },
      },
    },
  );

  protected loadRavi(): void {
    this.model.set({ name: 'Ravi', email: 'ravi@example.com', age: 30, terms: true });   // every input updates
  }
}
