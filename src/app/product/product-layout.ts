import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Product } from './product';

@Component({
  selector: 'app-product-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CurrencyPipe],
  template: `
    <a routerLink="/products" class="text-sm text-slate-500 hover:text-slate-900">← All products</a>

    <article class="mt-2 max-w-2xl rounded-xl border border-slate-200 bg-white shadow-sm">
      <header class="px-6 pt-6">
        <h2 class="text-3xl font-bold">{{ product().title }}</h2>
        <p class="text-xl font-semibold text-brand">{{ product().price | currency: 'INR' }}</p>

        <nav class="mt-4 flex gap-6 border-b border-slate-200">
          @for (tab of tabs; track tab.path) {
            <a [routerLink]="tab.path" class="pb-3 text-slate-700 hover:text-slate-900"
              routerLinkActive="font-semibold underline decoration-brand decoration-2 underline-offset-8">
              {{ tab.label }}
            </a>
          }
        </nav>
      </header>

      <section class="p-6">
        <router-outlet />            <!-- the active tab (child route) appears here -->
      </section>
    </article>

    <a [routerLink]="['/products', product().id + 1]" class="mt-4 inline-block text-blue-600 hover:underline">
      Next product →
    </a>
  `,
})
export default class ProductLayout {
  readonly product = input.required<Product>();          // resolved ONCE for the whole layout
  protected readonly tabs = [
    { path: 'overview', label: 'Overview' },
    { path: 'reviews', label: 'Reviews' },
    { path: 'specs', label: 'Specs' },
  ];
}
