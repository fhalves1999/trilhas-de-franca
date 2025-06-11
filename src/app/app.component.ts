import { Component, OnInit } from '@angular/core';
import { StravaService } from './services/strava.service';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntlPtBr } from './shared/mat-paginator-intl-pr-br';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatIconModule, MatPaginatorModule],
    providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr }
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  anoAtual = new Date().getFullYear();
  routes: any[] | null = null;
  loading = true;
  errorMsg = '';
  title = 'strava-routes-app';

  constructor(
    private stravaService: StravaService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'whatsapp',
      sanitizer.bypassSecurityTrustResourceUrl('assets/whatsapp.svg')
    );
  }

  ngOnInit() {
    this.stravaService.getRoutes().subscribe({
      next: (data) => {
        this.routes = data;
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
