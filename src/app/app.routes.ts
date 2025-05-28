import { Routes } from '@angular/router';
import { SobreComponent } from './components/sobre/sobre.component';
import { CreditosComponent } from './components/creditos/creditos.component';
import { HomeComponent } from './pages/home/home.component';
import { RouteDetailsComponent } from './components/route-details/route-details.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sobre', component: SobreComponent },
  { path: 'creditos', component: CreditosComponent },
  { path: 'rota/:id', component: RouteDetailsComponent }
];
