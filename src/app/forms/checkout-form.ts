import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout-form',
  imports: [ReactiveFormsModule],
  template: `
    <h2 class="text-xl font-semibold">Checkout</h2>
    <form [formGroup]="form" (ngSubmit)="placeOrder()" class="mt-4 max-w-md space-y-3">
      <input formControlName="name" placeholder="Name" class="block w-full rounded-lg border border-slate-300 px-3 py-2" />
      @if (form.controls.name.touched && form.controls.name.hasError('minlength')) {
        <p class="text-sm text-red-600">At least 3 characters.</p>
      }
      <input formControlName="email" placeholder="Email" class="block w-full rounded-lg border border-slate-300 px-3 py-2" />

      <div formGroupName="address" class="grid grid-cols-2 gap-3">
        <input formControlName="city" placeholder="City" class="rounded-lg border border-slate-300 px-3 py-2" />
        <input formControlName="pin" placeholder="PIN code" class="rounded-lg border border-slate-300 px-3 py-2" />
      </div>
      @if (form.controls.address.controls.pin.hasError('pattern')) {
        <p class="text-sm text-red-600">PIN code: 6 digits.</p>
      }

      <input type="number" formControlName="qty" class="w-24 rounded-lg border border-slate-300 px-3 py-2" />
      <p class="font-semibold">Total: ₹{{ total() }}</p>

      <div class="flex flex-wrap gap-2">
        <button type="submit" [disabled]="form.invalid"
          class="rounded-lg bg-brand px-4 py-2 font-medium text-white disabled:opacity-40">Place order</button>
        <button type="button" (click)="toggleGift()" class="rounded-lg border border-slate-300 px-3 py-2">Gift (no email)</button>
        <button type="button" (click)="fillCity()" class="rounded-lg border border-slate-300 px-3 py-2">Fill city</button>
        <button type="button" (click)="form.reset()" class="rounded-lg border border-slate-300 px-3 py-2">Reset</button>
      </div>
    </form>
    @if (order()) {
      <p class="mt-4 text-sm text-green-700">Order: {{ order() }}</p>
    }
  `,
})
export default class CheckoutForm {
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    address: this.fb.group({
      city: ['', Validators.required],
      pin: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    }),
    qty: [1, [Validators.min(1), Validators.max(10)]],
  });

  private readonly qty = toSignal(this.form.controls.qty.valueChanges, { initialValue: 1 });
  protected readonly total = computed(() => this.qty() * 499);
  protected readonly order = signal('');

  protected placeOrder(): void {
    const order = this.form.getRawValue();     // fully typed, includes disabled fields
    this.order.set(JSON.stringify(order));          // Module 11: send it to the API
  }

  protected toggleGift(): void {
    const email = this.form.controls.email;
    email.disabled ? email.enable() : email.disable();
  }

  protected fillCity(): void {
    this.form.patchValue({ address: { city: 'Pune' } });
  }
}
