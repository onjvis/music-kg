import { Request, Response } from 'express';

import { ErrorResponse, ExternalUrls, mapExternalUrl2property, UpdateType, UpdateUserRequest } from '@music-kg/data';
import { Person } from '@music-kg/sparql-data';

import { getUser, updateUser } from '../features';

export const handleUpdateUser = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  let body: UpdateUserRequest = req.body as UpdateUserRequest;
  const id: string = req.params.id;
  const updateType: UpdateType = (req.query.updateType as UpdateType) ?? UpdateType.REPLACE;

  if (!body) {
    res.status(400).send({ message: 'The request body is empty.' });
    return;
  }

  try {
    const user: Person = await getUser(id);

    if (!user) {
      res.status(400).send({ message: `The user with id ${id} does not exist in the RDF database.` });
      return;
    }

    if (updateType === UpdateType.APPEND) {
      const artistExternalUrls: ExternalUrls = user.sameAs
        ? Array.isArray(user.sameAs)
          ? user.sameAs
              .map((externalUrl: string): ExternalUrls => ({ [mapExternalUrl2property(externalUrl)]: externalUrl }))
              .reduce((result: ExternalUrls, obj: ExternalUrls): ExternalUrls => ({ ...result, ...obj }), {})
          : { [mapExternalUrl2property(user.sameAs)]: user.sameAs }
        : {};

      body = {
        ...body,
        ...(body.externalUrls ? { externalUrls: { ...artistExternalUrls, ...body.externalUrls } } : {}),
      };
    }

    await updateUser(id, body);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
