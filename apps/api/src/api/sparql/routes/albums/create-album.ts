import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { CreateAlbumRequest } from '@music-kg/data';
import {
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

export const createAlbum = async (request: CreateAlbumRequest): Promise<string> => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const artistsPrefix: string = replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX);
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);

  const albumSubject: IriTerm = iri(albumsPrefix, request.id);
  const triples: Triple[] = [
    { subject: albumSubject, predicate: RDF_PREDICATE.type.iri, object: SCHEMA_TYPE.MusicAlbum.iri },
    {
      subject: albumSubject,
      predicate: SCHEMA_PREDICATE.albumProductionType.iri,
      object: SCHEMA_TYPE[request.albumProductionType].iri,
    },
    {
      subject: albumSubject,
      predicate: SCHEMA_PREDICATE.albumReleaseType.iri,
      object: SCHEMA_TYPE[request.albumReleaseType].iri,
    },
    {
      subject: albumSubject,
      predicate: SCHEMA_PREDICATE.datePublished.iri,
      object: literal(request.datePublished, XSD_DATATYPE.date),
    },
    {
      subject: albumSubject,
      predicate: SCHEMA_PREDICATE.image.iri,
      object: literal(request.image, XSD_DATATYPE.anyURI),
    },
    { subject: albumSubject, predicate: SCHEMA_PREDICATE.name.iri, object: literal(request.name, XSD_DATATYPE.string) },
    {
      subject: albumSubject,
      predicate: SCHEMA_PREDICATE.sameAs.iri,
      object: literal(request.sameAs, XSD_DATATYPE.anyURI),
    },
    {
      subject: albumSubject,
      predicate: SCHEMA_PREDICATE.numTracks.iri,
      object: literal(request.numTracks, XSD_DATATYPE.integer),
    },
    ...(request.byArtist
      ? request.byArtist.map((artist) => ({
          subject: albumSubject,
          predicate: SCHEMA_PREDICATE.byArtist.iri,
          object: iri(artistsPrefix, artist),
        }))
      : []),
    ...(request.track
      ? request.track.map((track) => ({
          subject: albumSubject,
          predicate: SCHEMA_PREDICATE.track.iri,
          object: iri(recordingsPrefix, track),
        }))
      : []),
  ];

  const query: string = createInsertQuery({ graph: prefix2graph(albumsPrefix), triples });

  return axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, { headers: { 'Content-Type': 'application/sparql-update' } })
    .then(() => albumSubject?.value);
};
