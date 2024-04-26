import { Request, Response } from 'express';

import { DataOrigin, ErrorResponse } from '@music-kg/data';

import { getEntityLinks } from '../features/get-entity-links';
import { getPrefixFromOrigin } from '../helpers/get-prefix-from-origin';

export const handleGetEntityLinks = async (req: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  const id: string = req.query.id as string;
  const origin: DataOrigin = req.query.origin as DataOrigin;

  if (!id) {
    res.status(400).send({ message: 'The request query parameter id is missing.' });
    return;
  }

  try {
    const entityIri = `${getPrefixFromOrigin(origin)}${id}`;
    const links: string[] = await getEntityLinks(entityIri);
    res.status(200).send(links);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
