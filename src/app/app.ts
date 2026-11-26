import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="flex gap-6 border-b border-slate-200 px-6 pt-4">
      <a class="px-1 text-slate-700 hover:text-slate-900" routerLink="/"
        routerLinkActive="font-semibold underline decoration-brand decoration-2 underline-offset-8" [routerLinkActiveOptions]="{ exact: true }">Home</a>
      <a class="px-1 text-slate-700 hover:text-slate-900" routerLink="/products"
        routerLinkActive="font-semibold underline decoration-brand decoration-2 underline-offset-8">Products</a>
      <a class="px-1 text-slate-700 hover:text-slate-900" routerLink="/about"
        routerLinkActive="font-semibold underline decoration-brand decoration-2 underline-offset-8">About</a>
      <a class="px-1 text-slate-700 hover:text-slate-900" routerLink="/admin"
        routerLinkActive="font-semibold underline decoration-brand decoration-2 underline-offset-8">Admin</a>
    </nav>
    <main class="p-6">
      <router-outlet />            <!-- the matching page appears here -->
    </main>
  `,
})
export class App {}
