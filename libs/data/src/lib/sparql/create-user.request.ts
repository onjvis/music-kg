import { ExternalUrls } from './external-urls.model';

export type CreateUserRequest = {
  id: string;
  email: string;
  name: string;
  externalUrls?: ExternalUrls;
};
