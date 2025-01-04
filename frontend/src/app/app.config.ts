import { ApplicationConfig } from '@angular/core';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';

// Router imports
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

import { provideHttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideStorage(() => getStorage()),
    provideRouter(appRoutes),
    provideHttpClient(),
  ],
};
