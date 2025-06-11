import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaTagService {
  //private readonly defaultImage = `${environment.baseUrl}/assets/default-route.jpg`;
  private readonly defaultImage = `${window.location.origin}/assets/default-route.jpg`;

  constructor(
    private meta: Meta,
    private titleService: Title
  ) {}

  updateMetaTags(config: {
    title: string,
    description: string,
    image?: string,
    url?: string
  }): void {
    // Definir título da página
    this.titleService.setTitle(config.title);

    // Garantir que temos uma imagem mesmo que não seja fornecida
    const imageUrl = config.image || this.defaultImage;

    // Garantir que temos uma URL
    const pageUrl = config.url || window.location.href;

    // Limpar metatags existentes para evitar duplicações
    this.clearMetaTags();

    // Tags básicas
    this.meta.addTag({ name: 'description', content: config.description });

    // Tags Open Graph - sempre presentes e explícitas
    this.meta.addTag({ property: 'og:title', content: config.title });
    this.meta.addTag({ property: 'og:description', content: config.description });
    this.meta.addTag({ property: 'og:type', content: 'website' });
    this.meta.addTag({ property: 'og:image', content: imageUrl });
    this.meta.addTag({ property: 'og:url', content: pageUrl });

    // Adicionar dimensões da imagem (recomendado pelo Facebook)
    this.meta.addTag({ property: 'og:image:width', content: '600' });
    this.meta.addTag({ property: 'og:image:height', content: '400' });

    // Tags Twitter Card
    this.meta.addTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.addTag({ name: 'twitter:title', content: config.title });
    this.meta.addTag({ name: 'twitter:description', content: config.description });
    this.meta.addTag({ name: 'twitter:image', content: imageUrl });
  }

  private clearMetaTags(): void {
    // Limpar metatags para evitar duplicações
    this.meta.removeTag('name="description"');
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:type"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('property="og:url"');
    this.meta.removeTag('property="og:image:width"');
    this.meta.removeTag('property="og:image:height"');
    this.meta.removeTag('name="twitter:card"');
    this.meta.removeTag('name="twitter:title"');
    this.meta.removeTag('name="twitter:description"');
    this.meta.removeTag('name="twitter:image"');
  }
}
