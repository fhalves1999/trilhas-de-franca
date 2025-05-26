import { Component, OnInit } from '@angular/core';
import { StravaService } from '../../services/strava.service';
import { RouteListComponent } from '../../components/route-list/route-list.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouteListComponent, NgIf],
  template: `

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
      margin-top: 1rem;
    }
  `]
})
export class HomeComponent {
  routes: any[] | null = null;
  loading = false;
  errorMsg = '';

  constructor(private stravaService: StravaService) {}

  ngOnInit() {
    this.buscarTrilhas('');
  }

  buscarTrilhas(termo: string) {
    this.loading = true;
    this.routes = null;
    this.errorMsg = '';
    this.stravaService.getRoutes().subscribe({
      next: (data) => {
        let rotas = data;
        if (termo) {
          const termoNormalizado = termo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
          rotas = rotas.filter((r: any) => {
            const nomeNormalizado = (r.name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            return nomeNormalizado.includes(termoNormalizado);
          });
        }
        // Ordena alfabeticamente pelo nome
        this.routes = rotas.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''));
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
