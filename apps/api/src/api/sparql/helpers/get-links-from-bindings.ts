import { SparqlBinding } from '@music-kg/sparql-data';

export const getLinksFromBindings = (bindings: SparqlBinding[]) =>
  bindings.map((binding: SparqlBinding): string => binding?.subject?.value);
