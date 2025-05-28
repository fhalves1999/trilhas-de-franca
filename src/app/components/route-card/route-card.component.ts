import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeFormatPipe } from '../route-list/time-format.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StravaService } from '../../services/strava.service';

@Component({
  selector: 'app-route-card',
  imports: [
    CommonModule,
    TimeFormatPipe,
    MatIconModule,
    MatProgressSpinnerModule],
  template: `
    <div class="route-row">
      <div class="route-info">
        <div class="bike-icon">
          <mat-icon color="accent" class="bike-icon">directions_bike</mat-icon>
        </div>
        <div class="route-title">
          <span>{{ route.name }}</span>
        </div>
        <div class="route-details">
          <span><strong>Distância:</strong> {{ route.distance / 1000 | number:'1.2-2' }} km</span>
        </div>
        <div class="route-details">
          <span><strong>Elevação:</strong> {{ route.elevation_gain | number:'1.0-0' }} m</span>
        </div>
        <div class="route-time">
          <span><strong>Tempo estimado:</strong> {{ route.estimated_moving_time | timeFormat }}</span>
        </div>
        <div class="route-details">
          <span>
            <strong>Nível de dificuldade: </strong>
            <span [ngClass]="getDificuldadeClass(route)">
              {{ getDificuldadeLabel(route) }}
            </span>
          </span>
        </div>
      </div>

            <!-- Botão de download -->
      <div class="download-btn-container">
        <button
          mat-raised-button
          color="primary"
          [disabled]="isDownloadingGpx === route.id_str"
          (click)="downloadGpx(route.id_str, route.name)"
        >
          <mat-icon *ngIf="isDownloadingGpx !== route.id_str">download</mat-icon>
          <mat-spinner *ngIf="isDownloadingGpx === route.id_str" diameter="24"></mat-spinner>
          <span *ngIf="isDownloadingGpx !== route.id_str">Baixar arquivo .gpx</span>
          <span *ngIf="isDownloadingGpx === route.id_str">Gerando arquivo aguarde...</span>
        </button>
      </div>

      <div class="route-map" *ngIf="route.map_urls?.url">
        <img [src]="route.map_urls.url" alt="Mapa da rota" />
      </div>
      <a class="strava-link"
         [href]="'https://www.strava.com/routes/' + route.id_str"
         target="_blank"
         rel="noopener">
        Clique aqui para ver a rota no Strava
      </a>

      <div class="share-btn-container">
        <button *ngIf="!linkCopied" mat-raised-button color="accent" (click)="copyLink()" style="margin-left: 0.5rem;">
          Copiar link
        </button>
        <span *ngIf="linkCopied" class="copied-msg">Link copiado!</span>
      </div> 

    </div>



  `,
  styleUrls: ['./route-card.component.scss']
})
export class RouteCardComponent {

  linkCopied = false;

  copyLink() {
    const url = `${window.location.origin}/rota/${this.route.id_str}`;
    navigator.clipboard.writeText(url).then(() => {
      this.linkCopied = true;
      setTimeout(() => this.linkCopied = false, 2000);
    });
  }

  isDownloadingGpx: string | null = null;
  constructor(private stravaService: StravaService) { }

  downloadGpx(routeId: string, routeName: string): void {
    this.isDownloadingGpx = routeId;
    console.log("Iniciando download do GPX. Horário: ", new Date().toLocaleTimeString());

    routeName = `route-${routeId}_${this.normalizeFileName(routeName)}`;

    this.stravaService.getGpxFile(routeId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${routeName}.gpx`;
        a.click();
        window.URL.revokeObjectURL(url);
        console.log("Finalizando download do GPX. Horário: ", new Date().toLocaleTimeString());
        this.isDownloadingGpx = null;
      },
      error: (err) => {
        console.error('Erro ao baixar o arquivo GPX:', err);
        this.isDownloadingGpx = null;
      },
    });
  }   

// Função utilitária para normalizar nomes
normalizeFileName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-zA-Z0-9-_]/g, '_') // Substitui caracteres especiais por _
    .replace(/_+/g, '_')             // Troca múltiplos _ por um só
    .replace(/^_+|_+$/g, '')         // Remove _ do início/fim
    .toLowerCase();
}   

  @Input() route: any;
  @Input() getDificuldadeClass!: (route: any) => string;
  @Input() getDificuldadeLabel!: (route: any) => string;

}