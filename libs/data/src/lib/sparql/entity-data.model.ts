import { EntityId } from '@music-kg/sparql-data';

import { EntityType } from './entity-type.model';
import { ExternalUrls } from './external-urls.model';

export type EntityData = {
  type: EntityType;
  externalUrls?: ExternalUrls;
  id?: EntityId;
  name?: string;
};
