import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full' },
    {path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
    {path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)},
    {path: 'register-dentist', loadComponent: () => import('./features/auth/register-dentist/register-dentist.component').then(m => m.RegisterDentistComponent)},
    {path: 'register-patient', loadComponent: () => import('./features/auth/register-patient/register-patient.component').then(m => m.RegisterPatientComponent)},
    {path: 'register-secretary', loadComponent: () => import('./features/auth/register-secretary/register-secretary.component').then(m => m.RegisterSecretaryComponent)}
];
