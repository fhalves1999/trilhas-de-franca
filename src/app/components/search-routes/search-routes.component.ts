import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-routes',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-container">
      <input [(ngModel)]="searchTerm" placeholder="Buscar trilha..." />
      <button (click)="onSearch()" aria-label="Buscar">
        🔍
      </button>
    </div>
  `,
  styles: [`
    .search-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 2rem 0;
      gap: 0.5rem;
    }
    input {
      padding: 0.5rem;
      font-size: 1rem;
    }
    button {
      padding: 0.5rem 1rem;
      font-size: 1.2rem;
      cursor: pointer;
    }
  `]
})
export class SearchRoutesComponent {
  searchTerm = '';
  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.searchTerm.trim());
  }
}
