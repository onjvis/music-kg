import axios from 'axios';
import { Triple } from 'sparqljs';

import { DataOrigin } from '@music-kg/data';
import {
  iri,
  MUSIC_KG_LINKS_PREFIX,
  MusicRecording,
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
import { getRecordingByExternalUrl } from './get-recording-by-external-url';
import { getRecordingFromWikidataDump } from './get-recording-from-wikidata-dump';

export const createRecordingLinks = async (createdEntity: CreatedEntity): Promise<void> => {
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
      linkedEntity = await handleCreateRecordingLinkFromLocal(createdEntity);
    } else if (origin === DataOrigin.SPOTIFY) {
      linkedEntity = await handleCreateRecordingLinkFromSpotify(createdEntity);
    } else if (origin === DataOrigin.DUMP_WIKIDATA) {
      linkedEntity = await handleCreateRecordingLinkFromWikidata(createdEntity);
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

const handleCreateRecordingLinkFromLocal = async (createdEntity: CreatedEntity): Promise<string> => {
  const localRecording: MusicRecording = await getRecordingByExternalUrl(
    createdEntity.externalUrls.spotify,
    DataOrigin.LOCAL
  );

  return localRecording ? `${getPrefixFromOrigin(DataOrigin.LOCAL)}${localRecording?.id}` : undefined;
};

const handleCreateRecordingLinkFromSpotify = async (createdEntity: CreatedEntity): Promise<string> => {
  const spotifyRecording: MusicRecording = await getRecordingByExternalUrl(
    createdEntity.externalUrls.spotify,
    DataOrigin.SPOTIFY
  );

  return spotifyRecording ? `${getPrefixFromOrigin(DataOrigin.SPOTIFY)}${spotifyRecording?.id}` : undefined;
};

const handleCreateRecordingLinkFromWikidata = async (createdEntity: CreatedEntity): Promise<string> => {
  const wikidataRecording: SparqlEntity = await getRecordingFromWikidataDump(createdEntity.externalUrls.spotify);

  return wikidataRecording ? `${replaceBaseUri(WIKIDATA_ENTITY_PREFIX)}${wikidataRecording?.id}` : undefined;
};
