import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from './product';

@Component({
  selector: 'app-product-overview',
  imports: [RouterLink],
  template: `
    <p class="text-slate-700">{{ product().description }}</p>
    <a routerLink="../reviews" class="mt-4 inline-block text-blue-600 hover:underline">
      Read {{ product().reviews.length }} reviews →
    </a>
  `,
})
export default class ProductOverview {
  readonly product = input.required<Product>();          // inherited from the parent's resolver
}
