import { Routes } from '@angular/router';
import { HomePage, NotFoundPage, ProductsPage } from './pages';      // ⚠ no static import of AboutPage
import { productResolver, productTitleResolver } from './product-resolvers';
import { adminMatchGuard, authGuard } from './auth';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'My Shop – Home' },
  { path: 'products', component: ProductsPage, title: 'My Shop – Products' },
  {
    path: 'products/:id',
    loadComponent: () => import('./product-page'),
    resolve: { product: productResolver },   // key "product" → input "product"
    title: productTitleResolver,             // the browser tab title, resolved too
  },
  { path: 'login', loadComponent: () => import('./login-page'), title: 'Login' },
  { path: 'about', loadComponent: () => import('./about-page'), canActivate: [authGuard], title: 'My Shop – About us' },   // logged-in only
  {
    path: 'admin',
    canMatch: [adminMatchGuard],                                    // NOT canActivate for lazy sections
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  { path: 'shop', redirectTo: 'products' },                              // old links still work
  { path: 'not-found', component: NotFoundPage, title: 'Page not found' },
  { path: '**', component: NotFoundPage, title: 'Page not found' },      // ALWAYS last
];
