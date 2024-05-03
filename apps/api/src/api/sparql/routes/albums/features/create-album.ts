import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { CreateAlbumRequest, DataOrigin } from '@music-kg/data';
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

import { createInsertQuery } from '../../../helpers/queries/create-insert-query';
import { getSecondaryEntityTriples } from '../../../helpers/get-secondary-entity-triples';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';
import { generateUniqueId } from '../../../features/generate-unique-id';

export const createAlbum = async (request: CreateAlbumRequest, origin: DataOrigin): Promise<string> => {
  const originPrefix: string = getPrefixFromOrigin(origin);

  const id: string = await generateUniqueId(origin);
  const albumSubject: IriTerm = iriWithPrefix(originPrefix, id);

  const albumsTriples: Triple[] = request.artists
    ? await getSecondaryEntityTriples(
        albumSubject,
        SCHEMA_PREDICATE.byArtist.iri,
        originPrefix,
        Array.isArray(request.artists) ? request.artists : [request.artists],
        origin
      )
    : [];
  const tracksTriples: Triple[] = request.tracks
    ? await getSecondaryEntityTriples(
        albumSubject,
        SCHEMA_PREDICATE.track.iri,
        originPrefix,
        Array.isArray(request.tracks) ? request.tracks : [request.tracks],
        origin
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
            predicate: SCHEMA_PREDICATE.url.iri,
            object: iri(externalUrl),
          })
        )
      : []),
  ];

  const query: string = createInsertQuery({ graph: prefix2graph(originPrefix), triples });

  return axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, { headers: { 'Content-Type': 'application/sparql-update' } })
    .then(() => albumSubject?.value);
};
