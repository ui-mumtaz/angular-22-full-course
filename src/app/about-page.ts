import { Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  template: `<h2 class="text-xl font-semibold">About us</h2><p class="mt-2 text-slate-600">We sell great gadgets since 2014.</p>`,
})
export default class AboutPage {}       // default export → loadComponent needs no .then(...)
