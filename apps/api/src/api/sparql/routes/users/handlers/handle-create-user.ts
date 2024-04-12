import { Request, Response } from 'express';

import { CreateUserRequest, ErrorResponse } from '@music-kg/data';

import { createUser, userExists } from '../features';

export const handleCreateUser = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreateUserRequest = req.body as CreateUserRequest;

  if (!body?.id || !body?.email || !body?.name) {
    res.status(400).send({
      message: 'The request body is missing one or more of the following required properties: id, email, name.',
    });
    return;
  }

  try {
    // Will not create a new entity if there is already the entity with the same external ID
    if (body?.externalUrls?.spotify || body?.externalUrls?.wikidata) {
      if (await userExists({ externalUrls: body?.externalUrls })) {
        res.status(400).send({ message: 'The user already exists in the RDF database.' });
        return;
      }
    } else {
      if (await userExists({ id: body?.id })) {
        res.status(400).send({ message: `The user with id ${body.id} already exists in the RDF database.` });
        return;
      }
    }

    const createdIri: string = await createUser(body);
    res.set('Location', createdIri).sendStatus(201);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
