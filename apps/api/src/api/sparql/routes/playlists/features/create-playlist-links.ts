import axios from 'axios';
import { Triple } from 'sparqljs';

import { DataOrigin } from '@music-kg/data';
import { iri, MUSIC_KG_LINKS_PREFIX, MusicPlaylist, prefix2graph, SCHEMA_PREDICATE } from '@music-kg/sparql-data';

import { createInsertQuery } from '../../../helpers/queries/create-insert-query';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';
import { ALLOWED_LINK_ORIGINS } from '../../../models/allowed-link-origins.model';
import { CreatedEntity } from '../../../models/created-entity.model';
import { getPlaylistByExternalUrl } from './get-playlist-by-external-url';

export const createPlaylistLinks = async (createdEntity: CreatedEntity): Promise<void> => {
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
      linkedEntity = await handleCreatePlaylistLinkFromLocal(createdEntity);
    } else if (origin === DataOrigin.SPOTIFY) {
      linkedEntity = await handleCreatePlaylistLinkFromSpotify(createdEntity);
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

const handleCreatePlaylistLinkFromLocal = async (createdEntity: CreatedEntity): Promise<string> => {
  const localPlaylist: MusicPlaylist = await getPlaylistByExternalUrl(
    createdEntity.externalUrls.spotify,
    DataOrigin.LOCAL
  );

  return localPlaylist ? `${getPrefixFromOrigin(DataOrigin.LOCAL)}${localPlaylist?.id}` : undefined;
};

const handleCreatePlaylistLinkFromSpotify = async (createdEntity: CreatedEntity): Promise<string> => {
  const spotifyPlaylist: MusicPlaylist = await getPlaylistByExternalUrl(
    createdEntity.externalUrls.spotify,
    DataOrigin.SPOTIFY
  );

  return spotifyPlaylist ? `${getPrefixFromOrigin(DataOrigin.SPOTIFY)}${spotifyPlaylist?.id}` : undefined;
};
