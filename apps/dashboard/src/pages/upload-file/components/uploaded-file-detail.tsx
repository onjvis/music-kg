import { RefObject, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IconContext } from 'react-icons';
import { CiLock, CiUnlock } from 'react-icons/ci';
import { FaSpotify } from 'react-icons/fa6';

import { AlertData } from '../../../components/alert/models/alert-data.model';
import { InfoAlert } from '../../../components/alert/info-alert';
import { SuccessAlert } from '../../../components/alert/success-alert';
import { SpotifyLookupDialogSelectionResult } from '../models/spotify-lookup-dialog-selection-result.model';
import { SpotifySearchParams } from '../models/spotify-search-params.model';
import { UploadedFile } from '../models/uploaded-file.model';
import { UploadedFileMetadata } from '../models/uploaded-file-metadata.model';
import { SpotifyLookupDialog } from './spotify-lookup-dialog';

type UploadedFileDetailProps = {
  file: UploadedFile;
  updateFileMetadata: (updatedMetadata: UploadedFileMetadata) => void;
};

export const UploadedFileDetail = ({ file, updateFileMetadata }: UploadedFileDetailProps) => {
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [spotifyLookupData, setSpotifyLookupData] = useState<SpotifySearchParams>();
  const [alertData, setAlertData] = useState<AlertData>();

  const dialogRef: RefObject<HTMLDialogElement> = useRef<HTMLDialogElement>(null);

  const { register, getValues, handleSubmit, setValue } = useForm<UploadedFileMetadata>({
    values: {
      title: file?.parsedMetadata?.title,
      date: file?.parsedMetadata?.date,
      duration: file?.parsedMetadata?.duration,
      artistName: file?.parsedMetadata?.artistName,
      albumName: file?.parsedMetadata?.albumName,
      isrc: file?.parsedMetadata?.isrc,
      track: file?.parsedMetadata?.track,
      artist: file?.parsedMetadata?.artist,
      album: file?.parsedMetadata?.album,
    },
  });

  const onSubmit: SubmitHandler<UploadedFileMetadata> = (data: UploadedFileMetadata): void => {
    if (!spotifyLookupData) {
      updateFileMetadata(data);

      // Lock the file for editing
      setEditMode(false);

      setAlertData({ type: 'success', message: 'Metadata successfully saved.' });
      setTimeout(() => setAlertData(undefined), 3000);
    }
  };

  const handleEditModeToggle = (): void => {
    setEditMode((editMode: boolean) => !editMode);
  };

  const handleOpenDialog = (): void => {
    dialogRef?.current?.showModal();
  };

  const handleCloseDialog = (): void => {
    setSpotifyLookupData(undefined);
    dialogRef?.current?.close();
  };

  const handleSpotifyLookup = (type: 'album' | 'artist' | 'track'): void => {
    const formValues: UploadedFileMetadata = getValues();
    const params: SpotifySearchParams = { type };

    if (type === 'track') {
      if (formValues?.isrc) {
        params['isrc'] = formValues?.isrc;
      }

      if (formValues?.title) {
        params['track'] = formValues?.title;
      }
    }

    if (formValues?.albumName && ['album', 'track'].includes(type)) {
      params['album'] = formValues?.albumName;
    }

    if (formValues?.artistName) {
      params['artist'] = formValues?.artistName;
    }

    setSpotifyLookupData(params);
    handleOpenDialog();
  };

  const handleSelect = (result: SpotifyLookupDialogSelectionResult) => {
    setValue(result?.type, result?.id);
    handleCloseDialog();
  };

  return (
    <div className="flex flex-1 flex-col justify-between gap-2 rounded-lg border-2 p-4">
      <dialog className="w-1/2 rounded-lg p-0" ref={dialogRef}>
        {spotifyLookupData && (
          <SpotifyLookupDialog
            handleClose={handleCloseDialog}
            handleSelect={handleSelect}
            searchParams={spotifyLookupData}
          />
        )}
      </dialog>

      <div className="flex flex-row justify-between gap-2">
        <h2>File metadata</h2>
        <button className="btn-primary flex flex-row items-center gap-2" onClick={handleEditModeToggle}>
          <IconContext.Provider value={{ size: '1.5em' }}>
            {isEditMode ? <CiLock /> : <CiUnlock />}
          </IconContext.Provider>
          <span>{isEditMode ? 'Lock' : 'Edit'}</span>
        </button>
      </div>

      {alertData?.type === 'success' && <SuccessAlert message={alertData?.message} />}

      <InfoAlert message="Use the Spotify lookup functionality and match fields with the right ID before saving." />

      <form className="flex flex-col justify-start gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          <label htmlFor="title">Title</label>
          <div className="flex flex-row items-center justify-between gap-1">
            <input
              className="w-1/2 disabled:cursor-not-allowed disabled:text-gray-300"
              id="title"
              type="text"
              {...register('title', { disabled: !isEditMode })}
            />
            {getValues('track') && (
              <input className="disabled:text-gray-300" disabled type="text" {...register('track')} />
            )}
            {isEditMode && (
              <button
                className="btn-secondary flex flex-row items-center gap-2"
                onClick={() => handleSpotifyLookup('track')}
              >
                <IconContext.Provider value={{ color: 'black', size: '1.5em' }}>
                  <FaSpotify />
                </IconContext.Provider>
                <span>Lookup track</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="isrc">ISRC</label>
          <input
            className="w-1/2 disabled:cursor-not-allowed disabled:text-gray-300"
            id="isrc"
            type="text"
            {...register('isrc', { disabled: !isEditMode })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="date">Date</label>
          <input
            className="w-1/2 disabled:cursor-not-allowed disabled:text-gray-300"
            id="date"
            type="date"
            {...register('date', { disabled: !isEditMode })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="duration">Duration (s)</label>
          <input
            className="w-1/2 disabled:cursor-not-allowed disabled:text-gray-300"
            id="duration"
            type="number"
            {...register('duration', { disabled: !isEditMode })}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="artist">Artist</label>
          <div className="flex flex-row items-center justify-between gap-2">
            <input
              className="w-1/2 disabled:cursor-not-allowed disabled:text-gray-300"
              id="artist"
              type="text"
              {...register('artistName', { disabled: !isEditMode })}
            />
            {getValues('artist') && (
              <input className="disabled:text-gray-300" disabled type="text" {...register('artist')} />
            )}
            {isEditMode && (
              <button
                className="btn-secondary flex flex-row items-center gap-2"
                onClick={() => handleSpotifyLookup('artist')}
              >
                <IconContext.Provider value={{ color: 'black', size: '1.5em' }}>
                  <FaSpotify />
                </IconContext.Provider>
                <span>Lookup artist</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="album">Album</label>
          <div className="flex flex-row items-center justify-between gap-2">
            <input
              className="w-1/2 disabled:cursor-not-allowed disabled:text-gray-300"
              id="album"
              type="text"
              {...register('albumName', { disabled: !isEditMode })}
            />
            {getValues('album') && (
              <input className="disabled:text-gray-300" disabled type="text" {...register('album')} />
            )}
            {isEditMode && (
              <button
                className="btn-secondary flex flex-row items-center gap-2"
                onClick={() => handleSpotifyLookup('album')}
              >
                <IconContext.Provider value={{ color: 'black', size: '1.5em' }}>
                  <FaSpotify />
                </IconContext.Provider>
                <span>Lookup album</span>
              </button>
            )}
          </div>
        </div>

        <button className="btn-primary w-1/4" type="submit" onClick={handleSubmit(onSubmit)} disabled={!isEditMode}>
          Save metadata
        </button>
      </form>
    </div>
  );
};
