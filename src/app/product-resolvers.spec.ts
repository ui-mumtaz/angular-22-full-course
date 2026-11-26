import { TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Title } from '@angular/platform-browser';
import { routes } from './app.routes';

describe('product resolvers (/products/:id)', () => {
  const realFetch = globalThis.fetch;
  let mode: 'ok' | 'down' = 'ok';

  beforeEach(() => {
    mode = 'ok';
    // Fake dummyjson.com: id 99999 is a 404, 'down' simulates a network failure.
    globalThis.fetch = (async (url: string | URL | Request) => {
      if (mode === 'down') throw new TypeError('Failed to fetch');
      const id = Number(String(url).split('/').pop()?.split('?')[0]);
      if (id === 99999) return new Response('{}', { status: 404 });
      return new Response(JSON.stringify({ id, title: `Product ${id}`, price: id * 10, description: `About product ${id}` }));
    }) as typeof fetch;
    TestBed.configureTestingModule({ providers: [provideRouter(routes, withComponentInputBinding())] });
  });

  afterEach(() => (globalThis.fetch = realFetch));

  it('opens the page already filled with the resolved product', async () => {
    const harness = await RouterTestingHarness.create('/products/5');
    expect(harness.routeNativeElement?.textContent).toContain('Product 5');
    expect(harness.routeNativeElement?.textContent).toContain('About product 5');
  });

  it('sets the tab title with the title resolver', async () => {
    await RouterTestingHarness.create('/products/5');
    expect(TestBed.inject(Title).getTitle()).toBe('Product 5 | My Shop');
  });

  it('redirects a missing product (404) to /not-found', async () => {
    const harness = await RouterTestingHarness.create('/products/99999');
    expect(TestBed.inject(Router).url).toBe('/not-found');
    expect(harness.routeNativeElement?.textContent).toContain('Page not found');
  });

  it('redirects instead of throwing when the network is down', async () => {
    mode = 'down';
    await RouterTestingHarness.create('/products/5');
    expect(TestBed.inject(Router).url).toBe('/not-found');
  });
});
