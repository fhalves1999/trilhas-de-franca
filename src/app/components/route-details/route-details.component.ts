import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouteCardComponent } from '../route-card/route-card.component';
import { StravaService } from '../../services/strava.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-route-details',
  standalone: true,
  imports: [CommonModule, 
    RouteCardComponent,
  ],
  template: `
    <ng-container *ngIf="route">
      <div style="display: flex; justify-content: center; align-items: flex-start; min-height: 60vh;">
        <app-route-card
          [route]="route"
          [getDificuldadeClass]="getDificuldadeClass"
          [getDificuldadeLabel]="getDificuldadeLabel"
        ></app-route-card>
      </div>
    </ng-container>
    <div *ngIf="!route && !loading">Rota não encontrada.</div>
    <div *ngIf="loading">Carregando...</div>
  `
})
export class RouteDetailsComponent implements OnInit {
  route: any = null;
  loading = true;

  constructor(
    private routeParam: ActivatedRoute,
    private stravaService: StravaService,
    private meta: Meta, 
    private title: Title

  ) {}

  ngOnInit() {
    const id = this.routeParam.snapshot.paramMap.get('id');
    this.stravaService.getRoutes().subscribe(routes => {
      this.route = routes.find((r: any) => r.id_str === id);
      this.loading = false;
    });

  this.title.setTitle(this.route.name);
  this.meta.updateTag({ property: 'og:title', content: this.route.name });
  this.meta.updateTag({ property: 'og:description', content: 'Veja detalhes da rota!' });
  this.meta.updateTag({ property: 'og:image', content: this.route.map_urls?.url });
  this.meta.updateTag({ property: 'og:url', content: window.location.href });

  }

  getDificuldadeLabel(route: any): string {
    const elev = route.elevation_gain || 0;
    const dist = (route.distance || 0) / 1000;
    const dificuldade = elev * 1.6 + dist * 1.1;
    if (dificuldade <= 420) return 'Fácil';
    if (dificuldade <= 1200) return 'Médio';
    if (dificuldade <= 1800) return 'Difícil';
    return 'Muito difícil';
  }

  getDificuldadeClass(route: any): string {
    const nivel = this.getDificuldadeLabel(route);
    switch (nivel) {
      case 'Fácil': return 'nivel-facil';
      case 'Médio': return 'nivel-medio';
      case 'Difícil': return 'nivel-dificil';
      case 'Muito difícil': return 'nivel-muito-dificil';
      default: return '';
    }
  }
}