import { Component, computed, inject, input, numberAttribute, resource } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface Product { id: number; title: string; price: number; }

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  template: `
    @if (product.hasValue()) {
      <h2 class="text-xl font-semibold">{{ product.value().title }} – {{ product.value().price }}</h2>
    } @else if (product.isLoading()) {
      <p class="animate-pulse text-slate-500">Loading…</p>
    } @else if (product.error()) {
      <p class="text-red-600">Could not load product {{ id() }}.</p>
    }
    <p class="my-2 text-sm text-slate-500">Tab: {{ activeTab() }}</p>

    <div class="flex items-center gap-4">
      <a class="text-blue-600 hover:underline" [routerLink]="['/products', id() + 1]">Next product →</a>
      <a class="text-blue-600 hover:underline" [routerLink]="[]" [queryParams]="{ tab: 'reviews' }">Reviews</a>
      <button class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100" (click)="backToList()">
        Back to list
      </button>
    </div>
  `,
})
export class ProductDetail {
  readonly id = input.required({ transform: numberAttribute });   // from /products/:id
  readonly tab = input<string>();                                  // from ?tab=… (may be undefined!)
  protected readonly activeTab = computed(() => this.tab() ?? 'details');   // safe default

  private readonly router = inject(Router);

  protected readonly product = resource({
    params: () => this.id(),                                        // reloads when the id changes
    loader: async ({ params, abortSignal }) => {
      const res = await fetch(`https://dummyjson.com/products/${params}`, { signal: abortSignal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as Product;
    },
  });

  protected backToList(): void {
    this.router.navigate(['/products'], { queryParams: { from: this.id() } });
  }
}
