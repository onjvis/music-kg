import { UploadedFile } from '../models/uploaded-file.model';

type SpotifyTrackItemProps = {
  file: UploadedFile;
  handleSelect: (file: UploadedFile) => void;
  selected: boolean;
};

export const UploadedFileItem = ({ file, handleSelect, selected }: SpotifyTrackItemProps) => {
  const handleFileClicked = (): void => handleSelect(file);

  return (
    <div
      className={`flex flex-auto flex-row items-center justify-between gap-4 rounded-lg border-2 p-4 hover:bg-teal-200 hover:cursor-pointer${
        selected ? ' bg-teal-200' : ''
      }`}
      onClick={handleFileClicked}
    >
      <div className="flex flex-col gap-1">
        <strong className="text-lg">{file?.parsedMetadata?.title ?? 'Track title'}</strong>
        <span>{file?.parsedMetadata?.artistName ?? 'Track artist'}</span>
      </div>
    </div>
  );
};
