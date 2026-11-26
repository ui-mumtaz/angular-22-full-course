import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  template: `
    <h2 class="text-xl font-semibold">Admin dashboard</h2>
    <a class="mt-2 inline-block text-blue-600 hover:underline" routerLink="orders">Orders →</a>
  `,
})
export class AdminDashboard {}
