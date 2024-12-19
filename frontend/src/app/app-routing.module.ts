// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';  // Certifique-se de que RouterModule está sendo importado corretamente
import { LoginComponent } from './LoginPage/login/login.component';  // Importando o LoginComponent

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirecionamento para a página de login
  { path: 'login', component: LoginComponent },  // Rota para o LoginComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Certifique-se de que RouterModule está sendo configurado corretamente
  exports: [RouterModule]
})
export class AppRoutingModule { }
