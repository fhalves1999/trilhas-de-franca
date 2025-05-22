import { Component, Input } from '@angular/core';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TimeFormatPipe } from './time-format.pipe';

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
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    TimeFormatPipe
  ],
})
export class RouteListComponent {
  @Input() routes: any[] | null = null;
  @Input() loading = false;
  @Input() errorMsg = '';
}
