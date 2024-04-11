import { EntityData } from './entity-data.model';
import { ExternalUrls } from './external-urls.model';

export type CreateRecordingRequest = {
  album: EntityData;
  artists: EntityData | EntityData[];
  name: string;
  externalUrls?: ExternalUrls;
  datePublished?: string;
  duration?: number; // in milliseconds
  isrc?: string;
};
