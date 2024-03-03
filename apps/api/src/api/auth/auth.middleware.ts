import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { ErrorResponse } from '@music-kg/data';

export const authenticateToken = (req: Request, res: Response<void | ErrorResponse>, next: NextFunction) => {
  const authorizationHeader: string = req.headers.authorization;
  const token: string = authorizationHeader?.split(' ')?.[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not found!' });
  }

  verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: error?.message });
    }

    res.locals.decoded = decoded;

    next();
  });
};
