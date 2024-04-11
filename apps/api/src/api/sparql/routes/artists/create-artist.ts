import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { CreateArtistRequest } from '@music-kg/data';
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

import { createInsertQuery } from '../../helpers/queries/create-insert-query';
import { getSecondaryEntityTriples } from '../../helpers/get-secondary-entity-triples';
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const createArtist = async (request: CreateArtistRequest): Promise<string> => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const artistsPrefix: string = replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX);
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);

  const artistSubject: IriTerm = iriWithPrefix(artistsPrefix, crypto.randomUUID());

  const albumsTriples: Triple[] = request.albums
    ? await getSecondaryEntityTriples(
        artistSubject,
        SCHEMA_PREDICATE.album.iri,
        albumsPrefix,
        Array.isArray(request.albums) ? request.albums : [request.albums]
      )
    : [];
  const tracksTriples: Triple[] = request.tracks
    ? await getSecondaryEntityTriples(
        artistSubject,
        SCHEMA_PREDICATE.track.iri,
        recordingsPrefix,
        Array.isArray(request.tracks) ? request.tracks : [request.tracks]
      )
    : [];
  const genresTriples: Triple[] = request.genres
    ? Array.isArray(request.genres)
      ? request.genres.map(
          (genre: string): Triple => ({
            subject: artistSubject,
            predicate: SCHEMA_PREDICATE.genre.iri,
            object: literal(genre, XSD_DATATYPE.string),
          })
        )
      : [
          {
            subject: artistSubject,
            predicate: SCHEMA_PREDICATE.genre.iri,
            object: literal(request.genres, XSD_DATATYPE.string),
          },
        ]
    : [];

  const triples: Triple[] = [
    { subject: artistSubject, predicate: RDF_PREDICATE.type.iri, object: SCHEMA_TYPE.MusicGroup.iri },
    {
      subject: artistSubject,
      predicate: SCHEMA_PREDICATE.name.iri,
      object: literal(request.name, XSD_DATATYPE.string),
    },
    ...albumsTriples,
    ...tracksTriples,
    ...genresTriples,
    ...(request.imageUrl
      ? [
          {
            subject: artistSubject,
            predicate: SCHEMA_PREDICATE.image.iri,
            object: iri(request.imageUrl),
          },
        ]
      : []),
    ...(request.externalUrls
      ? Object.values(request.externalUrls).map(
          (externalUrl: string): Triple => ({
            subject: artistSubject,
            predicate: SCHEMA_PREDICATE.sameAs.iri,
            object: iri(externalUrl),
          })
        )
      : []),
  ];

  const query: string = createInsertQuery({ graph: prefix2graph(artistsPrefix), triples });

  return await axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, { headers: { 'Content-Type': 'application/sparql-update' } })
    .then(() => artistSubject?.value);
};
