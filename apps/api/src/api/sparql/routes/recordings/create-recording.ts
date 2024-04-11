import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { CreateRecordingRequest } from '@music-kg/data';
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
import { ms2Duration } from './recordings.helpers';

export const createRecording = async (request: CreateRecordingRequest): Promise<string> => {
  const albumsPrefix: string = replaceBaseUri(MUSIC_KG_ALBUMS_PREFIX);
  const artistsPrefix: string = replaceBaseUri(MUSIC_KG_ARTISTS_PREFIX);
  const recordingsPrefix: string = replaceBaseUri(MUSIC_KG_RECORDINGS_PREFIX);

  const recordingSubject: IriTerm = iriWithPrefix(recordingsPrefix, crypto.randomUUID());

  const albumTriples: Triple[] = request.album
    ? await getSecondaryEntityTriples(recordingSubject, SCHEMA_PREDICATE.inAlbum.iri, albumsPrefix, [request?.album])
    : [];
  const artistTriples: Triple[] = request?.artists
    ? await getSecondaryEntityTriples(
        recordingSubject,
        SCHEMA_PREDICATE.byArtist.iri,
        artistsPrefix,
        Array.isArray(request?.artists) ? request?.artists : [request?.artists]
      )
    : [];

  const triples: Triple[] = [
    { subject: recordingSubject, predicate: RDF_PREDICATE.type.iri, object: SCHEMA_TYPE.MusicRecording.iri },
    {
      subject: recordingSubject,
      predicate: SCHEMA_PREDICATE.name.iri,
      object: literal(request.name, XSD_DATATYPE.string),
    },
    ...albumTriples,
    ...artistTriples,
    ...(request.datePublished
      ? [
          {
            subject: recordingSubject,
            predicate: SCHEMA_PREDICATE.datePublished.iri,
            object: literal(request.datePublished, XSD_DATATYPE.date),
          },
        ]
      : []),
    ...(request.duration
      ? [
          {
            subject: recordingSubject,
            predicate: SCHEMA_PREDICATE.duration.iri,
            object: literal(ms2Duration(request.duration), XSD_DATATYPE.duration),
          },
        ]
      : []),
    ...(request.isrc
      ? [
          {
            subject: recordingSubject,
            predicate: SCHEMA_PREDICATE.isrcCode.iri,
            object: literal(request.isrc, XSD_DATATYPE.string),
          },
        ]
      : []),
    ...(request.externalUrls
      ? Object.values(request.externalUrls).map(
          (externalUrl: string): Triple => ({
            subject: recordingSubject,
            predicate: SCHEMA_PREDICATE.sameAs.iri,
            object: iri(externalUrl),
          })
        )
      : []),
  ];

  const query: string = createInsertQuery({ graph: prefix2graph(recordingsPrefix), triples });

  return axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, { headers: { 'Content-Type': 'application/sparql-update' } })
    .then(() => recordingSubject?.value);
};
