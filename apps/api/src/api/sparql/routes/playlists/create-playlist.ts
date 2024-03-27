import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { CreatePlaylistRequest } from '@music-kg/data';
import {
  iri,
  literal,
  MUSIC_KG_PLAYLISTS_PREFIX,
  MUSIC_KG_RECORDINGS_PREFIX,
  MUSIC_KG_USERS_PREFIX,
  prefix2graph,
  RDF_PREDICATE,
  SCHEMA_PREDICATE,
  SCHEMA_TYPE,
  XSD_DATATYPE,
} from '@music-kg/sparql-data';

import { createInsertQuery } from '../../helpers/queries/create-insert-query';
import { replaceBaseUri } from '../../helpers/replace-base-uri';

export const createPlaylist = async (request: CreatePlaylistRequest): Promise<string> => {
  const playlistsPrefix: string = replaceBaseUri(MUSIC_KG_PLAYLISTS_PREFIX);
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);
  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);

  const dateTimeISO: string = new Date().toISOString();

  const playlistSubject: IriTerm = iri(playlistsPrefix, request.id);
  const triples: Triple[] = [
    { subject: playlistSubject, predicate: RDF_PREDICATE.type.iri, object: SCHEMA_TYPE.MusicPlaylist.iri },
    { subject: playlistSubject, predicate: SCHEMA_PREDICATE.creator.iri, object: iri(usersPrefix, request.creator) },
    {
      subject: playlistSubject,
      predicate: SCHEMA_PREDICATE.dateCreated.iri,
      object: literal(dateTimeISO, XSD_DATATYPE.dateTime),
    },
    {
      subject: playlistSubject,
      predicate: SCHEMA_PREDICATE.dateModified.iri,
      object: literal(dateTimeISO, XSD_DATATYPE.dateTime),
    },
    {
      subject: playlistSubject,
      predicate: SCHEMA_PREDICATE.image.iri,
      object: literal(request.image, XSD_DATATYPE.anyURI),
    },
    {
      subject: playlistSubject,
      predicate: SCHEMA_PREDICATE.name.iri,
      object: literal(request.name, XSD_DATATYPE.string),
    },
    {
      subject: playlistSubject,
      predicate: SCHEMA_PREDICATE.sameAs.iri,
      object: literal(request.sameAs, XSD_DATATYPE.anyURI),
    },
    {
      subject: playlistSubject,
      predicate: SCHEMA_PREDICATE.numTracks.iri,
      object: literal(request.numTracks, XSD_DATATYPE.integer),
    },
    ...(request.description
      ? [
          {
            subject: playlistSubject,
            predicate: SCHEMA_PREDICATE.description.iri,
            object: literal(request.description, XSD_DATATYPE.string),
          },
        ]
      : []),
    ...(request.track
      ? request.track.map((trackId: string) => ({
          subject: playlistSubject,
          predicate: SCHEMA_PREDICATE.track.iri,
          object: iri(recordingsPrefix, trackId),
        }))
      : []),
  ];

  const query: string = createInsertQuery({ graph: prefix2graph(playlistsPrefix), triples });

  return await axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, { headers: { 'Content-Type': 'application/sparql-update' } })
    .then(() => playlistSubject?.value);
};
