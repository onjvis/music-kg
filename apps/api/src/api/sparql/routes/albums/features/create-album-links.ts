import { CreatedEntity } from '../../../models/created-entity.model';
import { ALLOWED_LINK_ORIGINS } from '../../../models/allowed-link-origins.model';
import { DataOrigin } from '@music-kg/data';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';
import {
  iri,
  MUSIC_KG_LINKS_PREFIX,
  MusicAlbum,
  prefix2graph,
  SCHEMA_PREDICATE,
  SparqlEntity,
  WIKIDATA_ENTITY_PREFIX,
} from '@music-kg/sparql-data';
import { Triple } from 'sparqljs';
import { createInsertQuery } from '../../../helpers/queries/create-insert-query';
import axios from 'axios';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';
import { getAlbumByExternalUrl } from './get-album-by-external-url';
import { getAlbumFromWikidataDump } from './get-album-from-wikidata-dump';

export const createAlbumLinks = async (createdEntity: CreatedEntity): Promise<void> => {
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
      linkedEntity = await handleCreateAlbumLinkFromLocal(createdEntity);
    } else if (origin === DataOrigin.SPOTIFY) {
      linkedEntity = await handleCreateAlbumLinkFromSpotify(createdEntity);
    } else if (origin === DataOrigin.DUMP_WIKIDATA) {
      linkedEntity = await handleCreateAlbumLinkFromWikidata(createdEntity);
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

const handleCreateAlbumLinkFromLocal = async (createdEntity: CreatedEntity): Promise<string> => {
  const localAlbum: MusicAlbum = await getAlbumByExternalUrl(createdEntity.externalUrls.spotify, DataOrigin.LOCAL);

  return localAlbum ? `${getPrefixFromOrigin(DataOrigin.LOCAL)}${localAlbum?.id}` : undefined;
};

const handleCreateAlbumLinkFromSpotify = async (createdEntity: CreatedEntity): Promise<string> => {
  const spotifyAlbum: MusicAlbum = await getAlbumByExternalUrl(createdEntity.externalUrls.spotify, DataOrigin.SPOTIFY);

  return spotifyAlbum ? `${getPrefixFromOrigin(DataOrigin.SPOTIFY)}${spotifyAlbum?.id}` : undefined;
};

const handleCreateAlbumLinkFromWikidata = async (createdEntity: CreatedEntity): Promise<string> => {
  const wikidataAlbum: SparqlEntity = await getAlbumFromWikidataDump(createdEntity.externalUrls.spotify);

  return wikidataAlbum ? `${replaceBaseUri(WIKIDATA_ENTITY_PREFIX)}${wikidataAlbum?.id}` : undefined;
};
