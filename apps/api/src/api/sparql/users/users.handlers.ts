import { Request, Response } from 'express';

import { CreateUserRequest, ErrorResponse, UpdateUserRequest } from '@music-kg/data';
import { Person } from '@music-kg/sparql-data';

import { createUser } from './create-user';
import { deleteUser } from './delete-user';
import { getAllUsers } from './get-all-users';
import { getUser } from './get-user';
import { updateUser } from './update-user';

export const handleCreateUser = async (req: Request, res: Response<void | ErrorResponse>): Promise<void> => {
  const body: CreateUserRequest = req.body as CreateUserRequest;

  if (!body?.id || !body?.email || !body?.name) {
    res
      .status(400)
      .send({
        message: 'The request body is missing one or more of the following required properties: id, email, name.',
      });
    return;
  }

  try {
    const user: Person = await getUser(body.id);

    if (user) {
      res.status(400).send({ message: `The user with id ${body.id} already exists in the RDF database.` });
      return;
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
  const body: UpdateUserRequest = req.body as CreateUserRequest;
  const id: string = req.params.id;

  try {
    const user: Person = await getUser(id);

    if (!user) {
      if (!body?.email || !body?.name) {
        res
          .status(400)
          .send({
            message:
              'The user does not exist in the RDF database yet, however the request body is missing one or more of the following required properties: email, name.',
          });
        return;
      }

      const createdIri: string = await createUser({ id, name: body?.name, email: body?.email });
      res.set('Location', createdIri).sendStatus(201);
      return;
    }

    await updateUser(id, body);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({ message: error?.message });
  }
};
