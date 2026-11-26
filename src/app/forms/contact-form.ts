import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  imports: [FormsModule],
  styleUrl: './contact-form.scss',
  template: `
    <h2 class="text-xl font-semibold">Contact us</h2>
    <form #f="ngForm" (ngSubmit)="send(f)" class="mt-4 max-w-md space-y-4">
      <label class="block">
        <span class="text-sm font-medium">Name</span>
        <input name="name" [(ngModel)]="name" required minlength="3" #nameCtrl="ngModel"
          class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
      @if (nameCtrl.invalid && nameCtrl.touched) {
        <p class="text-sm text-red-600">
          @if (nameCtrl.errors?.['required']) { Name is required. }
          @if (nameCtrl.errors?.['minlength']) {
            At least 3 characters ({{ nameCtrl.errors?.['minlength'].actualLength }}/3).
          }
        </p>
      }

      <label class="block">
        <span class="text-sm font-medium">Email</span>
        <input name="email" type="email" [(ngModel)]="email" required email #emailCtrl="ngModel"
          class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
      @if (emailCtrl.invalid && emailCtrl.touched) {
        <p class="text-sm text-red-600">Please enter a valid email.</p>
      }

      <label class="flex items-center gap-2">
        <input name="newsletter" type="checkbox" [(ngModel)]="newsletter" /> Send me the newsletter
      </label>

      <button type="submit" [disabled]="f.invalid"
        class="rounded-lg bg-brand px-4 py-2 font-medium text-white disabled:opacity-40">Send</button>
    </form>
    @if (sent()) {
      <p class="mt-4 text-sm text-green-700">Thanks! We received: {{ sent() }}</p>
    }
  `,
})
export default class ContactForm {
  protected readonly name = signal('');
  protected readonly email = signal('');
  protected readonly newsletter = signal(false);
  protected readonly sent = signal('');

  protected send(f: NgForm): void {
    this.sent.set(JSON.stringify(f.value));       // Module 11: send it to a real API
    f.resetForm({ name: '', email: '', newsletter: false });
  }
}
