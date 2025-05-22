import { Component } from '@angular/core';
import { StravaService } from '../../services/strava.service';
import { RouteListComponent } from '../../components/route-list/route-list.component';
import { NgIf } from '@angular/common';
import { SearchRoutesComponent } from '../../components/search-routes/search-routes.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouteListComponent, NgIf, SearchRoutesComponent],
  template: `
    <app-search-routes (search)="buscarTrilhas($event)"></app-search-routes>
    <div *ngIf="routes !== null && !loading" class="result-count">
      {{ routes.length }} registro{{ routes.length === 1 ? '' : 's' }} localizado{{ routes.length === 1 ? '' : 's' }}
    </div>
    <div *ngIf="loading" class="loading-container">
      <span class="spinner"></span>
      <span>Carregando...</span>
    </div>
    <app-route-list
      *ngIf="!loading && routes !== null"
      [routes]="routes"
      [loading]="loading"
      [errorMsg]="errorMsg"
    ></app-route-list>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 2rem 0;
      color: #555;
      font-size: 1.2rem;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 4px solid #eee;
      border-top: 4px solid #3f51b5;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 0.5rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg);}
      100% { transform: rotate(360deg);}
    }
    .result-count {
      text-align: center;
      margin-bottom: 1rem;
      color: #3f51b5;
      font-weight: 500;
    }
  `]
})
export class HomeComponent {
  routes: any[] | null = null;
  loading = false;
  errorMsg = '';

  constructor(private stravaService: StravaService) {}

  buscarTrilhas(termo: string) {
    this.loading = true;
    this.routes = null;
    this.errorMsg = '';
    this.stravaService.getRoutes().subscribe({
      next: (data) => {
        if (termo) {
          const termoNormalizado = termo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
          this.routes = data.filter((r: any) => {
            const nomeNormalizado = (r.name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            return nomeNormalizado.includes(termoNormalizado);
          });
        } else {
          this.routes = data;
        }
        this.loading = false;
      },
      error: (err) => {
        this.routes = [];
        this.errorMsg = 'Erro ao buscar rotas do Strava: ' + err.message;
        this.loading = false;
      }
    });
  }
}
