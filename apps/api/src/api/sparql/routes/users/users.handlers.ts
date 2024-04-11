import { Request, Response } from 'express';

import {
  CreateUserRequest,
  ErrorResponse,
  ExternalUrls,
  mapExternalUrl2property,
  UpdateType,
  UpdateUserRequest,
} from '@music-kg/data';
import { Person } from '@music-kg/sparql-data';

import { createUser } from './create-user';
import { deleteUser } from './delete-user';
import { getAllUsers } from './get-all-users';
import { getUser } from './get-user';
import { updateUser } from './update-user';
import { userExists } from './user-exists';

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

export const handleDeleteUser = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  try {
    await deleteUser(id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleGetAllUsers = async (_: Request, res: Response<string[] | ErrorResponse>): Promise<void> => {
  try {
    const users: string[] = await getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

export const handleGetUser = async (req: Request, res: Response<Person | ErrorResponse>): Promise<void> => {
  const id: string = req.params.id;

  try {
    const user: Person = await getUser(id);

    !user
      ? res.status(404).send({ message: `The user with id ${id} does not exist in the RDF database.` })
      : res.status(200).send({ ...user, id });
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};

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
