import { Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard';
import { AdminOrders } from './admin-orders';

export const ADMIN_ROUTES: Routes = [
  { path: '', component: AdminDashboard, title: 'Admin' },              // /admin
  { path: 'orders', component: AdminOrders, title: 'Admin – Orders' },  // /admin/orders
];
