import { EntityData } from './entity-data.model';
import { ExternalUrls } from './external-urls.model';

export type UpdateRecordingRequest = {
  album?: EntityData;
  artists?: EntityData | EntityData[];
  externalUrls?: ExternalUrls;
  datePublished?: string;
  duration?: number; // in milliseconds
  isrc?: string;
  name?: string;
};
