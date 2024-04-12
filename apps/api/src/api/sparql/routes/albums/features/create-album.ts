import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { CreateAlbumRequest } from '@music-kg/data';
import {
  iri,
  iriWithPrefix,
  literal,
  MUSIC_KG_ALBUMS_PREFIX,
  MUSIC_KG_ARTISTS_PREFIX,
  MUSIC_KG_RECORDINGS_PREFIX,
  prefix2graph,
  RDF_PREDICATE,
  SCHEMA_PREDICATE,
  SCHEMA_TYPE,
  XSD_DATATYPE,
} from '@music-kg/sparql-data';

import { createInsertQuery } from '../../../helpers/queries/create-insert-query';
import { getSecondaryEntityTriples } from '../../../helpers/get-secondary-entity-triples';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';

export const createAlbum = async (request: CreateAlbumRequest): Promise<string> => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const artistsPrefix: string = replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX);
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);

  const albumSubject: IriTerm = iriWithPrefix(albumsPrefix, crypto.randomUUID());

  const albumsTriples: Triple[] = request.artists
    ? await getSecondaryEntityTriples(
        albumSubject,
        SCHEMA_PREDICATE.album.iri,
        artistsPrefix,
        Array.isArray(request.artists) ? request.artists : [request.artists]
      )
    : [];
  const tracksTriples: Triple[] = request.tracks
    ? await getSecondaryEntityTriples(
        albumSubject,
        SCHEMA_PREDICATE.track.iri,
        recordingsPrefix,
        Array.isArray(request.tracks) ? request.tracks : [request.tracks]
      )
    : [];

  const triples: Triple[] = [
    { subject: albumSubject, predicate: RDF_PREDICATE.type.iri, object: SCHEMA_TYPE.MusicAlbum.iri },
    { subject: albumSubject, predicate: SCHEMA_PREDICATE.name.iri, object: literal(request.name, XSD_DATATYPE.string) },
    ...albumsTriples,
    ...tracksTriples,
    ...(request.albumProductionType
      ? [
          {
            subject: albumSubject,
            predicate: SCHEMA_PREDICATE.albumProductionType.iri,
            object: SCHEMA_TYPE[request.albumProductionType].iri,
          },
        ]
      : []),
    ...(request.albumReleaseType
      ? [
          {
            subject: albumSubject,
            predicate: SCHEMA_PREDICATE.albumReleaseType.iri,
            object: SCHEMA_TYPE[request.albumReleaseType].iri,
          },
        ]
      : []),
    ...(request.datePublished
      ? [
          {
            subject: albumSubject,
            predicate: SCHEMA_PREDICATE.datePublished.iri,
            object: literal(request.datePublished, XSD_DATATYPE.date),
          },
        ]
      : []),
    ...(request.imageUrl
      ? [
          {
            subject: albumSubject,
            predicate: SCHEMA_PREDICATE.image.iri,
            object: iri(request.imageUrl),
          },
        ]
      : []),
    ...(request.numTracks
      ? [
          {
            subject: albumSubject,
            predicate: SCHEMA_PREDICATE.numTracks.iri,
            object: literal(request.numTracks.toString(), XSD_DATATYPE.integer),
          },
        ]
      : []),
    ...(request.externalUrls
      ? Object.values(request.externalUrls).map(
          (externalUrl: string): Triple => ({
            subject: albumSubject,
            predicate: SCHEMA_PREDICATE.sameAs.iri,
            object: iri(externalUrl),
          })
        )
      : []),
  ];

  const query: string = createInsertQuery({ graph: prefix2graph(albumsPrefix), triples });

  return axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, { headers: { 'Content-Type': 'application/sparql-update' } })
    .then(() => albumSubject?.value);
};
