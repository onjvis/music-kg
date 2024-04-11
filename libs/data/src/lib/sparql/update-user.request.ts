import { ExternalUrls } from './external-urls.model';

export type UpdateUserRequest = {
  email?: string;
  externalUrls?: ExternalUrls;
  name?: string;
};
