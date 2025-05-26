import { Component, Input, SimpleChanges } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TimeFormatPipe } from './time-format.pipe';
import { SearchRoutesComponent } from '../search-routes/search-routes.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { StravaService } from '../../services/strava.service';

@Component({
  selector: 'app-route-list',
  standalone: true,
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    TimeFormatPipe,
    SearchRoutesComponent,
    MatPaginatorModule
  ],
})
export class RouteListComponent {
  @Input() routes: any[] | null = null;
  @Input() loading = false;
  @Input() errorMsg = '';

  constructor(private stravaService: StravaService) {}

  downloadGpx(routeId: string): void {
    this.stravaService.getGpxFile(routeId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `route-${routeId}.gpx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao baixar o arquivo GPX:', err);
      },
    });
  }   

  currentPage = 1;
  pageSize = 10;
  searchTerm = '';
  filteredRoutes: any[] = [];
  paginatedRoutes: any[] = [];

  ngOnInit() {
    this.filterRoutes();
  }

 ngOnChanges(changes: SimpleChanges) {
    if (changes['routes']) {
      this.currentPage = 1;
      this.filterRoutes();
    }
  }  

  filterRoutes() {
    // Supondo que você tenha um array `routes` com todos os registros
    this.filteredRoutes = (this.routes ?? []).filter(route =>
      route.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.setPaginatedRoutes();
  }

  setPaginatedRoutes() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRoutes = this.filteredRoutes.slice(start, end);
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.currentPage = 1;
    this.filterRoutes();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.setPaginatedRoutes();
  }

onPageChange(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.currentPage = event.pageIndex + 1;
  this.setPaginatedRoutes();
}  

  get totalPages(): number {
    return Math.ceil(this.filteredRoutes.length / this.pageSize);
  }  

}


