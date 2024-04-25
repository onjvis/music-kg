import axios from 'axios';
import { IriTerm, Triple } from 'sparqljs';

import { CreateArtistRequest, DataOrigin } from '@music-kg/data';
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
import { getSecondaryEntityTriples } from '../../../helpers/get-secondary-entity-triples';
import { getPrefixFromOrigin } from '../../../helpers/get-prefix-from-origin';

export const createArtist = async (request: CreateArtistRequest, origin: DataOrigin): Promise<string> => {
  const originPrefix: string = getPrefixFromOrigin(origin);

  const id: string = await generateUniqueId(origin);
  const artistSubject: IriTerm = iriWithPrefix(originPrefix, id);

  const albumsTriples: Triple[] = request.albums
    ? await getSecondaryEntityTriples(
        artistSubject,
        SCHEMA_PREDICATE.album.iri,
        originPrefix,
        Array.isArray(request.albums) ? request.albums : [request.albums],
        origin
      )
    : [];
  const tracksTriples: Triple[] = request.tracks
    ? await getSecondaryEntityTriples(
        artistSubject,
        SCHEMA_PREDICATE.track.iri,
        originPrefix,
        Array.isArray(request.tracks) ? request.tracks : [request.tracks],
        origin
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
            predicate: SCHEMA_PREDICATE.url.iri,
            object: iri(externalUrl),
          })
        )
      : []),
  ];

  const query: string = createInsertQuery({ graph: prefix2graph(originPrefix), triples });

  return await axios
    .post(process.env.MUSIC_KG_SPARQL_ENDPOINT, query, { headers: { 'Content-Type': 'application/sparql-update' } })
    .then(() => artistSubject?.value);
};
