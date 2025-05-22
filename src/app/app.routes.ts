import { Routes } from '@angular/router';
import { RouteListComponent } from './components/route-list/route-list.component';
import { SobreComponent } from './components/sobre/sobre.component';
import { CreditosComponent } from './components/creditos/creditos.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sobre', component: SobreComponent },
  { path: 'creditos', component: CreditosComponent }
];
