import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth';

@Component({
  selector: 'app-login-page',
  template: `
    <h2 class="text-xl font-semibold">Login</h2>
    <div class="mt-3 flex gap-3">
      <button class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100" (click)="login('customer')">Log in as customer</button>
      <button class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100" (click)="login('admin')">Log in as admin</button>
    </div>
  `,
})
export default class LoginPage {
  readonly returnUrl = input<string>();          // from ?returnUrl=… (input binding, Lesson 43)
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected login(role: 'customer' | 'admin'): void {
    this.auth.login(role === 'admin' ? 'Mumtaz' : 'Aisha', role);
    this.router.navigateByUrl(this.returnUrl() ?? '/');
  }
}
