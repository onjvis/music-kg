import { NextFunction, Request, Response } from 'express';

export const checkUserId = (req: Request, res: Response, next: NextFunction): void => {
  const id: string = req.params.id || req.body?.id;

  if (res.locals.decoded?.id !== id) {
    res.sendStatus(403);
    return;
  }

  next();
};
