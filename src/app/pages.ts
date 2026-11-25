import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({ selector: 'app-home-page', template: `<h2 class="text-xl font-semibold">Home</h2><p class="mt-2 text-slate-600">Welcome to My Shop.</p>` })
export class HomePage {}

@Component({ selector: 'app-products-page', template: `<h2 class="text-xl font-semibold">Products</h2><p class="mt-2 text-slate-600">All our products.</p>` })
export class ProductsPage {}

@Component({ selector: 'app-about-page', template: `<h2 class="text-xl font-semibold">About us</h2>` })
export class AboutPage {}

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `<h2 class="text-xl font-semibold">Page not found (404)</h2><a class="text-blue-600 hover:underline" routerLink="/">Go to Home</a>`,
})
export class NotFoundPage {}
