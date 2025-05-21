import { Component, OnInit } from '@angular/core';
import { StravaService } from '../../services/strava.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  imports: [NgFor],
})
export class RouteListComponent implements OnInit {
  routes: any[] = [];
  errorMsg = '';

  constructor(private stravaService: StravaService) {}

  ngOnInit(): void {
    this.stravaService.getRoutes().subscribe({
      next: (data: any[]) => {
        console.log('Dados recebidos do Strava:', data);
        this.routes = data;
      },
      error: (err) => {
        console.error('Erro ao buscar rotas do Strava:', err);
        this.errorMsg = 'Erro ao buscar rotas do Strava: ' + err.message;
      }
    });
  }
}
