import { UploadedFileMetadata } from './uploaded-file-metadata.model';

export type UploadedFile = {
  index?: number;
  parsedMetadata: UploadedFileMetadata;
};
