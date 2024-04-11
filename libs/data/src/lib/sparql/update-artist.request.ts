import { EntityData } from './entity-data.model';
import { ExternalUrls } from './external-urls.model';

export type UpdateArtistRequest = {
  albums?: EntityData | EntityData[];
  externalUrls?: ExternalUrls;
  genres?: string | string[];
  imageUrl?: string;
  name?: string;
  tracks?: EntityData | EntityData[];
};
