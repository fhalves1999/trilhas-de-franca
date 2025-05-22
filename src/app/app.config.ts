import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { RouteListComponent } from './components/route-list/route-list.component';
import { SobreComponent } from './components/sobre/sobre.component';
import { CreditosComponent } from './components/creditos/creditos.component';
import { SearchRoutesComponent } from './components/search-routes/search-routes.component';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
providers: [
provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
