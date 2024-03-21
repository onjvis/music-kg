import { EntityId } from '../entity-id.type';
import { CreativeWork } from './creative-work.model';

/**
 * Reflects https://schema.org/MusicRecording
 */
export type MusicRecording = CreativeWork & {
  byArtist: EntityId; // entity of type either Person or MusicGroup
  duration: string;
  inAlbum?: EntityId; // entity of type MusicAlbum
  inPlaylist?: EntityId; // entity of type MusicPlaylist
  isrcCode: string;
};
