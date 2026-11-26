import { ResolveFn, Routes } from '@angular/router';
import { Product } from './product';

const tabTitle = (label: string): ResolveFn<string> => (route) =>
  `${label} – ${(route.data['product'] as Product).title} | My Shop`;   // parent's data is inherited

export const PRODUCT_ROUTES: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },             // /products/5 → /products/5/overview
  { path: 'overview', loadComponent: () => import('./product-overview'), title: tabTitle('Overview') },
  { path: 'reviews', loadComponent: () => import('./product-reviews'), title: tabTitle('Reviews') },
  { path: 'specs', loadComponent: () => import('./product-specs'), title: tabTitle('Specs') },
];
