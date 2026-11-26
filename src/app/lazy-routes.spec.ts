import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('lazy routes', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter(routes)] }));

  it('loads the About page with loadComponent', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/about');
    expect(harness.routeNativeElement?.textContent).toContain('About us');
  });

  it('loads the admin section with loadChildren (relative child paths)', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/admin');
    expect(harness.routeNativeElement?.textContent).toContain('Admin dashboard');
    await harness.navigateByUrl('/admin/orders');
    expect(harness.routeNativeElement?.textContent).toContain('Admin: orders');
  });
});
