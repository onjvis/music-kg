import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { CreateRecordingRequest, DataOrigin } from '@music-kg/data';
import {
  iri,
  iriWithPrefix,
  literal,
  prefix2graph,
  RDF_PREDICATE,
  SCHEMA_PREDICATE,
  SCHEMA_TYPE,
  XSD_DATATYPE,
} from '@music-kg/sparql-data';

import { generateUniqueId } from '../../../features/generate-unique-id';
import { createInsertQuery } from '../../../helpers/queries/create-insert-query';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';
import { getSecondaryEntityTriples } from '../../../helpers/get-secondary-entity-triples';
import { ms2Duration } from '../recordings.helpers';

export const createRecording = async (request: CreateRecordingRequest, origin: DataOrigin): Promise<string> => {
  const originPrefix: string = getPrefixFromOrigin(origin);

  const id: string = await generateUniqueId(origin);
  const recordingSubject: IriTerm = iriWithPrefix(originPrefix, id);

  const albumTriples: Triple[] = request.album
    ? await getSecondaryEntityTriples(
        recordingSubject,
        SCHEMA_PREDICATE.inAlbum.iri,
        originPrefix,
        [request?.album],
        origin
      )
    : [];
  const artistTriples: Triple[] = request?.artists
    ? await getSecondaryEntityTriples(
        recordingSubject,
        SCHEMA_PREDICATE.byArtist.iri,
        originPrefix,
        Array.isArray(request?.artists) ? request?.artists : [request?.artists],
        origin
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
            predicate: SCHEMA_PREDICATE.url.iri,
            object: iri(externalUrl),
          })
        )
      : []),
  ];

  const query: string = createInsertQuery({ graph: prefix2graph(originPrefix), triples });

  return axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, { headers: { 'Content-Type': 'application/sparql-update' } })
    .then(() => recordingSubject?.value);
};
