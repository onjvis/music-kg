import { EntityData } from './entity-data.model';
import { ExternalUrls } from './external-urls.model';

export type CreatePlaylistRequest = {
  name: string;
  creators?: EntityData | EntityData[];
  description?: string;
  externalUrls?: ExternalUrls;
  imageUrl?: string;
  numTracks?: number;
  tracks?: EntityData | EntityData[];
};
