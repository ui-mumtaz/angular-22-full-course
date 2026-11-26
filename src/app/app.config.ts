import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),                       // for validateHttp (Lesson 51) and Module 11
    provideRouter(
      routes,
      withComponentInputBinding(),             // route & query params → inputs
      withPreloading(PreloadAllModules),       // download lazy pages in the background after startup
    ),
  ],
};
