import { MusicAlbumProductionType, MusicAlbumReleaseType } from '@music-kg/sparql-data';

import { EntityData } from './entity-data.model';
import { ExternalUrls } from './external-urls.model';

export type UpdateAlbumRequest = {
  albumProductionType?: MusicAlbumProductionType;
  albumReleaseType?: MusicAlbumReleaseType;
  artists?: EntityData | EntityData[];
  datePublished?: string;
  externalUrls?: ExternalUrls;
  imageUrl?: string;
  name?: string;
  numTracks?: number;
  tracks?: EntityData | EntityData[];
};
