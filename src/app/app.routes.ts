import { Routes } from '@angular/router';
import { HomePage, NotFoundPage, ProductsPage } from './pages';      // ⚠ no static import of AboutPage
import { ProductDetail } from './product-detail';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'My Shop – Home' },
  { path: 'products', component: ProductsPage, title: 'My Shop – Products' },
  { path: 'products/:id', component: ProductDetail, title: 'Product details' },   // :id = parameter
  { path: 'about', loadComponent: () => import('./about-page'), title: 'My Shop – About us' },   // lazy
  { path: 'shop', redirectTo: 'products' },                              // old links still work
  { path: '**', component: NotFoundPage, title: 'Page not found' },      // ALWAYS last
];
