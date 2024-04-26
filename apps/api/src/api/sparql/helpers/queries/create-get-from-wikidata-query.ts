import { SelectQuery, VariableTerm } from 'sparqljs';

import { EntityType } from '@music-kg/data';
import {
  literal,
  MUSIC_KG_WIKIDATA_PREFIX,
  prefix2graph,
  SparqlIri,
  variable,
  WIKIDATA_PREDICATE,
  XSD_DATATYPE,
} from '@music-kg/sparql-data';

import { GetFromWikidataQueryParams } from '../../models/get-from-wikidata-query-params.model';
import { replaceBaseUri } from '../replace-base-uri';
import { sparqlGenerator } from '../sparql-generator';

export const createGetFromWikidataQuery = ({ entityId, entityType }: GetFromWikidataQueryParams): string => {
  const entityPredicate: SparqlIri = getEntityPredicate(entityType);

  const subjectVariable: VariableTerm = variable('subject');
  const predicateVariable: VariableTerm = variable('predicate');
  const objectVariable: VariableTerm = variable('object');

  const queryObject: SelectQuery = {
    queryType: 'SELECT',
    variables: [subjectVariable, predicateVariable, objectVariable],
    from: { default: [prefix2graph(replaceBaseUri(MUSIC_KG_WIKIDATA_PREFIX))], named: [] },
    where: [
      {
        type: 'bgp',
        triples: [
          { subject: subjectVariable, predicate: entityPredicate.iri, object: literal(entityId, XSD_DATATYPE.string) },
          { subject: subjectVariable, predicate: predicateVariable, object: objectVariable },
        ],
      },
    ],
    type: 'query',
    prefixes: {},
  };

  return sparqlGenerator.stringify(queryObject);
};

const getEntityPredicate = (entityType: EntityType): SparqlIri => {
  if (entityType === 'album') {
    return WIKIDATA_PREDICATE.spotifyAlbumId;
  } else if (entityType === 'artist') {
    return WIKIDATA_PREDICATE.spotifyArtistId;
  } else if (entityType === 'track') {
    return WIKIDATA_PREDICATE.spotifyTrackId;
  }
};
