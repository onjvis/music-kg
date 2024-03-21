import { Thing } from './thing.model';

/**
 * Reflects https://schema.org/Person
 */
export type Person = Thing & {
  email: string;
};
