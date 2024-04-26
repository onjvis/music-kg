import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

import { DataOrigin, mapExternalUrl2property } from '@music-kg/data';
import { MusicAlbum } from '@music-kg/sparql-data';

import { FlexRow } from '../../../components/flex-row';
import { FlexTextRow } from '../../../components/flex-text-row';
import { AppRoute } from '../../../models/enums/app-route.enum';
import { getSparqlLinks } from '../../../services/get-sparql-links';
import { CustomLink } from './custom-link';
import { EntitySameAsLinks } from './entity-same-as-links';

export const AlbumDetail = () => {
  const [links, setLinks] = useState<string[]>([]);
  const album: MusicAlbum = (useLoaderData() as AxiosResponse)?.data;
  const { origin } = useParams();

  const navigate = useNavigate();

  const handleBack = (): void => navigate(-1);

  useEffect(() => {
    if (album.id && origin) {
      getSparqlLinks(album.id, origin as DataOrigin).then((links) => setLinks(links));
    }
  }, [album.id, origin]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-start justify-between gap-2">
        <div className="flex flex-row items-center gap-4">
          <IconContext.Provider value={{ size: '2em' }}>
            <FaAngleLeft className="cursor-pointer" onClick={handleBack} />
          </IconContext.Provider>
          <h2 className="font-bold">{album?.name}</h2>
        </div>
        {album?.image && (
          <img
            className="rounded-md hover:h-1/3 hover:w-1/3"
            alt={album?.name ?? 'artist'}
            src={album.image}
            height="32"
            width="32"
          />
        )}
      </div>
      {album?.id && <FlexTextRow label="MusicKG ID" value={album.id} />}
      {album?.albumProductionType && <FlexTextRow label="Album Production Type" value={album.albumProductionType} />}
      {album?.albumReleaseType && <FlexTextRow label="Album Release Type" value={album.albumReleaseType} />}
      {album?.byArtist && (
        <FlexRow
          label={Array.isArray(album.byArtist) ? 'Artists' : 'Artist'}
          element={
            Array.isArray(album.byArtist) ? (
              <div className="flex flex-col items-end gap-1">
                {album.byArtist.map((artistId: string) => (
                  <CustomLink
                    key={`${album.id}:artistId:${artistId}`}
                    linkTitle={artistId}
                    to={`${AppRoute.BROWSE_ARTISTS}/${origin}/${artistId}`}
                  />
                ))}
              </div>
            ) : (
              <CustomLink linkTitle={album.byArtist} to={`${AppRoute.BROWSE_ARTISTS}/${origin}/${album.byArtist}`} />
            )
          }
        />
      )}
      {album?.datePublished && (
        <FlexTextRow label="Date Published" value={new Date(album.datePublished).toLocaleDateString()} />
      )}
      {album?.numTracks && <FlexTextRow label="Number of Tracks" value={album.numTracks.toString()} />}
      {album?.track && (
        <FlexRow
          label={Array.isArray(album.track) ? 'Tracks' : 'Track'}
          element={
            Array.isArray(album.track) ? (
              <div className="flex flex-col items-end gap-1">
                {album.track.map((trackId: string) => (
                  <CustomLink
                    key={`${album.id}:trackId:${trackId}`}
                    linkTitle={trackId}
                    to={`${AppRoute.BROWSE_TRACKS}/${origin}/${trackId}`}
                  />
                ))}
              </div>
            ) : (
              <CustomLink linkTitle={album.track} to={`${AppRoute.BROWSE_TRACKS}/${origin}/${album.track}`} />
            )
          }
        />
      )}
      {album?.url && (
        <FlexRow
          label={Array.isArray(album.url) ? 'External URLs' : 'External URL'}
          element={
            Array.isArray(album.url) ? (
              <div className="flex flex-col gap-1">
                {album.url.map((externalUrl: string) => (
                  <CustomLink
                    key={`${album.id}:externalUrl:${externalUrl}`}
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
                linkTitle={mapExternalUrl2property(album.url) ?? album.url}
                newTab={true}
                to={album.url}
              />
            )
          }
        />
      )}
      {links?.length > 0 && <EntitySameAsLinks entityRoutePrefix={AppRoute.BROWSE_ALBUMS} links={links} />}
    </div>
  );
};
