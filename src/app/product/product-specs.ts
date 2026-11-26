import { Component, input } from '@angular/core';
import { Product } from './product';

@Component({
  selector: 'app-product-specs',
  template: `
    <dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
      <dt class="font-medium text-slate-500">Brand</dt>     <dd>{{ product().brand ?? '–' }}</dd>
      <dt class="font-medium text-slate-500">SKU</dt>       <dd class="font-mono">{{ product().sku }}</dd>
      <dt class="font-medium text-slate-500">Weight</dt>    <dd>{{ product().weight }} g</dd>
      <dt class="font-medium text-slate-500">Warranty</dt>  <dd>{{ product().warrantyInformation }}</dd>
      <dt class="font-medium text-slate-500">Shipping</dt>  <dd>{{ product().shippingInformation }}</dd>
    </dl>
  `,
})
export default class ProductSpecs {
  readonly product = input.required<Product>();
}
