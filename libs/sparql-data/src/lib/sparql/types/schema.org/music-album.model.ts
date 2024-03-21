import { EntityId } from '../entity-id.type';
import { MusicAlbumProductionType } from './music-album-production-type.enum';
import { MusicAlbumReleaseType } from './music-album-release-type.enum';
import { MusicPlaylist } from './music-playlist.model';

/**
 * Reflects https://schema.org/MusicAlbum
 */
export type MusicAlbum = MusicPlaylist & {
  albumProductionType: MusicAlbumProductionType;
  albumRelease: EntityId; // entity of type MusicRelease
  albumReleaseType: MusicAlbumReleaseType;
  byArtist: EntityId; // entity of type either Person or MusicGroup
};
