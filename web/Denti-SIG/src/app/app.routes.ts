import { Routes } from '@angular/router';
import { InicialDentistaComponent} from './inicial-dentista/inicial-dentista.component';
import { InicialComponent} from './inicial/inicial.component';
import { InicialSecretarioComponent} from './inicial-secretario/inicial-secretario.component';
import { GerenciarAgendaComponent} from './gerenciar-agenda/gerenciar-agenda.component';
import { HeaderComponent } from './shared/header/header.component';
import { InitialComponent } from './pages/initial/initial.component';

export const routes: Routes = [
    {path: '', redirectTo: 'initial', pathMatch: 'full' },
    {path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
    {path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)},
    {path: 'register-dentist', loadComponent: () => import('./features/auth/register-dentist/register-dentist.component').then(m => m.RegisterDentistComponent)},
    {path: 'register-patient', loadComponent: () => import('./features/auth/register-patient/register-patient.component').then(m => m.RegisterPatientComponent)},
    {path: 'register-secretary', loadComponent: () => import('./features/auth/register-secretary/register-secretary.component').then(m => m.RegisterSecretaryComponent)},
    {path: 'start-dentist', component: InicialDentistaComponent},
    {path: 'start', component: InicialComponent},
    {path: 'start-secretary', component: InicialSecretarioComponent},
    {path: 'agenda', component: GerenciarAgendaComponent},
    {path: 'initial', component: InitialComponent}
];
