import { SCHEMA_PREFIX } from '../sparql-prefix.model';
import { iri } from '../utils';

export const SCHEMA_PREDICATE = {
  album: iri(SCHEMA_PREFIX, 'album'),
  albumProductionType: iri(SCHEMA_PREFIX, 'albumProductionType'),
  albumRelease: iri(SCHEMA_PREFIX, 'albumRelease'),
  albumReleaseType: iri(SCHEMA_PREFIX, 'albumReleaseType'),
  byArtist: iri(SCHEMA_PREFIX, 'byArtist'),
  datePublished: iri(SCHEMA_PREFIX, 'datePublished'),
  duration: iri(SCHEMA_PREFIX, 'duration'),
  email: iri(SCHEMA_PREFIX, 'email'),
  genre: iri(SCHEMA_PREFIX, 'genre'),
  image: iri(SCHEMA_PREFIX, 'image'),
  inAlbum: iri(SCHEMA_PREFIX, 'inAlbum'),
  isrcCode: iri(SCHEMA_PREFIX, 'isrcCode'),
  name: iri(SCHEMA_PREFIX, 'name'),
  numTracks: iri(SCHEMA_PREFIX, 'numTracks'),
  producer: iri(SCHEMA_PREFIX, 'producer'),
  recordingOf: iri(SCHEMA_PREFIX, 'recordingOf'),
  track: iri(SCHEMA_PREFIX, 'track'),
  url: iri(SCHEMA_PREFIX, 'url'),
} as const;
