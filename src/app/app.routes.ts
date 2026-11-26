import { Routes } from '@angular/router';
import { AboutPage, HomePage, NotFoundPage, ProductsPage } from './pages';
import { ProductDetail } from './product-detail';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'My Shop – Home' },
  { path: 'products', component: ProductsPage, title: 'My Shop – Products' },
  { path: 'products/:id', component: ProductDetail, title: 'Product details' },   // :id = parameter
  { path: 'about', component: AboutPage, title: 'My Shop – About us' },
  { path: 'shop', redirectTo: 'products' },                              // old links still work
  { path: '**', component: NotFoundPage, title: 'Page not found' },      // ALWAYS last
];
