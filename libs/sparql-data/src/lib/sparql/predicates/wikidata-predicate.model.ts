import { WIKIDATA_PROP_PREFIX } from '../sparql-prefix.model';
import { iriWithPrefix } from '../utils';

enum WikidataPredicateName {
  SPOTIFY_ALBUM_ID = 'P2205',
  SPOTIFY_ARTIST_ID = 'P1902',
  SPOTIFY_TRACK_ID = 'P2207',
}

export const WIKIDATA_PREDICATE = {
  spotifyAlbumId: {
    name: WikidataPredicateName.SPOTIFY_ALBUM_ID,
    iri: iriWithPrefix(WIKIDATA_PROP_PREFIX, WikidataPredicateName.SPOTIFY_ALBUM_ID),
  },
  spotifyArtistId: {
    name: WikidataPredicateName.SPOTIFY_ARTIST_ID,
    iri: iriWithPrefix(WIKIDATA_PROP_PREFIX, WikidataPredicateName.SPOTIFY_ARTIST_ID),
  },
  spotifyTrackId: {
    name: WikidataPredicateName.SPOTIFY_TRACK_ID,
    iri: iriWithPrefix(WIKIDATA_PROP_PREFIX, WikidataPredicateName.SPOTIFY_TRACK_ID),
  },
} as const;
