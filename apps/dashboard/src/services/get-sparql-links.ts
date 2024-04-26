import { DataOrigin } from '@music-kg/data';

import { ApiUrl } from '../models/api-url.model';
import httpClient from './http-client';

export const getSparqlLinks = async (id: string, origin: DataOrigin): Promise<string[]> =>
  httpClient.get<string[]>(`${ApiUrl.SPARQL_LINKS}?id=${id}&origin=${origin}`).then((response) => response.data);
