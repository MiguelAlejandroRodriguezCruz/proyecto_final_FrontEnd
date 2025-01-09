import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReturnsComponent } from './returns/returns.component';
import { CreditosComponent } from './creditos/creditos.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'returns', component: ReturnsComponent },
    { path: 'creditos', component: CreditosComponent },
];
