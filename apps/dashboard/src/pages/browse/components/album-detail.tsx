import { AxiosResponse } from 'axios';
import { FaAngleLeft } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { mapExternalUrl2property } from '@music-kg/data';
import { MusicAlbum } from '@music-kg/sparql-data';

import { FlexRow } from '../../../components/flex-row';
import { FlexTextRow } from '../../../components/flex-text-row';
import { AppRoute } from '../../../models/enums/app-route.enum';
import { CustomLink } from './custom-link';

export const AlbumDetail = () => {
  const album: MusicAlbum = (useLoaderData() as AxiosResponse)?.data;

  const navigate = useNavigate();

  const handleBack = (): void => navigate(-1);

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
                    to={`${AppRoute.BROWSE_ARTISTS}/${artistId}`}
                  />
                ))}
              </div>
            ) : (
              <CustomLink linkTitle={album.byArtist} to={`${AppRoute.BROWSE_ARTISTS}/${album.byArtist}`} />
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
                    to={`${AppRoute.BROWSE_TRACKS}/${trackId}`}
                  />
                ))}
              </div>
            ) : (
              <CustomLink linkTitle={album.track} to={`${AppRoute.BROWSE_TRACKS}/${album.track}`} />
            )
          }
        />
      )}
      {album?.sameAs && (
        <FlexRow
          label={Array.isArray(album.sameAs) ? 'External URLs' : 'External URL'}
          element={
            Array.isArray(album.sameAs) ? (
              <div className="flex flex-col gap-1">
                {album.sameAs.map((externalUrl: string) => (
                  <CustomLink
                    key={`${album.id}:externalUrl:${externalUrl}`}
                    capitalize={true}
                    linkTitle={mapExternalUrl2property(externalUrl) ?? externalUrl}
                    to={externalUrl}
                  />
                ))}
              </div>
            ) : (
              <CustomLink
                capitalize={true}
                linkTitle={mapExternalUrl2property(album.sameAs) ?? album.sameAs}
                to={album.sameAs}
              />
            )
          }
        />
      )}
    </div>
  );
};
