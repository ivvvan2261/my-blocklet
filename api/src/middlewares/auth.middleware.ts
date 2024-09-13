import { NextFunction, Request, Response } from 'express';

export default function authenticate(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    throw new Error('Not connected to DID wallet');
  }

  next();
}
