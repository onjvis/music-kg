import axios from 'axios';
import { IAudioMetadata, parseBlob } from 'music-metadata-browser';
import { ChangeEvent, useState } from 'react';
import { IconContext } from 'react-icons';
import { FaRegTrashCan } from 'react-icons/fa6';

import { CreateRecordingRequest } from '@music-kg/data';

import { AlertData } from '../../components/alert/models/alert-data.model';
import { ErrorAlert } from '../../components/alert/error-alert';
import { SuccessAlert } from '../../components/alert/success-alert';
import { ApiUrl } from '../../models/api-url.model';
import httpClient from '../../services/http-client';
import { UploadedFileDetail } from './components/uploaded-file-detail';
import { UploadedFileItem } from './components/uploaded-file-item';
import { UploadedFileMetadata } from './models/uploaded-file-metadata.model';
import { UploadedFile } from './models/uploaded-file.model';
import { getSpotifyEntityPrefix } from './utils/get-spotify-entity-prefix';
import './upload-file.css';

export const UploadFile = () => {
  const [alertData, setAlertData] = useState<AlertData>();
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const filesMetadata: UploadedFileMetadata[] = [];

    if (!event.target.files) {
      return;
    }

    for (const file of Array.from(event.target.files)) {
      try {
        const metadata: IAudioMetadata = await parseBlob(file, { duration: true, skipCovers: true });
        const parsedMetadata: UploadedFileMetadata = {
          albumName: metadata?.common?.album,
          artistName: metadata?.common?.artist,
          date: metadata?.common?.date,
          duration: metadata?.format?.duration ? Math.floor(metadata?.format?.duration) : 0,
          isrc: metadata?.common?.isrc?.[0],
          title: metadata?.common?.title,
        };

        filesMetadata.push(parsedMetadata);
      } catch (error) {
        console.error(error);
      }
    }

    setUploadedFiles((prevState: UploadedFile[]) => [
      ...prevState,
      ...filesMetadata.map((md) => ({ parsedMetadata: md })),
    ]);
  };

  const handleFileDelete = (index: number): void => {
    const isSelectedFile = selectedFile?.index === index;

    setUploadedFiles((prevState: UploadedFile[]) => prevState.slice(0, index).concat(prevState.slice(index + 1)));

    if (isSelectedFile) {
      setSelectedFile(null);
    }
  };

  const handleSelect = (file: UploadedFile) => setSelectedFile(file);

  const handleUpdateFileMetadata = (updatedMetadata: UploadedFileMetadata) => {
    const selectedFileIndex = selectedFile?.index;

    if (selectedFileIndex !== undefined) {
      const files: UploadedFile[] = [...uploadedFiles];
      files[selectedFileIndex] = { ...selectedFile, parsedMetadata: updatedMetadata };

      setUploadedFiles(files);
      setSelectedFile(files[selectedFileIndex]);
    }
  };

  const handleCreatePlaylist = async (): Promise<void> => {
    const trackRequestsData: CreateRecordingRequest[] = [];

    for (const metadata of uploadedFiles.map((file: UploadedFile) => file.parsedMetadata)) {
      if (!metadata.artistName || !metadata.albumName || !metadata.title) {
        setAlertData({
          type: 'error',
          message:
            'Some files have missing required properties: the track title, the name of the artist or the name of the album!',
        });
        setTimeout(() => setAlertData(undefined), 3000);
        return;
      }

      const requestData: CreateRecordingRequest = {
        album: {
          name: metadata.albumName,
          ...(metadata.album
            ? { externalUrls: { spotify: `${getSpotifyEntityPrefix('album')}/${metadata.album}` } }
            : {}),
        },
        artists: {
          name: metadata.artistName,
          ...(metadata.artist
            ? { externalUrls: { spotify: `${getSpotifyEntityPrefix('artist')}/${metadata.artist}` } }
            : {}),
        },
        name: metadata.title,
        ...(metadata.date ? { datePublished: metadata.date } : {}),
        ...(metadata.duration ? { duration: Math.floor(metadata.duration * 1000) } : {}),
        ...(metadata.isrc ? { isrc: metadata.isrc } : {}),
        ...(metadata.track
          ? { externalUrls: { spotify: `${getSpotifyEntityPrefix('track')}/${metadata.track}` } }
          : {}),
      };

      trackRequestsData.push(requestData);
    }

    try {
      await Promise.all(
        trackRequestsData.map((data: CreateRecordingRequest) => httpClient.post(ApiUrl.SPARQL_RECORDINGS, data))
      );
      setAlertData({ type: 'success', message: `${uploadedFiles?.length} tracks successfully synchronized.` });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setAlertData({ type: 'error', message: error?.response?.data.message });
      }
    }

    setTimeout(() => setAlertData(undefined), 3000);
  };

  return (
    <div className="flex w-full flex-grow flex-col gap-4 self-center rounded-lg border-2 bg-white p-8">
      {alertData?.type === 'error' && <ErrorAlert message={alertData?.message} />}
      {alertData?.type === 'success' && <SuccessAlert message={alertData?.message} />}

      <div className="flex flex-row items-center justify-between gap-2">
        <h1>Upload file from your local music library</h1>
        <div className="flex flex-row gap-2">
          {!!uploadedFiles?.length && (
            <button className="btn-secondary" onClick={handleCreatePlaylist}>
              Synchronize tracks from uploaded files
            </button>
          )}
          <label className="btn-primary inline-block cursor-pointer">
            <input type="file" multiple onChange={handleFileUpload} />
            Upload files
          </label>
        </div>
      </div>

      <div className="flex flex-row items-start gap-4">
        <div className="flex w-2/3 flex-col gap-4">
          {selectedFile && <UploadedFileDetail file={selectedFile} updateFileMetadata={handleUpdateFileMetadata} />}
        </div>

        <div className="flex w-1/3 flex-col gap-2 rounded-lg border-2 p-2">
          <div className="flex flex-row items-center justify-between gap-2 p-2">
            <h2>Uploaded files</h2>
            <span className="text-xl">
              {uploadedFiles?.length} {uploadedFiles?.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          {uploadedFiles.map((file: UploadedFile, index: number) => {
            file = { ...file, index };

            return (
              <div
                className="flex flex-row items-center justify-between gap-2"
                key={`${index}:${file?.parsedMetadata?.title}`}
              >
                <UploadedFileItem
                  file={file}
                  handleSelect={handleSelect}
                  selected={selectedFile?.index === file?.index}
                />
                <IconContext.Provider value={{ size: '2em' }}>
                  <FaRegTrashCan className="cursor-pointer" onClick={() => handleFileDelete(index)} />
                </IconContext.Provider>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
