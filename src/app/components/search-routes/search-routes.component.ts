import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-search-routes',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="search-container">
      <input [(ngModel)]="searchTerm" (ngModelChange)="onInputChange($event)" placeholder="Digite o nome da trilha" />      
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

  private searchSubject = new Subject<string>();
  private searchSub: Subscription; 

  constructor() {
    this.searchSub = this.searchSubject.pipe(
      debounceTime(400) // 400ms de atraso
    ).subscribe(term => {
      this.search.emit(term.trim());
    });  
  }

  onInputChange(term: string) {
    this.searchSubject.next(term);
  }  

  onSearch() {
    this.search.emit(this.searchTerm.trim());
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe();
  }  
}
