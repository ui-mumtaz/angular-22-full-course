# Angular 22 Full Course (English) | Zero to Advanced

Code for the free **Angular 22 – Zero to Advanced** YouTube course by AI Learning Stack.
Each lesson is merged into `main` through its own pull request and tagged `L<module>.<lesson>-end`,
so you can check out the exact code at the end of any video:

```bash
git checkout L9.1-end
npm install
npm start
```

**Stack:** Angular CLI 22.2.4 · standalone components · signals · Tailwind CSS 4 (`ng add tailwindcss`) + SCSS.
Brand colours live in `src/tailwind.css` (`@theme`: `--color-brand`, `--color-ink`).

## Lessons

| Lesson | Video | Topic | Tag |
|---|---|---|---|
| 9.1 | #42 | Routing basics: pages, links and the Back button | `L9.1-end` |
| 9.2 | #43 | Route parameters: `/products/:id`, query params and `Router.navigate` | `L9.2-end` |
| 9.3 | #44 | Lazy loading routes: `loadComponent`, `loadChildren` and preloading | `L9.3-end` |
| 9.4 | #45 | Route guards: `canActivate`, `canMatch`, login with `returnUrl` | `L9.4-end` |
| 9.5 | #46 | Route resolvers: `ResolveFn`, `RedirectCommand` and title resolvers | `L9.5-end` |
| 9.6 | #47 | Nested routes: a product layout with Overview, Reviews and Specs tabs | `L9.6-end` |
| 10.1 | #48 | Template-driven forms: `ngModel` with signals, validation and `ngSubmit` | `L10.1-end` |
| 10.2 | #49 | Reactive forms: `FormBuilder`, typed forms and `getRawValue` | `L10.2-end` |
| 10.3 | #50 | Signal Forms: `form()`, `[formField]` and `submit` | `L10.3-end` |
| 10.4 | #51 | Validation: custom, cross-field, conditional and server rules | `L10.4-end` |
| 10.5 | #52 | Dynamic forms: add and remove rows, fields from config | `L10.5-end` |

## Tools

`tools/narration/narrate.py` is the script that turns each lesson's narration into speech (Chatterbox TTS),
including the pronunciation rules for code, such as reading `<a routerLink="/products">` as
"an a tag with routerLink equals slash products".
