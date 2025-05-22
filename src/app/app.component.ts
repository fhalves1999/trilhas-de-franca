import { Component, OnInit } from '@angular/core';
import { StravaService } from './services/strava.service';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  anoAtual = new Date().getFullYear();
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
