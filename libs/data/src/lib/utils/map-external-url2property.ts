export const mapExternalUrl2property = (externalUrl: string): string | undefined => {
  if (externalUrl.startsWith(EXTERNAL_URL_PREFIX.SpotifyUrlPrefix)) {
    return EXTERNAL_URL_PROPERTY_MAPPER.get(EXTERNAL_URL_PREFIX.SpotifyUrlPrefix) as string;
  } else if (externalUrl.startsWith(EXTERNAL_URL_PREFIX.WikidataUrlPrefix)) {
    return EXTERNAL_URL_PROPERTY_MAPPER.get(EXTERNAL_URL_PREFIX.WikidataUrlPrefix) as string;
  }

  return undefined;
};

const EXTERNAL_URL_PREFIX = {
  SpotifyUrlPrefix: 'https://open.spotify.com/',
  WikidataUrlPrefix: 'https://www.wikidata.org/',
} as const;

const EXTERNAL_URL_PROPERTY_MAPPER: Map<string, string> = new Map<string, string>([
  [EXTERNAL_URL_PREFIX.SpotifyUrlPrefix, 'spotify'],
  [EXTERNAL_URL_PREFIX.WikidataUrlPrefix, 'wikidata'],
]);
