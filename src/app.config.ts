import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from './environments/environment';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { MilesPipe } from './app/pipes/miles.pipe';
import { MessageService } from 'primeng/api';
import { PrimetoastComponent } from './app/services/primetoast/primetoast/primetoast.component';
import localeEs from '@angular/common/locales/es';
import { DatePipe, DecimalPipe, PercentPipe, registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(), MilesPipe, MessageService, PrimetoastComponent, DatePipe,
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage()),
        { provide: FIREBASE_OPTIONS, useValue: environment.firebase }, {provide: LOCALE_ID, useValue: 'es'}
    ]
};
