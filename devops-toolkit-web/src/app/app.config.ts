import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi
} from "@angular/common/http";
import {TokenHttpInterceptor} from "./services/token-http-interceptor";
import {ConfirmationService, MessageService} from "primeng/api";
import {provideAnimations} from "@angular/platform-browser/animations";

// @ts-ignore
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), MessageService, ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenHttpInterceptor, multi: true },
    provideHttpClient(
      withInterceptorsFromDi())
    ]
};
