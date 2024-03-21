import { SCHEMA_PREFIX } from '../sparql-prefix.model';
import { iri } from '../utils';

enum SchemaTypeName {
  MUSIC_ALBUM = 'MusicAlbum',
  MUSIC_GROUP = 'MusicGroup',
  MUSIC_PLAYLIST = 'MusicPlaylist',
  MUSIC_RECORDING = 'MusicRecording',
  PERSON = 'Person',

  COMPILATION_ALBUM = 'CompilationAlbum',
  DJ_MIX_ALBUM = 'DJMixAlbum',
  DEMO_ALBUM = 'DemoAlbum',
  LIVE_ALBUM = 'LiveAlbum',
  MIXTAPE_ALBUM = 'MixtapeAlbum',
  REMIX_ALBUM = 'RemixAlbum',
  SOUNDTRACK_ALBUM = 'SoundtrackAlbum',
  SPOKEN_WORD_ALBUM = 'SpokenWordAlbum',
  STUDIO_ALBUM = 'StudioAlbum',

  ALBUM_RELEASE = 'AlbumRelease',
  BROADCAST_RELEASE = 'BroadcastRelease',
  EP_RELEASE = 'EPRelease',
  SINGLE_RELEASE = 'SingleRelease',
}

export const SCHEMA_TYPE = {
  MusicAlbum: { name: SchemaTypeName.MUSIC_ALBUM, iri: iri(SCHEMA_PREFIX, SchemaTypeName.MUSIC_ALBUM) },
  MusicGroup: { name: SchemaTypeName.MUSIC_GROUP, iri: iri(SCHEMA_PREFIX, SchemaTypeName.MUSIC_GROUP) },
  MusicPlaylist: { name: SchemaTypeName.MUSIC_PLAYLIST, iri: iri(SCHEMA_PREFIX, SchemaTypeName.MUSIC_PLAYLIST) },
  MusicRecording: { name: SchemaTypeName.MUSIC_RECORDING, iri: iri(SCHEMA_PREFIX, SchemaTypeName.MUSIC_RECORDING) },
  Person: { name: SchemaTypeName.PERSON, iri: iri(SCHEMA_PREFIX, SchemaTypeName.PERSON) },

  CompilationAlbum: {
    name: SchemaTypeName.COMPILATION_ALBUM,
    iri: iri(SCHEMA_PREFIX, SchemaTypeName.COMPILATION_ALBUM),
  },
  DJMixAlbum: { name: SchemaTypeName.DJ_MIX_ALBUM, iri: iri(SCHEMA_PREFIX, SchemaTypeName.DJ_MIX_ALBUM) },
  DemoAlbum: { name: SchemaTypeName.DEMO_ALBUM, iri: iri(SCHEMA_PREFIX, SchemaTypeName.DEMO_ALBUM) },
  LiveAlbum: { name: SchemaTypeName.LIVE_ALBUM, iri: iri(SCHEMA_PREFIX, SchemaTypeName.LIVE_ALBUM) },
  MixtapeAlbum: { name: SchemaTypeName.MIXTAPE_ALBUM, iri: iri(SCHEMA_PREFIX, SchemaTypeName.MIXTAPE_ALBUM) },
  RemixAlbum: { name: SchemaTypeName.REMIX_ALBUM, iri: iri(SCHEMA_PREFIX, SchemaTypeName.REMIX_ALBUM) },
  SoundtrackAlbum: { name: SchemaTypeName.SOUNDTRACK_ALBUM, iri: iri(SCHEMA_PREFIX, SchemaTypeName.SOUNDTRACK_ALBUM) },
  SpokenWordAlbum: {
    name: SchemaTypeName.SPOKEN_WORD_ALBUM,
    iri: iri(SCHEMA_PREFIX, SchemaTypeName.SPOKEN_WORD_ALBUM),
  },
  StudioAlbum: { name: SchemaTypeName.STUDIO_ALBUM, iri: iri(SCHEMA_PREFIX, SchemaTypeName.STUDIO_ALBUM) },

  AlbumRelease: { name: SchemaTypeName.ALBUM_RELEASE, iri: iri(SCHEMA_PREFIX, SchemaTypeName.ALBUM_RELEASE) },
  BroadcastRelease: {
    name: SchemaTypeName.BROADCAST_RELEASE,
    iri: iri(SCHEMA_PREFIX, SchemaTypeName.BROADCAST_RELEASE),
  },
  EPRelease: { name: SchemaTypeName.EP_RELEASE, iri: iri(SCHEMA_PREFIX, SchemaTypeName.EP_RELEASE) },
  SingleRelease: { name: SchemaTypeName.SINGLE_RELEASE, iri: iri(SCHEMA_PREFIX, SchemaTypeName.SINGLE_RELEASE) },
} as const;
