import { Component, OnInit } from '@angular/core';
import { S3MetadataService } from '../../services/s3-metadata.service';
import { DatePipe, NgIf } from '@angular/common'; // Importar o pipe e NgIf!

@Component({
  selector: 'app-sobre',
  standalone: true,
  imports: [DatePipe, NgIf], 
  template: `
    <div class="page-content" align="center">
      <p>
        Este site é uma colaboração para os ciclistas de Franca e utiliza como base as rotas criadas pelo projeto "Rotas Turísticas" da Prefeitura de Franca.
      </p>
      <a href="https://www.franca.sp.gov.br/administracao-municipal/administracao-direta/desenvolvimento-adm/rotas-turisticas" target="_blank" rel="noopener">
        Clique aqui para acessr o site das "Rotas Turísticas"
      </a>
      <p *ngIf="lastModified" style="font-size: small;">
        Rotas atualizadas até: {{ lastModified | date:'dd/MM/yyyy HH:mm' }}
      </p>      
    </div>
  `
})
export class SobreComponent implements OnInit {
  lastModified: Date | null = null;

  constructor(private s3: S3MetadataService) {}

  ngOnInit() {
    this.s3.getLastModified('https://trilhas-de-franca.s3.sa-east-1.amazonaws.com/trilhas-atleta-id-102459537.json')
      .subscribe(date => this.lastModified = date);
  }
}