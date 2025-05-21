import { Component } from '@angular/core';
import { RouteListComponent } from './components/route-list/route-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouteListComponent]
})
export class AppComponent {
  title = 'strava-routes-app';
}
