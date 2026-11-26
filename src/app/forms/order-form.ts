import { Component, computed, signal } from '@angular/core';
import { FormField, applyEach, form, min, required } from '@angular/forms/signals';

interface Line { product: string; qty: number; }
interface Order { customer: string; lines: Line[]; }

@Component({
  selector: 'app-order-form',
  imports: [FormField],
  template: `
    <h2 class="text-xl font-semibold">Order</h2>
    <input [formField]="order.customer" class="mt-2 block rounded-lg border border-slate-300 px-3 py-2" />

    @for (line of order.lines; track $index; let i = $index) {
      <div class="mt-2 flex items-center gap-2">
        <input [formField]="line.product" placeholder="Product" class="rounded-lg border border-slate-300 px-3 py-2" />
        <input type="number" [formField]="line.qty" class="w-20 rounded-lg border border-slate-300 px-3 py-2" />
        <button type="button" (click)="removeLine(i)" class="text-slate-500 hover:text-red-600" aria-label="Remove line">✕</button>
        @for (e of line.product().errors(); track e.kind) { <span class="text-sm text-red-600">{{ e.message }}</span> }
        @for (e of line.qty().errors(); track e.kind) { <span class="text-sm text-red-600">{{ e.message }}</span> }
      </div>
    }

    <button type="button" (click)="addLine()" class="mt-3 text-blue-600 hover:underline">+ Add line</button>
    <p class="summary mt-2 text-sm text-slate-600">{{ lineCount() }} lines · {{ totalQty() }} items · valid={{ order().valid() }}</p>
  `,
})
export default class OrderForm {
  protected readonly model = signal<Order>({ customer: 'Aisha', lines: [{ product: 'Red Nail Polish', qty: 1 }] });

  protected readonly order = form(this.model, (o) => {
    required(o.customer);
    applyEach(o.lines, (line) => {                       // rules for EVERY line, now and later
      required(line.product, { message: 'Product is required.' });
      min(line.qty, 1, { message: 'At least 1.' });
    });
  });

  protected readonly lineCount = computed(() => this.model().lines.length);
  protected readonly totalQty = computed(() => this.model().lines.reduce((sum, l) => sum + l.qty, 0));

  protected addLine(): void {
    this.model.update((m) => ({ ...m, lines: [...m.lines, { product: '', qty: 1 }] }));
  }

  protected removeLine(i: number): void {
    this.model.update((m) => ({ ...m, lines: m.lines.filter((_, idx) => idx !== i) }));
  }
}
