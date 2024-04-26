import { DataOrigin, EntityType, ExternalUrls } from '@music-kg/data';

export type CreatedEntity = {
  externalUrls: ExternalUrls;
  iri: string;
  origin: DataOrigin;
  type: EntityType;
};
