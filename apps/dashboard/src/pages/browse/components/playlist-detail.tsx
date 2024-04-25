import { AxiosResponse } from 'axios';
import { FaAngleLeft } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';

import { mapExternalUrl2property } from '@music-kg/data';
import { MusicPlaylist } from '@music-kg/sparql-data';

import { FlexRow } from '../../../components/flex-row';
import { FlexTextRow } from '../../../components/flex-text-row';
import { AppRoute } from '../../../models/enums/app-route.enum';
import { CustomLink } from './custom-link';

export const PlaylistDetail = () => {
  const playlist: MusicPlaylist = (useLoaderData() as AxiosResponse)?.data;
  const { origin } = useParams();

  const navigate = useNavigate();

  const handleBack = (): void => navigate(-1);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-start justify-between gap-2">
        <div className="flex flex-row items-center gap-4">
          <IconContext.Provider value={{ size: '2em' }}>
            <FaAngleLeft className="cursor-pointer" onClick={handleBack} />
          </IconContext.Provider>
          <h2 className="font-bold">{playlist?.name}</h2>
        </div>
        {playlist?.image && (
          <img
            className="rounded-md hover:h-1/3 hover:w-1/3"
            alt={playlist?.name ?? 'artist'}
            src={playlist.image}
            height="32"
            width="32"
          />
        )}
      </div>
      {playlist?.id && <FlexTextRow label="MusicKG ID" value={playlist.id} />}
      {playlist?.description && <FlexTextRow label="Description" value={playlist.description} />}
      {playlist?.dateCreated && (
        <FlexTextRow label="Date Created" value={new Date(playlist.dateCreated).toLocaleString()} />
      )}
      {playlist?.dateModified && (
        <FlexTextRow label="Date Modified" value={new Date(playlist.dateModified).toLocaleString()} />
      )}
      {playlist?.numTracks && <FlexTextRow label="Number of Tracks" value={playlist.numTracks.toString()} />}
      {playlist?.track && (
        <FlexRow
          label={Array.isArray(playlist.track) ? 'Tracks' : 'Track'}
          element={
            Array.isArray(playlist.track) ? (
              <div className="flex flex-col items-end gap-1">
                {playlist.track.map((trackId: string) => (
                  <CustomLink
                    key={`${playlist.id}:trackId:${trackId}`}
                    linkTitle={trackId}
                    to={`${AppRoute.BROWSE_TRACKS}/${origin}/${trackId}`}
                  />
                ))}
              </div>
            ) : (
              <CustomLink linkTitle={playlist.track} to={`${AppRoute.BROWSE_TRACKS}/${origin}/${playlist.track}`} />
            )
          }
        />
      )}
      {playlist?.url && (
        <FlexRow
          label={Array.isArray(playlist.url) ? 'External URLs' : 'External URL'}
          element={
            Array.isArray(playlist.url) ? (
              <div className="flex flex-col gap-1">
                {playlist.url.map((externalUrl: string) => (
                  <CustomLink
                    key={`${playlist.id}:externalUrl:${externalUrl}`}
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
                linkTitle={mapExternalUrl2property(playlist.url) ?? playlist.url}
                newTab={true}
                to={playlist.url}
              />
            )
          }
        />
      )}
    </div>
  );
};
