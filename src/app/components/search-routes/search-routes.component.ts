import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-search-routes',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './search-routes.component.html'
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
