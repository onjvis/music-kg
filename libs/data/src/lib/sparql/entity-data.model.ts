import { EntityId } from '@music-kg/sparql-data';

import { ExternalUrls } from './external-urls.model';

export type EntityData = {
  externalUrls?: ExternalUrls;
  id?: EntityId;
  name?: string;
};
