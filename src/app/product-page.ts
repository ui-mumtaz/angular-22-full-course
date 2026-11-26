import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from './product-resolvers';

@Component({
  selector: 'app-product-page',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <article class="max-w-xl space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 class="text-3xl font-bold">{{ product().title }}</h2>
      <p class="text-xl font-semibold text-brand">{{ product().price | currency: 'INR' }}</p>
      <p class="text-slate-600">{{ product().description }}</p>
    </article>
    <a class="mt-4 inline-block text-blue-600 hover:underline" [routerLink]="['/products', product().id + 1]">Next product →</a>
  `,
})
export default class ProductPage {
  readonly product = input.required<Product>();   // filled by the resolver, never undefined
}
