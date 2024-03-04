import { SCHEMA_PREFIX } from '../sparql-prefix.model';
import { iri } from '../utils';

export const SCHEMA_TYPE = {
  Person: iri(SCHEMA_PREFIX, 'Person'),

  MusicAlbum: iri(SCHEMA_PREFIX, 'MusicAlbum'),
  MusicGroup: iri(SCHEMA_PREFIX, 'MusicGroup'),
  MusicRecording: iri(SCHEMA_PREFIX, 'MusicRecording'),

  StudioAlbum: iri(SCHEMA_PREFIX, 'StudioAlbum'),

  AlbumRelease: iri(SCHEMA_PREFIX, 'AlbumRelease'),
  SingleRelease: iri(SCHEMA_PREFIX, 'SingleRelease'),
} as const;
