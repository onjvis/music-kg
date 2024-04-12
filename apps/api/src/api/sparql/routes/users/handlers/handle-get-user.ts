import { Request, Response } from 'express';

import { ErrorResponse } from '@music-kg/data';
import { Person } from '@music-kg/sparql-data';

import { getUser } from '../features';

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
