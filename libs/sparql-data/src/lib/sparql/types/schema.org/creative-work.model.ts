import { EntityId } from '../entity-id.type';
import { Thing } from './thing.model';

/**
 * Reflects https://schema.org/CreativeWork
 */
export type CreativeWork = Thing & {
  creator?: EntityId; // entity of type Person
  dateCreated?: string;
  dateModified?: string;
  description?: string;
};
