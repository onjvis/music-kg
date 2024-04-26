enum SPARQLPrefix {
  RDF = 'rdf',
  RDFS = 'rdfs',
  SCHEMA = 'schema',
  WIKIDATA_ENTITY = 'wd',
  WIKIDATA_PROP = 'wdt',
  XSD = 'xsd',
}

export const SPARQL_PREFIX = {
  [SPARQLPrefix.RDF]: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  [SPARQLPrefix.RDFS]: 'http://www.w3.org/2000/01/rdf-schema#',
  [SPARQLPrefix.SCHEMA]: 'https://schema.org/',
  [SPARQLPrefix.WIKIDATA_ENTITY]: 'http://www.wikidata.org/entity/',
  [SPARQLPrefix.WIKIDATA_PROP]: 'http://www.wikidata.org/prop/direct/',
  [SPARQLPrefix.XSD]: 'http://www.w3.org/2001/XMLSchema#',
} as const;

export const RDF_PREFIX: string = SPARQL_PREFIX.rdf;
export const SCHEMA_PREFIX: string = SPARQL_PREFIX.schema;
export const WIKIDATA_ENTITY_PREFIX: string = SPARQL_PREFIX.wd;
export const WIKIDATA_PROP_PREFIX: string = SPARQL_PREFIX.wdt;
export const XSD_PREFIX: string = SPARQL_PREFIX.xsd;
