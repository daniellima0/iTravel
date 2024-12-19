import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './LoginPage/login/login.component';
import { AppRoutingModule } from './app-routing.module';  


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule, // Incluindo o AppRoutingModule para garantir que as rotas funcionem
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}