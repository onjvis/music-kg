import { SCHEMA_PREFIX } from '../sparql-prefix.model';
import { iriWithPrefix } from '../utils';

enum SchemaPredicateName {
  ALBUM = 'album',
  ALBUM_PRODUCTION_TYPE = 'albumProductionType',
  ALBUM_RELEASE = 'albumRelease',
  ALBUM_RELEASE_TYPE = 'albumReleaseType',
  BY_ARTIST = 'byArtist',
  CREATOR = 'creator',
  DATE_CREATED = 'dateCreated',
  DATE_MODIFIED = 'dateModified',
  DATE_PUBLISHED = 'datePublished',
  DESCRIPTION = 'description',
  DURATION = 'duration',
  EMAIL = 'email',
  GENRE = 'genre',
  IMAGE = 'image',
  IN_ALBUM = 'inAlbum',
  ISRC_CODE = 'isrcCode',
  NAME = 'name',
  NUM_TRACKS = 'numTracks',
  PRODUCER = 'producer',
  RECORDING_OF = 'recordingOf',
  SAME_AS = 'sameAs',
  TRACK = 'track',
  URL = 'url',
}

export const SCHEMA_PREDICATE = {
  album: { name: SchemaPredicateName.ALBUM, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.ALBUM) },
  albumProductionType: {
    name: SchemaPredicateName.ALBUM_PRODUCTION_TYPE,
    iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.ALBUM_PRODUCTION_TYPE),
  },
  albumRelease: {
    name: SchemaPredicateName.ALBUM_RELEASE,
    iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.ALBUM_RELEASE),
  },
  albumReleaseType: {
    name: SchemaPredicateName.ALBUM_RELEASE_TYPE,
    iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.ALBUM_RELEASE_TYPE),
  },
  byArtist: { name: SchemaPredicateName.BY_ARTIST, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.BY_ARTIST) },
  creator: { name: SchemaPredicateName.CREATOR, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.CREATOR) },
  dateCreated: {
    name: SchemaPredicateName.DATE_CREATED,
    iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.DATE_CREATED),
  },
  dateModified: {
    name: SchemaPredicateName.DATE_MODIFIED,
    iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.DATE_MODIFIED),
  },
  datePublished: {
    name: SchemaPredicateName.DATE_PUBLISHED,
    iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.DATE_PUBLISHED),
  },
  description: {
    name: SchemaPredicateName.DESCRIPTION,
    iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.DESCRIPTION),
  },
  duration: { name: SchemaPredicateName.DURATION, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.DURATION) },
  email: { name: SchemaPredicateName.EMAIL, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.EMAIL) },
  genre: { name: SchemaPredicateName.GENRE, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.GENRE) },
  image: { name: SchemaPredicateName.IMAGE, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.IMAGE) },
  inAlbum: { name: SchemaPredicateName.IN_ALBUM, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.IN_ALBUM) },
  isrcCode: { name: SchemaPredicateName.ISRC_CODE, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.ISRC_CODE) },
  name: { name: SchemaPredicateName.NAME, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.NAME) },
  numTracks: {
    name: SchemaPredicateName.NUM_TRACKS,
    iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.NUM_TRACKS),
  },
  producer: { name: SchemaPredicateName.PRODUCER, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.PRODUCER) },
  recordingOf: {
    name: SchemaPredicateName.RECORDING_OF,
    iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.RECORDING_OF),
  },
  sameAs: { name: SchemaPredicateName.SAME_AS, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.SAME_AS) },
  track: { name: SchemaPredicateName.TRACK, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.TRACK) },
  url: { name: SchemaPredicateName.URL, iri: iriWithPrefix(SCHEMA_PREFIX, SchemaPredicateName.URL) },
} as const;
