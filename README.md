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

## Tools

`tools/narration/narrate.py` is the script that turns each lesson's narration into speech (Chatterbox TTS),
including the pronunciation rules for code, such as reading `<a routerLink="/products">` as
"an a tag with routerLink equals slash products".
