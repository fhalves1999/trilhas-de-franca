import { MatPaginatorIntl } from '@angular/material/paginator';

export function getCustomPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Registros por página'; // Remove o texto "Itens por página"
  paginatorIntl.nextPageLabel = 'Próxima';
  paginatorIntl.previousPageLabel = 'Anterior';

  return paginatorIntl;
}