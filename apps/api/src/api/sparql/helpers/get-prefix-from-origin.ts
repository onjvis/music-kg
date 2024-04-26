import { DataOrigin } from '@music-kg/data';
import {
  MUSIC_KG_LOCAL_PREFIX,
  MUSIC_KG_SPOTIFY_PREFIX,
  MUSIC_KG_USERS_PREFIX,
  MUSIC_KG_WIKIDATA_PREFIX,
} from '@music-kg/sparql-data';

import { replaceBaseUri } from './replace-base-uri';

export const getPrefixFromOrigin = (origin: DataOrigin): string => {
  switch (origin) {
    case DataOrigin.SPOTIFY:
      return replaceBaseUri(MUSIC_KG_SPOTIFY_PREFIX);
    case DataOrigin.LOCAL_USERS:
      return replaceBaseUri(MUSIC_KG_USERS_PREFIX);
    case DataOrigin.DUMP_WIKIDATA:
      return replaceBaseUri(MUSIC_KG_WIKIDATA_PREFIX);
    case DataOrigin.LOCAL:
    default:
      return replaceBaseUri(MUSIC_KG_LOCAL_PREFIX);
  }
};
