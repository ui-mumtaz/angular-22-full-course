import { Component, input } from '@angular/core';
import { Product } from './product';

@Component({
  selector: 'app-product-reviews',
  template: `
    <ul class="space-y-4">
      @for (review of product().reviews; track $index) {
        <li class="border-b border-slate-100 pb-4 last:border-0">
          <p class="text-amber-500">{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</p>
          <p class="text-slate-800">{{ review.comment }}</p>
          <p class="text-sm text-slate-500">– {{ review.reviewerName }}</p>
        </li>
      } @empty {
        <li class="text-slate-500">No reviews yet.</li>
      }
    </ul>
  `,
})
export default class ProductReviews {
  readonly product = input.required<Product>();
}
