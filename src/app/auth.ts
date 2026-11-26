import { Service, computed, inject, signal } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';

export interface User {
  name: string;
  role: 'customer' | 'admin';
}

@Service()
export class AuthService {
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();
  readonly isLoggedIn = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  login(name: string, role: User['role']): void {
    this._user.set({ name, role });          // fake for now: real JWT login in Module 18
  }

  logout(): void {
    this._user.set(null);
  }
}

// Pages: logged-in users only; otherwise → /login?returnUrl=…
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

// Lazy sections: admins only, decided BEFORE the section's code is downloaded
export const adminMatchGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAdmin()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: '/admin' } });
};
