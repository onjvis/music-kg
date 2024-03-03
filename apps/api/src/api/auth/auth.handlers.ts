import { Request, Response } from 'express';

import {
  CurrentUserResponse,
  ErrorResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@music-kg/data';

import { User } from '../../database/database.models';
import { collections } from '../../database/database.service';
import { encryptPassword, generateAccessToken, validatePassword } from './auth.helpers';

export const loginUser = async (req: Request, res: Response<LoginResponse | ErrorResponse>): Promise<void> => {
  const body: LoginRequest = req.body as LoginRequest;

  try {
    const user = await collections.users?.findOne({
      email: body.email,
    });

    if (user) {
      if (validatePassword(user.hash, body.password)) {
        const jwt: string = generateAccessToken({ email: user.email, id: user._id.toString() });
        res.status(200).json({ token: jwt });
      } else {
        res.status(400).json({ message: 'Wrong password!' });
      }
    } else {
      res.status(400).json({ message: `User ${body.email} does not exist.` });
    }
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
};

export const registerUser = async (req: Request, res: Response<RegisterResponse | ErrorResponse>): Promise<void> => {
  const body: RegisterRequest = req.body as RegisterRequest;

  try {
    const newUser: Partial<User> = { email: body.email };

    const user = await collections.users?.findOne<User>({
      email: body.email,
    });

    if (!user) {
      const hash: string = encryptPassword(body.password);

      const result = await collections.users?.insertOne({ ...newUser, hash });

      result
        ? res.status(201).json({ id: result.insertedId.toString(), email: body.email })
        : res.status(500).json({ message: 'Failed to create a new user.' });
    } else {
      res.status(400).json({ message: `User ${body.email} already exists.` });
    }
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
};

export const getCurrentUser = (_: Request, res: Response<void | CurrentUserResponse>): void => {
  const decoded = res.locals.decoded;

  decoded ? res.status(200).send({ id: decoded.id, email: decoded.email }) : res.sendStatus(401);
};
