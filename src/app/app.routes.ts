import { Routes } from '@angular/router';
import { HomePage, NotFoundPage, ProductsPage } from './pages';      // ⚠ no static import of AboutPage
import { ProductDetail } from './product-detail';
import { adminMatchGuard, authGuard } from './auth';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'My Shop – Home' },
  { path: 'products', component: ProductsPage, title: 'My Shop – Products' },
  { path: 'products/:id', component: ProductDetail, title: 'Product details' },   // :id = parameter
  { path: 'login', loadComponent: () => import('./login-page'), title: 'Login' },
  { path: 'about', loadComponent: () => import('./about-page'), canActivate: [authGuard], title: 'My Shop – About us' },   // logged-in only
  {
    path: 'admin',
    canMatch: [adminMatchGuard],                                    // NOT canActivate for lazy sections
    loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  { path: 'shop', redirectTo: 'products' },                              // old links still work
  { path: '**', component: NotFoundPage, title: 'Page not found' },      // ALWAYS last
];
