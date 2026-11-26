import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { AuthService } from './auth';

describe('route guards', () => {
  let router: Router;
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding())] });
    router = TestBed.inject(Router);
    auth = TestBed.inject(AuthService);
  });

  it('sends logged-out users to /login with a returnUrl', async () => {
    await RouterTestingHarness.create('/about');
    expect(router.url).toBe('/login?returnUrl=%2Fabout');
  });

  it('lets a logged-in customer open About', async () => {
    auth.login('Aisha', 'customer');
    await RouterTestingHarness.create('/about');
    expect(router.url).toBe('/about');
  });

  it('keeps customers out of the admin section (canMatch)', async () => {
    auth.login('Aisha', 'customer');
    await RouterTestingHarness.create('/admin');
    expect(router.url).toBe('/login?returnUrl=%2Fadmin');
  });

  it('lets admins into the admin section', async () => {
    auth.login('Mumtaz', 'admin');
    const harness = await RouterTestingHarness.create('/admin');
    expect(router.url).toBe('/admin');
    expect(harness.routeNativeElement?.textContent).toContain('Admin dashboard');
  });

  it('returns to the page the user wanted after logging in', async () => {
    const harness = await RouterTestingHarness.create('/about');
    const buttons = harness.routeNativeElement!.querySelectorAll('button');
    (buttons[0] as HTMLButtonElement).click();                 // Log in as customer
    await harness.fixture.whenStable();
    expect(router.url).toBe('/about');
  });
});
