import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { routes } from './app.routes';

const product = (id: number) => ({
  id, title: `Product ${id}`, price: id * 10, description: `About product ${id}`,
  brand: 'Nail Couture', sku: `SKU-${id}`, weight: 8, warrantyInformation: '1 year', shippingInformation: '2 days',
  reviews: [{ rating: 2, comment: 'Poor quality!', reviewerName: 'Benjamin Wilson' }, { rating: 5, comment: 'Great', reviewerName: 'A' }, { rating: 4, comment: 'Good', reviewerName: 'B' }],
});

describe('product resolver + nested tabs (/products/:id/…)', () => {
  const realFetch = globalThis.fetch;
  let mode: 'ok' | 'down' = 'ok';
  let calls = 0;

  beforeEach(() => {
    mode = 'ok';
    calls = 0;
    // Fake dummyjson.com: id 99999 is a 404, 'down' simulates a network failure.
    globalThis.fetch = (async (url: string | URL | Request) => {
      calls++;
      if (mode === 'down') throw new TypeError('Failed to fetch');
      const id = Number(String(url).split('/').pop()?.split('?')[0]);
      if (id === 99999) return new Response('{}', { status: 404 });
      return new Response(JSON.stringify(product(id)));
    }) as typeof fetch;
    TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding())] });
  });

  afterEach(() => (globalThis.fetch = realFetch));

  it('redirects /products/5 to the default Overview tab, already filled', async () => {
    const harness = await RouterTestingHarness.create('/products/5');
    expect(TestBed.inject(Router).url).toBe('/products/5/overview');
    expect(harness.routeNativeElement?.textContent).toContain('Product 5');
    expect(harness.routeNativeElement?.textContent).toContain('About product 5');
  });

  it('children inherit the resolved product (Reviews tab + tab title)', async () => {
    const harness = await RouterTestingHarness.create('/products/5/reviews');
    expect(harness.routeNativeElement?.textContent).toContain('Poor quality!');
    expect(TestBed.inject(Title).getTitle()).toBe('Reviews – Product 5 | My Shop');
  });

  it('does not run the parent resolver again when switching tabs', async () => {
    const harness = await RouterTestingHarness.create('/products/5/overview');
    const before = calls;
    await harness.navigateByUrl('/products/5/specs');
    expect(calls).toBe(before);
    expect(harness.routeNativeElement?.textContent).toContain('SKU-5');
  });

  it('redirects a missing product (404) to /not-found', async () => {
    await RouterTestingHarness.create('/products/99999');
    expect(TestBed.inject(Router).url).toBe('/not-found');
  });

  it('redirects instead of throwing when the network is down', async () => {
    mode = 'down';
    await RouterTestingHarness.create('/products/5');
    expect(TestBed.inject(Router).url).toBe('/not-found');
  });

  it('an unknown tab falls through to the app 404', async () => {
    const harness = await RouterTestingHarness.create('/products/5/xyz');
    expect(harness.routeNativeElement?.textContent).toContain('Page not found');
  });
});
