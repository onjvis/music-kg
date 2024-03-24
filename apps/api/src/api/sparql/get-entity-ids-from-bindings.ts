import { SparqlBinding } from '@music-kg/sparql-data';

export const getEntityIdsFromBindings = (bindings: SparqlBinding[]): string[] => {
  return bindings?.map((binding: SparqlBinding) => {
    const uriParts: string[] = binding?.subject?.value?.split('/');
    return uriParts[uriParts.length - 1];
  });
};
