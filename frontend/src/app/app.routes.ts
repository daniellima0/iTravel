import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { MyPhotosComponent } from './my-photos/my-photos.component';

export const appRoutes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'my-photos', component: MyPhotosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
];
