import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { ProductDetail } from './product-detail';

describe('ProductDetail (/products/:id)', () => {
  const realFetch = globalThis.fetch;

  beforeEach(() => {
    // Fake dummyjson.com so the test never needs the network.
    globalThis.fetch = (async (url: string | URL | Request) => {
      const id = Number(String(url).split('/').pop());
      return new Response(JSON.stringify({ id, title: `Product ${id}`, price: id * 10 }));
    }) as typeof fetch;
    TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding())] });
  });

  afterEach(() => (globalThis.fetch = realFetch));

  it('receives :id as a number and loads that product', async () => {
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/products/1', ProductDetail);
    expect(page.id()).toBe(1);
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement?.textContent).toContain('Product 1 – 10');
  });

  it('uses a safe default when ?tab= is missing', async () => {
    const harness = await RouterTestingHarness.create();
    const page = await harness.navigateByUrl('/products/1', ProductDetail);
    expect(page.tab()).toBeUndefined();          // the router sets missing params to undefined
    expect(harness.routeNativeElement?.textContent).toContain('Tab: details');
  });

  it('reuses the component when only the id changes', async () => {
    const harness = await RouterTestingHarness.create();
    const first = await harness.navigateByUrl('/products/1', ProductDetail);
    const second = await harness.navigateByUrl('/products/2?tab=reviews', ProductDetail);
    expect(second).toBe(first);
    expect(second.id()).toBe(2);
    expect(second.tab()).toBe('reviews');
  });
});
