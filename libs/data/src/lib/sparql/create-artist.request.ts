import { EntityData } from './entity-data.model';
import { ExternalUrls } from './external-urls.model';

export type CreateArtistRequest = {
  name: string;
  albums?: EntityData | EntityData[];
  externalUrls?: ExternalUrls;
  genres?: string | string[];
  imageUrl?: string;
  tracks?: EntityData | EntityData[];
};
