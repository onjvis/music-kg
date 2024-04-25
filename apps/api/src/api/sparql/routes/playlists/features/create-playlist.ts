import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { CreatePlaylistRequest, DataOrigin } from '@music-kg/data';
import {
  iri,
  iriWithPrefix,
  literal,
  MUSIC_KG_USERS_PREFIX,
  prefix2graph,
  RDF_PREDICATE,
  SCHEMA_PREDICATE,
  SCHEMA_TYPE,
  XSD_DATATYPE,
} from '@music-kg/sparql-data';

import { generateUniqueId } from '../../../features/generate-unique-id';
import { createInsertQuery } from '../../../helpers/queries/create-insert-query';
import { getSecondaryEntityTriples } from '../../../helpers/get-secondary-entity-triples';
import { replaceBaseUri } from '../../../helpers/replace-base-uri';

export const createPlaylist = async (request: CreatePlaylistRequest, origin: DataOrigin): Promise<string> => {
  const originPrefix: string = getPrefixFromOrigin(origin);
  const usersPrefix: string = replaceBaseUri(MUSIC_KG_USERS_PREFIX);

  const dateTimeISO: string = new Date().toISOString();

  const id: string = await generateUniqueId(origin);
  const playlistSubject: IriTerm = iriWithPrefix(originPrefix, id);

  const creatorsTriples: Triple[] = request.creators
    ? await getSecondaryEntityTriples(
        playlistSubject,
        SCHEMA_PREDICATE.creator.iri,
        usersPrefix,
        Array.isArray(request.creators) ? request.creators : [request.creators],
        origin
      )
    : [];
  const tracksTriples: Triple[] = request.tracks
    ? await getSecondaryEntityTriples(
        playlistSubject,
        SCHEMA_PREDICATE.track.iri,
        originPrefix,
        Array.isArray(request.tracks) ? request.tracks : [request.tracks],
        origin
      )
    : [];

  const triples: Triple[] = [
    { subject: playlistSubject, predicate: RDF_PREDICATE.type.iri, object: SCHEMA_TYPE.MusicPlaylist.iri },
    {
      subject: playlistSubject,
      predicate: SCHEMA_PREDICATE.name.iri,
      object: literal(request.name, XSD_DATATYPE.string),
    },
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
    ...creatorsTriples,
    ...tracksTriples,
    ...(request.description
      ? [
          {
            subject: playlistSubject,
            predicate: SCHEMA_PREDICATE.description.iri,
            object: literal(request.description, XSD_DATATYPE.string),
          },
        ]
      : []),
    ...(request.imageUrl
      ? [
          {
            subject: playlistSubject,
            predicate: SCHEMA_PREDICATE.image.iri,
            object: iri(request.imageUrl),
          },
        ]
      : []),
    ...(request.numTracks
      ? [
          {
            subject: playlistSubject,
            predicate: SCHEMA_PREDICATE.numTracks.iri,
            object: literal(request.numTracks.toString(), XSD_DATATYPE.integer),
          },
        ]
      : []),
    ...(request.externalUrls
      ? Object.values(request.externalUrls).map(
          (externalUrl: string): Triple => ({
            subject: playlistSubject,
            predicate: SCHEMA_PREDICATE.url.iri,
            object: iri(externalUrl),
          })
        )
      : []),
  ];

  const query: string = createInsertQuery({ graph: prefix2graph(originPrefix), triples });

  return await axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, { headers: { 'Content-Type': 'application/sparql-update' } })
    .then(() => playlistSubject?.value);
};
