import { Routes } from '@angular/router';
import { HomePage, NotFoundPage, ProductsPage } from './pages';      // ⚠ no static import of AboutPage
import { productResolver } from './product-resolvers';
import { PRODUCT_ROUTES } from './product/product.routes';
import { adminMatchGuard, authGuard } from './auth';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'My Shop – Home' },
  { path: 'products', component: ProductsPage, title: 'My Shop – Products' },
  {
    path: 'products/:id',
    loadComponent: () => import('./product/product-layout'),   // was: ./product-page (Lesson 46)
    resolve: { product: productResolver },                     // runs once for the layout + all tabs
    children: PRODUCT_ROUTES,                                  // titles now live on the children
  },
  { path: 'checkout', loadComponent: () => import('./forms/checkout-form'), title: 'My Shop – Checkout' },
  { path: 'signup', loadComponent: () => import('./forms/signup-form'), title: 'My Shop – Sign up' },
  { path: 'create-account', loadComponent: () => import('./forms/account-form'), title: 'My Shop – Create account' },
  { path: 'order', loadComponent: () => import('./forms/order-form'), title: 'My Shop – Order' },
  { path: 'survey', loadComponent: () => import('./forms/survey-form'), title: 'My Shop – Survey' },
  { path: 'contact', loadComponent: () => import('./forms/contact-form'), title: 'My Shop – Contact us' },
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
