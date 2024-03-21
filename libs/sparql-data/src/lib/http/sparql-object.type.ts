export type SparqlObject = {
  type: 'uri' | 'literal';
  datatype?: string;
  value: string;
};
