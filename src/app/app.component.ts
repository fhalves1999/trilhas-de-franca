import { Component, OnInit } from '@angular/core';
import { RouteListComponent } from './components/route-list/route-list.component';
import { StravaService } from './services/strava.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouteListComponent],
  template: `
    <app-route-list
      [routes]="routes"
      [loading]="loading"
      [errorMsg]="errorMsg"
    ></app-route-list>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  routes: any[] | null = null;
  loading = true;
  errorMsg = '';

  constructor(private stravaService: StravaService) {}

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
