import axios from 'axios';
import { Triple } from 'sparqljs';

import { DataOrigin } from '@music-kg/data';
import {
  iri,
  MUSIC_KG_LINKS_PREFIX,
  MusicGroup,
  prefix2graph,
  SCHEMA_PREDICATE,
  SparqlEntity,
  WIKIDATA_ENTITY_PREFIX,
} from '@music-kg/sparql-data';

import { createInsertQuery } from '../../../helpers/queries/create-insert-query';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';
import { ALLOWED_LINK_ORIGINS } from '../../../models/allowed-link-origins.model';
import { CreatedEntity } from '../../../models/created-entity.model';
import { getArtistByExternalUrl } from './get-artist-by-external-url';
import { getArtistFromWikidataDump } from './get-artist-from-wikidata-dump';

export const createArtistLinks = async (createdEntity: CreatedEntity): Promise<void> => {
  if (!createdEntity || !ALLOWED_LINK_ORIGINS.includes(createdEntity?.origin)) {
    return;
  }

  const origins: DataOrigin[] = ALLOWED_LINK_ORIGINS.filter(
    (allowedOrigin: DataOrigin): boolean => allowedOrigin !== createdEntity.origin
  );
  const linkedEntities: string[] = [];

  for (const origin of origins) {
    let linkedEntity: string;

    if (origin === DataOrigin.LOCAL) {
      linkedEntity = await handleCreateArtistLinkFromLocal(createdEntity);
    } else if (origin === DataOrigin.SPOTIFY) {
      linkedEntity = await handleCreateArtistLinkFromSpotify(createdEntity);
    } else if (origin === DataOrigin.DUMP_WIKIDATA) {
      linkedEntity = await handleCreateArtistLinkFromWikidata(createdEntity);
    }

    if (linkedEntity) {
      linkedEntities.push(linkedEntity);
    }
  }

  const linksPrefix: string = replaceBaseUri(MUSIC_KG_LINKS_PREFIX);
  const triples: Triple[] = linkedEntities.map(
    (linkedEntity: string): Triple => ({
      subject: iri(createdEntity.iri),
      predicate: SCHEMA_PREDICATE.sameAs.iri,
      object: iri(linkedEntity),
    })
  );
  const query: string = createInsertQuery({ graph: prefix2graph(linksPrefix), triples });

  return axios.post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, {
    headers: { 'Content-Type': 'application/sparql-update' },
  });
};

const handleCreateArtistLinkFromLocal = async (createdEntity: CreatedEntity): Promise<string> => {
  const localArtist: MusicGroup = await getArtistByExternalUrl(createdEntity.externalUrls.spotify, DataOrigin.LOCAL);

  return localArtist ? `${getPrefixFromOrigin(DataOrigin.LOCAL)}${localArtist?.id}` : undefined;
};

const handleCreateArtistLinkFromSpotify = async (createdEntity: CreatedEntity): Promise<string> => {
  const spotifyArtist: MusicGroup = await getArtistByExternalUrl(
    createdEntity.externalUrls.spotify,
    DataOrigin.SPOTIFY
  );

  return spotifyArtist ? `${getPrefixFromOrigin(DataOrigin.SPOTIFY)}${spotifyArtist?.id}` : undefined;
};

const handleCreateArtistLinkFromWikidata = async (createdEntity: CreatedEntity): Promise<string> => {
  const wikidataArtist: SparqlEntity = await getArtistFromWikidataDump(createdEntity.externalUrls.spotify);

  return wikidataArtist ? `${replaceBaseUri(WIKIDATA_ENTITY_PREFIX)}${wikidataArtist?.id}` : undefined;
};
