import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { CreateArtistRequest } from '@music-kg/data';
import {
  externalIri,
  iri,
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
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const createArtist = async (request: CreateArtistRequest): Promise<string> => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const artistsPrefix: string = replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX);
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);

  const artistSubject: IriTerm = iri(artistsPrefix, request.id);

  const triples: Triple[] = [
    { subject: artistSubject, predicate: RDF_PREDICATE.type.iri, object: SCHEMA_TYPE.MusicGroup.iri },
    ...(request.album
      ? request.album.map((albumId: string) => ({
          subject: artistSubject,
          predicate: SCHEMA_PREDICATE.album.iri,
          object: iri(albumsPrefix, albumId),
        }))
      : []),
    ...(request.genre
      ? request.genre.map((genre: string) => ({
          subject: artistSubject,
          predicate: SCHEMA_PREDICATE.genre.iri,
          object: literal(genre, XSD_DATATYPE.string),
        }))
      : []),
    ...(request.track
      ? request.track.map((trackId: string) => ({
          subject: artistSubject,
          predicate: SCHEMA_PREDICATE.track.iri,
          object: iri(recordingsPrefix, trackId),
        }))
      : []),
    {
      subject: artistSubject,
      predicate: SCHEMA_PREDICATE.image.iri,
      object: externalIri(request.image),
    },
    {
      subject: artistSubject,
      predicate: SCHEMA_PREDICATE.name.iri,
      object: literal(request.name, XSD_DATATYPE.string),
    },
    {
      subject: artistSubject,
      predicate: SCHEMA_PREDICATE.sameAs.iri,
      object: externalIri(request.sameAs),
    },
  ];

  const query: string = createInsertQuery({ graph: prefix2graph(artistsPrefix), triples });

  return await axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, { headers: { 'Content-Type': 'application/sparql-update' } })
    .then(() => artistSubject?.value);
};
