import { EntityId } from '../entity-id.type';
import { Thing } from './thing.model';

/**
 * Reflects https://schema.org/MusicRecording
 */
export type MusicGroup = Thing & {
  album: EntityId[]; // entities of type MusicAlbum
  genre: string[];
  track: EntityId[]; // entities of type MusicRecording
};
