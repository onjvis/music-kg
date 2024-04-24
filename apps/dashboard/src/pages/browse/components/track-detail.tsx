import { AxiosResponse } from 'axios';
import { FaAngleLeft } from 'react-icons/fa6';
import { IconContext } from 'react-icons';
import { useLoaderData, useNavigate } from 'react-router-dom';

import { mapExternalUrl2property } from '@music-kg/data';
import { MusicRecording } from '@music-kg/sparql-data';

import { FlexRow } from '../../../components/flex-row';
import { FlexTextRow } from '../../../components/flex-text-row';
import { AppRoute } from '../../../models/enums/app-route.enum';
import { duration2ms } from '../../../utils/duration2ms';
import { ms2timeStr } from '../../../utils/ms2timeStr';
import { CustomLink } from './custom-link';

export const TrackDetail = () => {
  const track: MusicRecording = (useLoaderData() as AxiosResponse)?.data;

  const navigate = useNavigate();

  const handleBack = (): void => navigate(-1);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-4">
        <IconContext.Provider value={{ size: '2em' }}>
          <FaAngleLeft className="cursor-pointer" onClick={handleBack} />
        </IconContext.Provider>
        <h2 className="font-bold">{track?.name}</h2>
      </div>
      {track?.id && <FlexTextRow label="MusicKG ID" value={track.id} />}
      {track?.inAlbum && (
        <FlexRow
          label="Album"
          element={<CustomLink linkTitle={track.inAlbum} to={`${AppRoute.BROWSE_ALBUMS}/${track.inAlbum}`} />}
        />
      )}
      {track?.byArtist && (
        <FlexRow
          label={Array.isArray(track.byArtist) ? 'Artists' : 'Artist'}
          element={
            Array.isArray(track.byArtist) ? (
              <div className="flex flex-col gap-1">
                {track.byArtist.map((artistId: string) => (
                  <CustomLink key={`${track.id}:artistId:${artistId}`} linkTitle={artistId} to={artistId} />
                ))}
              </div>
            ) : (
              <CustomLink linkTitle={track.byArtist} to={`${AppRoute.BROWSE_ARTISTS}/${track.byArtist}`} />
            )
          }
        />
      )}
      {track?.datePublished && (
        <FlexTextRow label="Date Published" value={new Date(track.datePublished).toLocaleDateString()} />
      )}
      {track?.duration && <FlexTextRow label="Duration" value={ms2timeStr(duration2ms(track?.duration))} />}
      {track?.isrcCode && <FlexTextRow labelClassName="italic" label="ISRC" value={track.isrcCode} />}
      {track?.sameAs && (
        <FlexRow
          label={Array.isArray(track.sameAs) ? 'External URLs' : 'External URL'}
          element={
            Array.isArray(track.sameAs) ? (
              <div className="flex flex-col gap-1">
                {track.sameAs.map((externalUrl: string) => (
                  <CustomLink
                    key={`${track.id}:externalUrl:${externalUrl}`}
                    capitalize={true}
                    linkTitle={mapExternalUrl2property(externalUrl) ?? externalUrl}
                    to={externalUrl}
                  />
                ))}
              </div>
            ) : (
              <CustomLink
                capitalize={true}
                linkTitle={mapExternalUrl2property(track.sameAs) ?? track.sameAs}
                to={track.sameAs}
              />
            )
          }
        />
      )}
    </div>
  );
};
