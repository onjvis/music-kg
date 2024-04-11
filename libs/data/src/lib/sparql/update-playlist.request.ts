import { EntityData } from './entity-data.model';
import { ExternalUrls } from './external-urls.model';

export type UpdatePlaylistRequest = {
  creators?: EntityData | EntityData[];
  description?: string;
  externalUrls?: ExternalUrls;
  imageUrl?: string;
  name?: string;
  numTracks?: number;
  tracks?: EntityData | EntityData[];
};
