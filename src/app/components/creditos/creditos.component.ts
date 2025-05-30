import { Component } from '@angular/core';

@Component({
  selector: 'app-creditos',
  standalone: true,
  template: `
    <div class="page-content" align="center">
      <p>
        Desenvolvido por

        <a href="https://www.strava.com/athletes/15888295" target="_blank" rel="noopener">
          Flavio Alves.
        </a>
        <br>
        Todos os direitos reservados.<br>
      </p>
    </div>
  `
})
export class CreditosComponent {}
