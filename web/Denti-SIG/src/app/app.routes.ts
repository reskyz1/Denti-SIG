import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
    {path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)},
    {path: 'register-dentist', loadComponent: () => import('./features/auth/register-dentist/register-dentist.component').then(m => m.RegisterDentistComponent)}
];
