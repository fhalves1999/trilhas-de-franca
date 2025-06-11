import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaTagService {
  constructor(
    private meta: Meta,
    private title: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateMetaTags(tags: any) {
    // Título da página
    this.title.setTitle(tags.title);

    // Meta tags padrão
    this.meta.updateTag({ name: 'description', content: tags.description });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: tags.title });
    this.meta.updateTag({ property: 'og:description', content: tags.description });
    this.meta.updateTag({ property: 'og:url', content: tags.url });
    this.meta.updateTag({ property: 'og:image', content: tags.image });
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: tags.title });
    this.meta.updateTag({ name: 'twitter:description', content: tags.description });
    this.meta.updateTag({ name: 'twitter:image', content: tags.image });

    // Adiciona os links canônicos para melhorar o SEO
    let link = this.document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', tags.url);
  }
}
