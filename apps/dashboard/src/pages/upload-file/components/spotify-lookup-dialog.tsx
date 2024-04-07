import { ChangeEvent, Fragment, useState } from 'react';

import { SpotifySearchResult } from '@music-kg/data';

import { ApiUrl } from '../../../models/api-url.model';
import httpClient from '../../../services/http-client';
import { SpotifyLookupDialogSelectionResult } from '../models/spotify-lookup-dialog-selection-result.model';
import { SpotifySearchParams } from '../models/spotify-search-params.model';

type SpotifyLookupDialogProps = {
  handleClose: () => void;
  handleSelect: (result: SpotifyLookupDialogSelectionResult) => void;
  searchParams: SpotifySearchParams;
};

export const SpotifyLookupDialog = ({ handleClose, handleSelect, searchParams }: SpotifyLookupDialogProps) => {
  const [includedParameters, setIncludedParameters] = useState<string[]>([]);
  const [data, setData] = useState<SpotifySearchResult[]>();

  const handleIncludeParametersChanged = (event: ChangeEvent<HTMLInputElement>): void => {
    const parameter: string = event.target.name;
    const newIncludedParameters: string[] = includedParameters.includes(parameter)
      ? includedParameters.filter((param: string) => param !== parameter)
      : [...includedParameters, parameter];

    setIncludedParameters(newIncludedParameters);
  };

  const handleSearch = async (): Promise<void> => {
    const { type, ...rest } = searchParams;
    const q: string = Object.entries(rest)
      .filter(([property, _]) => includedParameters.includes(property))
      .map(([property, value]) => `${property}:${value}`)
      .join(' ');
    const url = `${ApiUrl.SPOTIFY_SEARCH}?q=${q}&type=${type}`;

    httpClient.get(url).then((response) => setData(response?.data));
  };

  const handleItemClicked = (id: string): void => {
    handleSelect({ type: searchParams?.type, id });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-2 border-b-2 p-4">
        <h1>Search {searchParams?.type}</h1>
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex flex-row gap-4">
            <span>Include in search:</span>

            {searchParams?.album && (
              <div className="flex flex-row items-center gap-1">
                <input type="checkbox" id="album" name="album" onChange={handleIncludeParametersChanged} />
                <label htmlFor="album">Album name</label>
              </div>
            )}

            {searchParams?.artist && (
              <div className="flex flex-row items-center gap-1">
                <input type="checkbox" id="artist" name="artist" onChange={handleIncludeParametersChanged} />
                <label htmlFor="artist">Artist name</label>
              </div>
            )}

            {searchParams?.isrc && (
              <div className="flex flex-row items-center gap-1">
                <input type="checkbox" id="isrc" name="isrc" onChange={handleIncludeParametersChanged} />
                <label htmlFor="isrc">ISRC</label>
              </div>
            )}

            {searchParams?.track && (
              <div className="flex flex-row items-center gap-1">
                <input type="checkbox" id="track" name="track" onChange={handleIncludeParametersChanged} />
                <label htmlFor="track">Track name</label>
              </div>
            )}
          </div>
          <button className="btn-primary" disabled={includedParameters?.length < 1} onClick={handleSearch}>
            Search
          </button>
        </div>
        {data?.length ? (
          <Fragment>
            <span>Click {searchParams?.type} to apply Spotify ID</span>
            <div className="flex flex-col divide-y rounded-lg border-2">
              {data?.map((result: SpotifySearchResult) => (
                <div
                  key={result?.id}
                  className="flex flex-row justify-between gap-8 p-2 first:rounded-t-md last:rounded-b-md hover:cursor-pointer hover:bg-cyan-200"
                  onClick={() => handleItemClicked(result?.id)}
                >
                  <strong>{result?.name}</strong>
                  <span>{result?.id}</span>
                </div>
              ))}
            </div>
          </Fragment>
        ) : (
          <span>No results found. Try to include different parameters or edit the underlying form.</span>
        )}
      </div>

      <div className="flex flex-row justify-end gap-2 p-4">
        <button className="btn-secondary" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};
