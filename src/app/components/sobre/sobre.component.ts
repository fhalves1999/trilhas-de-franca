import { Component } from '@angular/core';

@Component({
  selector: 'app-sobre',
  standalone: true,
  template: `
    <div class="page-content" align="center">
      <p>
        Este site é uma colaboração para os ciclistas de Franca e utiliza como base as rotas criadas pelo projeto "Rotas Turísticas" da Prefeitura de Franca.
      </p>
      <a href="https://www.franca.sp.gov.br/administracao-municipal/administracao-direta/desenvolvimento-adm/rotas-turisticas" target="_blank" rel="noopener">
        Clique aqui para acessr o site das "Rotas Turísticas"
      </a>
    </div>
  `
})
export class SobreComponent {}
