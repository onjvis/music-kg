import { MusicAlbumProductionType, MusicAlbumReleaseType } from '@music-kg/sparql-data';

import { EntityData } from './entity-data.model';
import { ExternalUrls } from './external-urls.model';

export type CreateAlbumRequest = {
  name: string;
  albumProductionType?: MusicAlbumProductionType;
  albumReleaseType?: MusicAlbumReleaseType;
  artists?: EntityData | EntityData[];
  datePublished?: string;
  externalUrls?: ExternalUrls;
  imageUrl?: string;
  numTracks?: number;
  tracks?: EntityData | EntityData[];
};
