import { Component, Input, SimpleChanges } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SearchRoutesComponent } from '../search-routes/search-routes.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { StravaService } from '../../services/strava.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { RouteCardComponent } from '../route-card/route-card.component';

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
    SearchRoutesComponent,
    MatPaginatorModule,
    MatSelectModule,
    MatOptionModule, 
    RouteCardComponent
  ],
})
export class RouteListComponent {
  @Input() routes: any[] | null = null;
  @Input() loading = false;
  @Input() errorMsg = '';

  currentPage = 1;
  pageSize = 20;
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
    this.sortRoutes();
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

sortBy: string = 'nivel';
sortDirection: 'asc' | 'desc' = 'asc';

onSortChange() {
  this.sortRoutes();
}

// sortRoutes() {
//   if (!this.filteredRoutes) return;
//   const direction = this.sortDirection === 'asc' ? 1 : -1;
//   switch (this.sortBy) {
//     case 'elevation':
//       this.filteredRoutes.sort((a, b) => direction * (a.elevation_gain - b.elevation_gain));
//       break;
//     case 'distance':
//       this.filteredRoutes.sort((a, b) => direction * (a.distance - b.distance));
//       break;
//     case 'duration':
//       this.filteredRoutes.sort((a, b) => direction * (a.estimated_moving_time - b.estimated_moving_time));
//       break;
//     default:
//       this.filteredRoutes.sort((a, b) => direction * a.name.localeCompare(b.name));
//   }
//   this.setPaginatedRoutes(); // Atualiza a página após ordenar
// }

sortRoutes() {
  if (!this.filteredRoutes) return;
  const direction = this.sortDirection === 'asc' ? 1 : -1;
  switch (this.sortBy) {
    case 'elevation':
      this.filteredRoutes.sort((a, b) => direction * (a.elevation_gain - b.elevation_gain));
      break;
    case 'distance':
      this.filteredRoutes.sort((a, b) => direction * (a.distance - b.distance));
      break;
    case 'duration':
      this.filteredRoutes.sort((a, b) => direction * (a.estimated_moving_time - b.estimated_moving_time));
      break;
    case 'nivel':
      this.filteredRoutes.sort((a, b) => {
        // Ordena pelo valor numérico da dificuldade calculada
        const difA = this.getDificuldadeValor(a);
        const difB = this.getDificuldadeValor(b);
        return direction * (difA - difB);
      });
      break;
    default:
      this.filteredRoutes.sort((a, b) => direction * a.name.localeCompare(b.name));
  }
  this.setPaginatedRoutes();
}

// Função auxiliar para obter o valor numérico da dificuldade
getDificuldadeValor(route: { elevation_gain: number, distance: number }): number {
  const elev = route.elevation_gain || 0;
  const dist = (route.distance || 0) / 1000;
  return elev * 1.6 + dist * 1.1;
}

getDificuldadeLabel(route: { elevation_gain: number, distance: number }): string {
  const elev = route.elevation_gain || 0;
  const dist = (route.distance || 0) / 1000; // metros para km

  // Nova fórmula
  const dificuldade = elev * 1.6 + dist * 1.1;

  if (dificuldade <= 420) return 'Fácil';
  if (dificuldade <= 1200) return 'Médio';
  if (dificuldade <= 1800) return 'Difícil';
  return 'Muito difícil';
}

getDificuldadeClass(route: { elevation_gain: number, distance: number }): string {
  const nivel = this.getDificuldadeLabel(route);
  switch (nivel) {
    case 'Fácil': return 'nivel-facil';
    case 'Médio': return 'nivel-medio';
    case 'Difícil': return 'nivel-dificil';
    case 'Muito difícil': return 'nivel-muito-dificil';
    default: return '';
  }
}

exportToExcel() {
  const data = (this.routes ?? []).map(route => ({
    'Nome da trilha': route.name,
    'Elevação (m)': route.elevation_gain,
    'Distância (km)': (route.distance / 1000).toFixed(2),
    'Nível de dificuldade': this.getDificuldadeLabel(route)
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Trilhas');

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'trilhas-nivel.xlsx');
}

}


