import { NextFunction, Request, Response } from 'express';

import { DataOrigin } from '@music-kg/data';

import { authenticateToken } from '../auth/auth.middleware';

const ALLOWED_ORIGINS: DataOrigin[] = [DataOrigin.LOCAL, DataOrigin.SPOTIFY, DataOrigin.LOCAL_USERS];

export const doCommonChecks = (req: Request, res: Response, next: NextFunction): void => {
  authenticateToken(req, res, () => doOriginCheck(req, res, next));
};

export const doCreateRequirementsCheck = (req: Request, res: Response, next: NextFunction): void => {
  const body = req.body;

  if (!body?.name) {
    res.status(400).send({ message: 'The request body is missing the required property name.' });
    return;
  }

  next();
};

export const doUpdateRequirementsCheck = (req: Request, res: Response, next: NextFunction): void => {
  const body = req.body;

  if (!body) {
    res.status(400).send({ message: 'The request body is empty.' });
    return;
  }

  next();
};

export const doOriginCheck = (req: Request, res: Response, next: NextFunction): void => {
  const origin: DataOrigin = req.query.origin as DataOrigin;

  if (!origin) {
    res.status(400).send({ message: 'The request query is missing parameter origin.' });
    return;
  }

  if (!ALLOWED_ORIGINS.includes(origin)) {
    res.status(400).send({ message: `The origin ${origin} is not allowed.` });
    return;
  }

  next();
};
