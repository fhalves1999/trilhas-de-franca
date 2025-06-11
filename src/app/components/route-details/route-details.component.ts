import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouteCardComponent } from '../route-card/route-card.component';
import { StravaService } from '../../services/strava.service';
import { MetaTagService } from '../../services/meta-tag.service';

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
    private metaTagService: MetaTagService

  ) {}

  ngOnInit() {
    const id = this.routeParam.snapshot.paramMap.get('id');
    this.stravaService.getRoutes().subscribe(routes => {
      this.route = routes.find((r: any) => r.id_str === id);
      this.loading = false;

    console.log('Rota completa:', JSON.stringify(this.route));
    console.log('Mapa da rota:', this.route?.map);
    console.log('URLs do mapa:', this.route?.map_urls);

      console.log('Rota carregada:', this.route);
      if (this.route) {
      const baseUrl = window.location.origin;

      // 1. Verificar qual imagem está disponível
      let imageUrl = null;
      if (this.route.map?.url) {
        imageUrl = this.route.map.url;
      } else if (this.route.map_urls?.retina) {
        imageUrl = this.route.map_urls.retina;
      } else {
        imageUrl = `${baseUrl}/assets/default-route.jpg`;
      }

console.log('URL da imagem selecionada:', imageUrl);

      const metaTags = {
        title: `Trilhas de Franca - | ${this.route.name}`,
        description: `Distância: ${this.route.distance/1000}km - Elevação: ${this.route.elevation_gain}m`,
        image: this.route.map.url || this.route.map_urls?.retina || `${baseUrl}/assets/default-route.jpg`,
        url: `${baseUrl}/rota/${id}`
      };

// Se você tem um polyline:
if (this.route.map?.summary_polyline) {
  const encodedPolyline = encodeURIComponent(this.route.map.summary_polyline);
  const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x400&path=weight:3%7Ccolor:red%7Cenc:${encodedPolyline}&key=AIzaSyDa8E60bNraebcCBpxDXpJfxdONVLNAU0Y`;

  metaTags.image = imageUrl;
  console.log('URL da imagem com polyline:', imageUrl);
}

      console.log('Meta tags geradas:', metaTags);
      this.metaTagService.updateMetaTags(metaTags);
}

    });

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
