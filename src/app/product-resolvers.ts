import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
}

export const productResolver: ResolveFn<Product | RedirectCommand> = async (route) => {
  const router = inject(Router);
  const notFound = new RedirectCommand(router.parseUrl('/not-found'));
  try {
    const res = await fetch(`https://dummyjson.com/products/${route.paramMap.get('id')}`);
    if (!res.ok) {
      return notFound;                       // 404 → cancel this navigation, go to /not-found
    }
    return (await res.json()) as Product;    // the page opens with this data
  } catch {
    return notFound;                         // network error: NEVER let a resolver throw
  }
};

export const productTitleResolver: ResolveFn<string> = async (route) => {
  try {
    const res = await fetch(`https://dummyjson.com/products/${route.paramMap.get('id')}?select=title`);
    return res.ok ? `${(await res.json()).title} | My Shop` : 'Product | My Shop';
  } catch {
    return 'Product | My Shop';
  }
};
