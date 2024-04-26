import { AxiosResponse } from 'axios';
import { FaAngleLeft } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

import { DataOrigin, mapExternalUrl2property } from '@music-kg/data';
import { MusicGroup } from '@music-kg/sparql-data';

import { FlexRow } from '../../../components/flex-row';
import { FlexTextRow } from '../../../components/flex-text-row';
import { AppRoute } from '../../../models/enums/app-route.enum';
import { CustomLink } from './custom-link';
import { useEffect, useState } from 'react';
import { getSparqlLinks } from '../../../services/get-sparql-links';
import { EntitySameAsLinks } from './entity-same-as-links';

export const ArtistDetail = () => {
  const [links, setLinks] = useState<string[]>([]);
  const artist: MusicGroup = (useLoaderData() as AxiosResponse)?.data;
  const { origin } = useParams();

  const navigate = useNavigate();

  const handleBack = (): void => navigate(-1);

  useEffect(() => {
    if (artist.id && origin) {
      getSparqlLinks(artist.id, origin as DataOrigin).then((links) => setLinks(links));
    }
  }, [artist.id, origin]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-start justify-between gap-2">
        <div className="flex flex-row items-center gap-4">
          <IconContext.Provider value={{ size: '2em' }}>
            <FaAngleLeft className="cursor-pointer" onClick={handleBack} />
          </IconContext.Provider>
          <h2 className="font-bold">{artist?.name}</h2>
        </div>
        {artist?.image && (
          <img
            className="rounded-md hover:h-1/3 hover:w-1/3"
            alt={artist?.name ?? 'artist'}
            src={artist.image}
            height="32"
            width="32"
          />
        )}
      </div>
      {artist?.id && <FlexTextRow label="MusicKG ID" value={artist.id} />}
      {artist?.album && (
        <FlexRow
          label={Array.isArray(artist.album) ? 'Albums' : 'Album'}
          element={
            Array.isArray(artist.album) ? (
              <div className="flex flex-col items-end gap-1">
                {artist.album.map((albumId: string) => (
                  <CustomLink
                    key={`${artist.id}:albumId:${albumId}`}
                    linkTitle={albumId}
                    to={`${AppRoute.BROWSE_ALBUMS}/${origin}/${albumId}`}
                  />
                ))}
              </div>
            ) : (
              <CustomLink linkTitle={artist.album} to={`${AppRoute.BROWSE_ALBUMS}/${origin}/${artist.album}`} />
            )
          }
        />
      )}
      {artist?.genre && (
        <FlexRow
          label={Array.isArray(artist.genre) ? 'Genres' : 'Genre'}
          element={
            Array.isArray(artist.genre) ? (
              <div className="flex flex-col items-end gap-1">
                {artist.genre.map((genre: string) => (
                  <span key={`${artist.id}:genre:${genre}`}>{genre}</span>
                ))}
              </div>
            ) : (
              <span>{artist.genre}</span>
            )
          }
        />
      )}
      {artist?.track && (
        <FlexRow
          label={Array.isArray(artist.track) ? 'Tracks' : 'Track'}
          element={
            Array.isArray(artist.track) ? (
              <div className="flex flex-col items-end gap-1">
                {artist.track.map((trackId: string) => (
                  <CustomLink
                    key={`${artist.id}:trackId:${trackId}`}
                    linkTitle={trackId}
                    to={`${AppRoute.BROWSE_TRACKS}/${origin}/${trackId}`}
                  />
                ))}
              </div>
            ) : (
              <CustomLink linkTitle={artist.track} to={`${AppRoute.BROWSE_TRACKS}/${origin}/${artist.track}`} />
            )
          }
        />
      )}
      {artist?.url && (
        <FlexRow
          label={Array.isArray(artist.url) ? 'External URLs' : 'External URL'}
          element={
            Array.isArray(artist.url) ? (
              <div className="flex flex-col gap-1">
                {artist.url.map((externalUrl: string) => (
                  <CustomLink
                    key={`${artist.id}:externalUrl:${externalUrl}`}
                    capitalize={true}
                    linkTitle={mapExternalUrl2property(externalUrl) ?? externalUrl}
                    newTab={true}
                    to={externalUrl}
                  />
                ))}
              </div>
            ) : (
              <CustomLink
                capitalize={true}
                linkTitle={mapExternalUrl2property(artist.url) ?? artist.url}
                newTab={true}
                to={artist.url}
              />
            )
          }
        />
      )}
      {links?.length > 0 && <EntitySameAsLinks entityRoutePrefix={AppRoute.BROWSE_ARTISTS} links={links} />}
    </div>
  );
};
