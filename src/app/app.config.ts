import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { CommonModule } from '@angular/common';  // Agrega esta importación

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(FormsModule), // Usa importProvidersFrom para FormsModule
    provideHttpClient(),
  ],
};

