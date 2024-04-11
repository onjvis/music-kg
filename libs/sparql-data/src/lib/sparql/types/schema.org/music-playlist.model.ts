import { EntityId } from '../entity-id.type';
import { CreativeWork } from './creative-work.model';

/**
 * Reflects https://schema.org/MusicPlaylist
 */
export type MusicPlaylist = CreativeWork & {
  numTracks: number;
  track: EntityId[] | EntityId; // entities of type MusicRecording
};
